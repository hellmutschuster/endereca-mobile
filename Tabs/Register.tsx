import { AppButton } from "@/components/AppButton";
import { AppTextInput } from "@/components/AppTextInput";
import { AppTitle } from "@/components/AppTitle";
import { VStack, ScrollView, Box, Text, useToast, Select } from "native-base";
import { useContext, useEffect, useState } from "react";
// @ts-expect-error: Funciona mas a IDE estava reclamando
import Ionicons from "react-native-vector-icons/Ionicons";
import { registerAddress } from "@/services/Address";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { ModeContext } from "@/app/ModeContext";
const OpenLocationCode = require('open-location-code').OpenLocationCode;

/*

Essa tela aqui cuida do registro de endereços. O valor do Pluscode é calculado
dinamicamente à medida que o endereço vai sendo digitado

*/
export default function Register(){
  const openLocationCode = new OpenLocationCode();
  const { isOffline } = useContext(ModeContext)
  const [plusCode, setPlusCode] = useState("00000000+0000");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [name, setName] = useState("");
  const [locationType, setLocationType] = useState("");
  const [project, setProject] = useState("");
  const [observations, setObservations] = useState("");
  const toast = useToast();

  async function getUserLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    const location = await Location.getCurrentPositionAsync();
    setLatitude(String(location.coords.latitude));
    setLongitude(String(location.coords.longitude));
  }

  async function register(){
    const result = await registerAddress({
      ...(name && { name }), // Adiciona a propriedade name apenas se ela não estiver vazia
      locationType: locationType,
      createdBy: await AsyncStorage.getItem("userId") || " ", // Para fazer o Typescript parar de chorar, pois se der string vazia não vai registrar
      project: project,
      ...(observations && {observations}), // Mesma coisa de cima
      plusCode: plusCode,
      location: {
        "type": "Point",
        "coordinates": [longitude, latitude]
      }
    }, isOffline);

    // Esse "toast" é um quadrado que aparece para notificar o usuário se conseguiu ou não registrar
    if (result) {
      toast.show({
        title: 'Endereço cadastrado',
        description: `Pluscode: ${plusCode}`,
        backgroundColor: 'green.500',
      });
    }
    else {
      toast.show({
        title: 'Erro ao cadastrar endereço',
        description: 'Verifique os dados e tente novamente',
        backgroundColor: 'red.500',
      })
    }
  }

  function calculatePlusCode(latitude: string, longitude: string) {
    const plusCode = openLocationCode.encode(latitude, longitude, 12) || "00000000+0000";
    setPlusCode(plusCode);
  }

  useEffect(() => {
    calculatePlusCode(latitude, longitude);
  });

  return (
    <ScrollView flex={1} bgColor="white">
      <VStack flex={1} alignItems="flex-start" justifyContent="flex-start" p={5}>
        <AppTitle fontSize="xl" color="green.800" alignSelf="flex-start">
            Cadastrar
        </AppTitle>

        <Box>
          <AppTextInput
            label="Nome"
            placeholder="Insira o nome do local (opcional)"
            value={name}
            onChangeText={setName}
          />

          <Text fontSize="sm" fontWeight="bold" color={"gray.500"} mt={3} mb={1}>Tipo do Local</Text>
          <Select
            selectedValue={locationType}
            mt={0}
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
            label="Projeto"
            placeholder="Insira o nome do projeto"
            value={project}
            onChangeText={setProject}
          />

          <AppTextInput
            label="Observações"
            placeholder="Adicione observações (opcional)"
            value={observations}
            onChangeText={setObservations}
          />

          <Text fontSize="sm" fontWeight="bold" color={"gray.500"} mt={3} mb={1}>Localização</Text>
          <VStack flexDir="row">
            <Box w="45%">
              <AppTextInput
                placeholder="Lat"
                mt={0}
                width="90%"
                value={latitude}
                onChangeText={setLatitude}
              />
            </Box>
            <Box w="45%">
              <AppTextInput
                placeholder="Lon"
                mt={0}
                width="90%"
                value={longitude}
                onChangeText={setLongitude}
              />
            </Box>
            <Box w="10%" alignSelf="center">
              <AppButton mt={0} onPress={getUserLocation}>
                <Ionicons name="location-outline" color="#fff"/>
              </AppButton>
            </Box>
          </VStack>

          <Text fontSize="sm" fontWeight="bold" color={"gray.500"} mt={3} mb={1}>Pluscode</Text>

          <Text color="green.800" fontWeight="bold" fontSize="md">{plusCode}</Text>
      </Box>

      <AppButton onPress={register}>
        Cadastrar Local
      </AppButton>

      </VStack>
    </ScrollView>
  );
}