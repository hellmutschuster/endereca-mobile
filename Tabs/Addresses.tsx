import { NavigationProps } from "@/@types/navigation";
import { AddressCard } from "@/components/AddressCard";
import { AppButton } from "@/components/AppButton";
import { AppTextInput } from "@/components/AppTextInput";
import { AppTitle } from "@/components/AppTitle";
import { searchAddresses } from "@/services/Address";
import { formatDateString } from "@/utils/conversions";
import { VStack, ScrollView } from "native-base";
import { useState } from "react";
import { useContext } from "react";
import { ModeContext } from "@/app/ModeContext";

export interface Address {
  _id: string,
  name?: string,
  locationType: string,
  createdAt: string,
  createdBy: {name: string},
  project: string,
  observations?: string,
  plusCode: string,
  location: string
}

/*

Essa tela aqui cuida da pesquisa em todos os campos dos endereços, e da visualização de
cards com informações desses endereços. Também é possível clicar no ícone de lupa para
mostrar outra tela que vai prover informações adicionais sobre o endereço

*/
export default function Addresses({ navigation }: NavigationProps<"Addresses">){
  const { isOffline } = useContext(ModeContext);
  const [searchState, setSearchState] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  // Função de pesquisa
  async function search() {
    const result = await searchAddresses(searchState, isOffline);

    if(result) {
      setSearchResult(result)
    }
  }

  return (
    <ScrollView flex={1} bgColor="white" p={5}>
      <VStack flex={1} alignItems="flex-start" justifyContent="flex-start">
        <AppTitle fontSize="xl" color="green.800" alignSelf="flex-start">
            Endereços
        </AppTitle>

        <AppTextInput
            placeholder="Pesquisar Endereço"
            value={searchState}
            onChangeText={setSearchState}
        />

        <AppButton mt={3} onPress={search}>
          Pesquisar
        </AppButton>
      </VStack>

      {searchResult?.map((address: Address, index) => (
        <VStack mb={0.5} w="100%" bgColor="white" key={index}>
          <AddressCard
            name={address.name}
            locationType={address.locationType}
            createdAt={formatDateString(address.createdAt)}
            createdBy={address.createdBy.name}
            project={address.project}
            observations={address.observations}
            plusCode={address.plusCode}
            location={address.location}
            onPress={() => navigation.navigate("AddressInformation", { addressId: address._id })}
          />
      </VStack>
      ))}
    </ScrollView>
  );
}