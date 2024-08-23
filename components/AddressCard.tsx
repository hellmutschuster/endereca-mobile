import { VStack, Text, Box } from "native-base";
import { AppTitle } from "./AppTitle";
import { AppButton } from "./AppButton";
// @ts-expect-error: Funciona mas a IDE estava reclamando
import Ionicons from "react-native-vector-icons/Ionicons";

/*

Esse aqui é um componente importante, pois ele é responsável por exibir informações
de um endereço na tela de pesquisa geral

*/

interface CardProps {
    name?: string,
    locationType: string,
    createdAt: string,
    createdBy: string,
    project: string,
    observations?: string,
    plusCode: string,
    location: string,
    onPress?: () => void;
}

export function AddressCard({
    name,
    locationType,
    createdAt,
    createdBy,
    project,
    observations,
    plusCode,
    location,
    onPress
}: CardProps, { navigation }: any) {
    return(
        <VStack w="99%" alignSelf="center" borderRadius="lg" p={5} shadow={3} mt={5} bgColor="white">
            <VStack flexDir="row">
                <AppTitle fontSize="lg" alignSelf="flex-start" mt={0}>
                    {plusCode} {"\n"}
                </AppTitle>

                <Box flexGrow={1} />

                <Box w="11%" alignSelf="center">
                    <AppButton mt={-5} onPress={onPress}>
                        <Ionicons name="search-outline" color="#fff"/>
                    </AppButton>
                </Box>
            </VStack>
            <Text fontWeight="bold" color="gray.500">
                Tipo do Local: {locationType} {"\n"}
                Criado em: {createdAt} {"\n"}
                Criado por: {createdBy} {"\n"}
                Projeto: {project}
                {observations ? "\nObservações: " + observations : " "}
                {name ? "\nNome: " + name: " "}
            </Text>
        </VStack>
    );
};