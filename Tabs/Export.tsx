import { ModeContext } from "@/app/ModeContext";
import { AppButton } from "@/components/AppButton";
import { AppCheckBox } from "@/components/AppCheckBox";
import { AppTextInput } from "@/components/AppTextInput";
import { AppTitle } from "@/components/AppTitle";
import { filterAddresses } from "@/services/Address";
import { saveAsCSV, saveAsKML } from "@/utils/conversions";
import { VStack, Box, Select } from "native-base";
import { Dispatch, useContext, useState } from "react";

// TODO: Fazer um campo para filtrar por data

// TODO: Fazer uma função que "desmarca" uma opção de exportação se você escolher a outra"

export default function Export(){
  const { isOffline } = useContext(ModeContext);
  const [name, setName] = useState("");
  const [locationType, setLocationType] = useState("");
  // const [createdAt, setCreatedAt] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [project, setProject] = useState("");
  const [observations, setObservations] = useState("");
  const [plusCode, setPlusCode] = useState("");
  const [format, setFormat] = useState("");
  const [searchResult, setSearchResult] : [[], Dispatch<[]>] = useState([]);

  function setKML() {
    setFormat("KML");
  }

  function setCSV() {
    setFormat("CSV");
  }

  async function exportAddresses() {
    if(format === "CSV") {
      saveAsCSV(searchResult);
    }
    else {
      saveAsKML(searchResult);
    }
  }

  async function search() {
    const result = await filterAddresses(
      {
        ...(name && { name }),
        ...(locationType && { locationType }),
        ...(createdBy && { createdBy }),
        ...(project && { project }),
        ...(observations && { observations }),
        ...(plusCode && { plusCode })
      },
      isOffline
    );

    if(result) {
      setSearchResult(result)
    }
  }

  return (
    <VStack flex={1} alignItems="flex-start" justifyContent="flex-start" p={5} bgColor="white">
      <AppTitle fontSize="xl" color="green.800">
        Exportar
      </AppTitle>

      <AppTextInput
          placeholder="Nome"
          value={name}
          onChangeText={setName}
      />

      <Select
        selectedValue={locationType}
        mt={3}
        w="100%"
        borderRadius="lg"
        size="lg"
        bgColor="gray.100"
        color="gray.300"
        shadow={3}
        accessibilityLabel="Escolha o tipo de localização"
        placeholder="Tipo do local"
        onValueChange={itemValue => setLocationType(itemValue)}
      >
        <Select.Item label="Escolha o tipo de localização" value=""/>
        <Select.Item label="Domicílio Particular" value="Domicílio Particular"/>
        <Select.Item label="Domicílio Coletivo" value="Domicílio Coletivo"/>
        <Select.Item label="Estabelecimento Agropecuário" value="Estabelecimento Agropecuário"/>
        <Select.Item label="Estabelecimento de Ensino" value="Estabelecimento de Ensino"/>
        <Select.Item label="Estabelecimento de Saúde" value="Estabelecimento de Saúde"/>
        <Select.Item label="Estabelecimento Religioso" value="Estabelecimento Religioso"/>
        <Select.Item label="Estabelecimento Outros" value="Estabelecimento Outros"/>
        <Select.Item label="Edicação em Construção" value="Edicação em Construção"/>
      </Select>

      <AppTextInput
          placeholder="Responsável pelo cadastro"
          value={createdBy}
          onChangeText={setCreatedBy}
      />

      <AppTextInput
          placeholder="Projeto"
          value={project}
          onChangeText={setProject}
      />

      <AppTextInput
          placeholder="Observações"
          value={observations}
          onChangeText={setObservations}
      />

      <AppTextInput
          placeholder="Pluscode"
          value={plusCode}
          onChangeText={setPlusCode}
      />

      <VStack flexDir="row">
        <AppCheckBox
          value={format}
          mt={3}
          onChange={setCSV}
        >
          CSV
        </AppCheckBox>

        <AppCheckBox
          value={format}
          mt={3}
          ml={5}
          onChange={setKML}
        >
          KML
        </AppCheckBox>

        <Box flexGrow={1} />

        <AppButton mt={3} w="20%" onPress={search}>
          Filtrar
        </AppButton>
      </VStack>

      <AppTitle fontSize="md" mt={0}>
        {searchResult.length} resultados
      </AppTitle>

      <Box flexGrow={1} />

      <AppButton mb={5} onPress={exportAddresses}>
        Download
      </AppButton>
    </VStack>
  );
}