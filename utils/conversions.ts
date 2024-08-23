// @ts-expect-error: Funciona mas a IDE estava reclamando
import tokml from "geojson-to-kml";
import { saveFile } from "./fileHandlers";

interface Address {
    name?: string,
    locationType: string,
    createdBy: {
        email: string
    }
    createdAt: Date
    project: string,
    observations?: string,
    plusCode: string,
    location: {
        type: string
        coordinates: [number, number]
    }
}

// Pega o formato de data do MongoDB e converte para algo mais amigável para humanos
export function formatDateString(date: string) {
    return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)} ${date.slice(11, 19)}`;
}

// Converte uma lista de endereços para um objeto CSV e depois salva o arquivo
export function saveAsCSV(list_of_addresses: Address[]) {
    const csvString = [
        [
            "Nome",
            "Tipo de Localização",
            "Criado em",
            "Responsável",
            "Projeto",
            "Observações",
            "Pluscode",
            "Latitude",
            "Longitude"
        ],
        ...list_of_addresses.map(address => [
            address["name"],
            address["locationType"],
            address["createdAt"],
            address["createdBy"]["email"],
            address["project"],
            address["observations"],
            address["plusCode"],
            address["location"]["coordinates"][1],
            address["location"]["coordinates"][0]
          ])
        ]
         .map(e => e.join(",")) 
         .join("\n");
    
    saveFile(csvString, "csv");
}

// Converte uma lista de endereços para um objeto KML e depois salva o arquivo
export function saveAsKML(list_of_addresses: Address[]) {
    const obj = convertToGeoJSON(list_of_addresses);
    const kmlString = tokml(obj);
    saveFile(kmlString, "kml");
}

// Função auxiliar do saveAsKML, pois talvez no futuro fosse útil para o GEO ter esse formato separado
function convertToGeoJSON(list_of_addresses: Address[]) {
    const geoJSON = {
        type: "FeatureCollection",
        features: list_of_addresses.map(address => ({
          type: "Feature",
          geometry: {
            type: address.location.type,
            coordinates: address.location.coordinates
          },
          properties: {
            name: address.name || address.locationType,
            Pluscode: `${address.plusCode}`,
            Tipo_local: `${address.locationType}`,
            Criado_por: `${address.createdBy.email}`,
            Criado_em: `${address.createdAt}`,
            Projeto: `${address.project}`,
            Observacoes: `${address.observations || address.locationType}`
          }
        }))
      };
    
      return geoJSON;
}