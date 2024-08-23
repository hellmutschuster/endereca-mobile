import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { Address } from "@/interfaces/Address";
import { getAddressesOffline, getOneAddressOffline, registerAddressOffline, searchAddressesOffline, searchFilteredAddressesOffline } from "@/database/offlineDatabase";

/*

A lógica de quase todas as funções aqui é bem simples. Se o modo offline estiver habilitado,
então ele se comunica com o SQLite por meio de funções específicas. Senão, então ele faz
requests para a API

*/

// Devolve o Token guardado no Async Storage
async function getTokenHeader() {
    const token = await AsyncStorage.getItem("token");
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return config;
}

/*

Todos os dados fornecidos para as telas do aplicativo seguem a estrutura JSON que vem da 
API. Portanto, é muito melhor ter uma função que formata os dados do SQLite do mesmo jeito
que a API do que ter dois jeitos diferentes de consumir esses dados

A função abaixo serve justamente para isso

*/
export function formatResult(result: Object[]) {
    const formattedResult = result.map((address: any) => ({
        location: {
          type: "Point",
          coordinates: [address.longitude, address.latitude]
        },
        _id: address._id,
        name: address.name || undefined,
        locationType: address.locationType,
        createdBy: {
          _id: address.createdBy,
          name: address.createdByName,
        },
        project: address.project,
        observations: address.observations || undefined,
        plusCode: address.plusCode,
        createdAt: address.createdAt
    }));

    return formattedResult;
}

export async function getAddresses(isOffline: boolean) {
    if(isOffline) {
        try {
            const result: any = await getAddressesOffline();
            return formatResult(result);
        }
        catch(error){
            console.log(error);
            return null;
        }
    }
    else {
        try {
            const result = await api.get("/addresses", await getTokenHeader());
            return result.data;
        }
        catch(error){
            console.log(error);
            return null;
        }
    }
}

export async function searchAddresses(searchString: string, isOffline: boolean) {
    if(isOffline) {
        try {
            const result: any = await searchAddressesOffline(searchString);
      
            return formatResult(result);
          } catch (error) {
            console.log(error);
            return null;
        }
    }
    else {
        try {
            const result = await api.get(`/addresses/search?searchString=${searchString}`, await getTokenHeader());
            return result.data;
        }
        catch(error){
            console.log(error);
            return null;
        }
    }
}

export async function filterAddresses(searchParams: object, isOffline: boolean) {
    if(isOffline) {
        try{
            const result: any = await searchFilteredAddressesOffline(searchParams);
      
            return formatResult(result);
          } catch (error) {
            console.log(error);
            return null;
        }
    }
    else {
        let searchString = "/addresses/filtered_search?";
    
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(searchParams)) {
            params.append(key, value);
        }

        searchString += params.toString();

        try {
            const result = await api.get(searchString, await getTokenHeader());
            return result.data;
        }
        catch(error) {
            console.log(error);
            return null;
        }
    }
}

export async function registerAddress(address: Address, isOffline: boolean) {
    if(isOffline) {
        await registerAddressOffline(address, "addresses");
        await registerAddressOffline(address, "addresses_to_add");
        return {}; // Gambiarra braba, não estou orgulhoso. Isso serve para que o toast (aquele texto de confirmação) dê um feedback positivo.
    }
    else {
        if(!address) return null;

        try {
            const result = await api.post("/addresses", address, await getTokenHeader());
            return result.data;
        }
        catch(error) {
            console.log(error);
            return null;
        }
    }
}

export async function getOneAddress(addressId: string, isOffline: boolean) {
    if(isOffline) {
        const result = await getOneAddressOffline(addressId);
        
        // Não consegui usar a função de formação aqui por algum motivo, aí tive
        // que fazer na "mão" mesmo pois estava sem tempo
        const formattedResult = {
            location: {
                type: "Point",
                coordinates: [result.longitude, result.latitude]
              },
              _id: result._id,
              name: result.name || undefined,
              locationType: result.locationType,
              createdBy: {
                _id: result.createdBy,
                name: result.createdByName,
              },
              project: result.project,
              observations: result.observations || undefined,
              plusCode: result.plusCode,
              createdAt: result.createdAt,
              nearbyWaypoints: 0
        }

        return formattedResult;
    }
    else {
        if(!addressId) return null;

        try {
            const result = await api.get(`/addresses/${addressId}`, await getTokenHeader());

            console.log(result.data)

            return result.data;
        }
        catch(error) {
            console.log(error);
            return null;
        }
    }
}

export async function deleteOneAddress(addressId: string) {
    if(!addressId) return null;

    try {
        const result = await api.delete(`/addresses/${addressId}`, await getTokenHeader());
        return result.data;
    }
    catch(error) {
        console.log(error);
        return null;
    }
}