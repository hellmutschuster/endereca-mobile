import { getAddresses, registerAddress } from "@/services/Address";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite/legacy";
import moment from 'moment';

/*

Aqui se encontra o principal código responsável pela funcionalidade offline do aplicativo. Tem
bastante coisa então vou explicando um por um

*/

/*

Essa interface aqui é a interface do objeto endereço que é recebido do banco de dados MongoDB. A
estrutura da entidade endereço no SQLite é levemente diferente da do Mongo.

*/
interface Address {
    _id: string,
    name?: string,
    locationType: string,
    createdAt: string,
    createdBy: {name: string, _id: string},
    project: string,
    observations?: string,
    plusCode: string,
    location: {type: string, coordinates: [number, number]}
  }

/*

Essa função aqui é responsável por criar o banco de dados SQLite (Offline). Depois de criado
ele é preenchido pelos dados retirados do MongoDB

*/
export async function setupOfflineDatabase() {
    const db = SQLite.openDatabase('addresses.db');
  
    // Deletar o banco se existir
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS addresses_to_add', [], () => {
        console.log('Tabela "addresses" deletada');
      });
      tx.executeSql('DROP TABLE IF EXISTS addresses', [], () => {
        console.log('Tabela "addresses_to_add" deletada');
      });
    });
  
    /* 
    
    São criadas duas tabelas por um motivo simples: Existe a tabela dos endereços que já estavam no
    banco de dados do Mongo, e existe a tabela dos endereços que vão ser adicionados assim que o 
    modo offline for desligado

    */
    db.transaction(tx => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS addresses (
          _id TEXT PRIMARY KEY NOT NULL,
          name TEXT,
          locationType TEXT,
          createdBy TEXT,
          createdByName TEXT,
          project TEXT,
          observations TEXT,
          plusCode TEXT,
          latitude REAL,
          longitude REAL,
          createdAt TEXT
        )
      `);
  
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS addresses_to_add (
          _id TEXT PRIMARY KEY NOT NULL,
          name TEXT,
          locationType TEXT,
          createdBy TEXT,
          createdByName TEXT,
          project TEXT,
          observations TEXT,
          plusCode TEXT,
          latitude REAL,
          longitude REAL,
          createdAt TEXT
        )
      `);
    });

    console.log("Tabelas criadas");

    // Puxa os dados da API
    await getAddresses(false).then(addresses => {
      db.transaction(tx => {
        addresses.forEach((address : Address) => {
          const { _id, name, locationType, createdBy, project, observations, plusCode, createdAt } = address;

          /* 
          
          Os três atributos seguintes são estruturados de maneira diferente do Mongo. Eu tinha planos para criar uma função
          de proximidade para endereços no modo offline também, mas não deu tempo.

          O createdAt é guardado pois ele é necessário quando o modo offline é desligado. Mas como não é possível puxar
          o nome do cadastrador no banco offline, então cria-se um campo novo apenas com o nome

          */
          const latitude = address.location.coordinates[1];
          const longitude = address.location.coordinates[0];
          const createdByName = address.createdBy.name;
  
          tx.executeSql(
            `INSERT INTO addresses (_id, name, locationType, createdBy, createdByName, project, observations, plusCode, latitude, longitude, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [_id, name ? name : null, locationType, createdBy._id, createdByName, project, observations ? observations : null, plusCode, latitude, longitude, createdAt]
          );
        });
      });
    });

    //db.transaction(tx => {
    //    tx.executeSql('SELECT * FROM addresses', [], (_, { rows }) => {
    //      console.log('Dados na tabela addresses:');
    //      rows._array.forEach((row) => {
    //        console.log(row);
    //      });
    //    });
    //});
}

/*

Essa função aqui é responsável por pesquisar um termo em todos os campos dos endereços

*/
export async function searchAddressesOffline(searchString: string) {
    const db = SQLite.openDatabase('addresses.db');
    
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        const regex = `%${searchString}%`;
  
        tx.executeSql(
          `SELECT * FROM addresses WHERE
            name LIKE ? OR
            locationType LIKE ? OR
            project LIKE ? OR
            observations LIKE ? OR
            plusCode LIKE ?`,
          [regex, regex, regex, regex, regex],
          (_, { rows }) => {
            resolve(rows._array);
          },
        );
      });
    });
}

/*

Essa função pega todos os endereços do banco SQLite

*/
export async function getAddressesOffline() {
  const db = SQLite.openDatabase('addresses.db');

  return new Promise((resolve, reject) => {
      db.transaction(tx => {
          tx.executeSql(
              `SELECT * FROM addresses`,
              [],
              (_, { rows }) => {
                  resolve(rows._array);
              },
              (_, error) => {
                  reject(error);
                  return false;
              }
          );
      });
  });
}

/*

Essa função funciona do mesmo jeito que o filtered_search.

*/
export async function searchFilteredAddressesOffline(filters: {
    name?: string;
    locationType?: string;
    createdAt?: string;
    createdBy?: string;
    project?: string;
    observations?: string;
    plusCode?: string;
}) {
    const db = SQLite.openDatabase('addresses.db');
  
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        let query = `SELECT * FROM addresses WHERE 1=1`;
        const params: any[] = [];
  
        if (filters.name) {
          query += ` AND name LIKE ?`;
          params.push(`%${filters.name}%`);
        }
        if (filters.locationType) {
          query += ` AND locationType LIKE ?`;
          params.push(`%${filters.locationType}%`);
        }
        if (filters.createdAt) {
          query += ` AND createdAt LIKE ?`;
          params.push(`%${filters.createdAt}%`);
        }
        if (filters.project) {
          query += ` AND project LIKE ?`;
          params.push(`%${filters.project}%`);
        }
        if (filters.observations) {
          query += ` AND observations LIKE ?`;
          params.push(`%${filters.observations}%`);
        }
        if (filters.plusCode) {
          const formattedPlusCode = filters.plusCode.replace(/ /g, "+");
          query += ` AND plusCode LIKE ?`;
          params.push(`%${formattedPlusCode}%`);
        }
        if (filters.createdBy) {
          query += ` AND createdByName LIKE ?`;
          params.push(`%${filters.createdBy}%`);
        }
  
      tx.executeSql(
        query,
        params,
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

/*

Essa função pega todos os elementos que foram adicionados de maneira offline e sobe no banco
de dados MongoDB

*/
export async function synchronizeDatabase() {
  const db = SQLite.openDatabase('addresses.db');

  return new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
          tx.executeSql(
              'SELECT * FROM addresses_to_add',
              [],
              async (_, { rows: { _array } }) => {
                  try {
                      for (const address of _array) {
                          const formattedAddress = {
                              name: address.name,
                              locationType: address.locationType,
                              createdBy: address.createdBy,
                              project: address.project,
                              observations: address.observations,
                              plusCode: address.plusCode,
                              location: {
                                  type: "Point",
                                  coordinates: [address.longitude, address.latitude]
                              },
                          };

                          console.log(formattedAddress)
                          // @ts-ignore
                          await registerAddress(formattedAddress, false);
                      }

                      resolve();
                  } catch (error) {
                      console.error("Erro ao sincronizar o banco de dados:", error);
                      reject(error);
                  }
              },
              (_, error) => {
                  console.error("Erro ao buscar dados da tabela addresses_to_add:", error);
                  reject(error);
                  return false;
              }
          );
      });
  });
}

// Essa função procura um endereço no banco de dados pelo ID

export async function getOneAddressOffline(addressId: string) {
  const db = SQLite.openDatabase('addresses.db');

  return new Promise<any>((resolve, reject) => {
      db.transaction(tx => {
          tx.executeSql(
              'SELECT * FROM addresses WHERE _id = ?',
              [addressId],
              (_, { rows }) => {
                  if (rows && rows._array.length > 0) {
                      console.log(rows._array[0]);
                      resolve(rows._array[0]); // Retorna o objeto encontrado
                  } else {
                      resolve(null); // Nenhum resultado encontrado
                  }
              },
              (_, error) => {
                  console.error("Erro ao buscar o endereço no banco de dados:", error);
                  reject(error);
                  return false;
              }
          );
      });
  });
}

/*

Como dito na função de criação de tabelas, quando um endereço é adicionado de maneira offline,
ele adiciona em duas tabelas: Uma para ser usada pelas funções offline do aplicativo, e a outra
guarda os endereços que serão adicionados quando o modo offline for desligado

*/
export async function registerAddressOffline(address: {
  name?: string;
  locationType: string;
  createdBy: string;
  project: string;
  observations?: string;
  plusCode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}, table_name: string) {
  const db = SQLite.openDatabase(`addresses.db`);

  // Obter informações adicionais
  const createdAt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
  const createdByName = await AsyncStorage.getItem("userName");
  const _id = Date.now().toString();

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // Query para inserir o endereço na tabela 'addresses'
      const query = `
        INSERT INTO ${table_name} 
          (_id, name, locationType, createdBy, createdByName, project, observations, plusCode, latitude, longitude, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const params = [
        _id,
        address.name || null,
        address.locationType,
        address.createdBy,
        createdByName,
        address.project,
        address.observations || null,
        address.plusCode,
        address.location.coordinates[1], // latitude
        address.location.coordinates[0], // longitude
        createdAt
      ];

      console.log(params);

      tx.executeSql(query, params, 
        (_, result) => {
          console.log("Insert successful", result);
          resolve();
        }, 
        (_, error) => {
          console.error("Insert failed", error);
          reject(error);
          return false;
        }
      );
    });
  });
}


  