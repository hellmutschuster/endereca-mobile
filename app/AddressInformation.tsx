import { AppButton } from "@/components/AppButton";
import { AppTitle } from "@/components/AppTitle";
import { deleteOneAddress, getOneAddress } from "@/services/Address";
import { formatDateString } from "@/utils/conversions";
import { Box, Button, Divider, Modal, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState, FC, useContext } from "react";
import MapView, { Marker } from "react-native-maps";
import { ModeContext } from "./ModeContext";

/*

Essa tela é chamada quando se clica no ícone de lupa na tela de vizualização de endereço. Nela
são exibidos vários detalhes, além de uma vizualização no mapa.

*/

export default function AddressInformation({ route, navigation }: any) {
    const { isOffline } = useContext(ModeContext)
    const [addressData, setAddressData] = useState<any>(null);
    const [region, setRegion] = useState({
        latitude: -48.876667,
        longitude: -123.393333,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });
    const [nearbyWaypoints, setNearbyWaypoints] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { addressId } = route.params;

    useEffect(() => {
        async function getAddressData() {
            if (!addressId) return null;

            const result = await getOneAddress(addressId, isOffline);
            setAddressData(result);
            if (result && result.location && result.location.coordinates) {
                setRegion({
                    latitude: result.location.coordinates[1],
                    longitude: result.location.coordinates[0],
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                });
            }

            console.log("Nearby Waypoints:", result.nearbyWaypoints);

            setNearbyWaypoints(result.nearbyWaypoints);

            console.log("Updated nearbyWaypoints state:", result.nearbyWaypoints);
        }
        getAddressData();
    }, [addressId]);

    /* 
    
    Essa interface e SafeComponentLoader era uma função que eu estava fazendo para tentar carregar o MapView. Se ele não
    conseguisse, pelo menos não crashava o aplicativo todo. Mas acabei não terminando

    */

    interface SafeComponentLoaderProps {
        component: FC;
        fallback?: React.ReactNode;
    }

    const SafeComponentLoader: FC<SafeComponentLoaderProps> = ({ component: Component, fallback }) => {
        const [hasError, setHasError] = useState(false);
      
        try {
          if (hasError) {
            throw new Error();
          }
          return <Component />;
        } catch (error) {
          return <>{fallback || <Text fontWeight="bold" color="gray.500" mt={5}>Falha ao carregar o Mapa</Text>}</>;
        }
    };

    const handleDelete = async () => {
        try {
            const result = await deleteOneAddress(addressId);
            console.log(result)
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao deletar o endereço", error);
        }
    };

    /*
    
    Por algum motivo, o MapView faz o aplicativo parar de funcionar quando é chamado em um celular
    de verdade (no emulador não há esse problema). Eu não consegui descobrir o motivo

    */

    return (
        <ScrollView flex={1} p={5} backgroundColor="white">
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header fontWeight="bold" color="gray.500">Confirmar Deleção</Modal.Header>
                    <Modal.Body>
                        <Text>Você deseja deletar esse endereço?</Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group variant="ghost" space={2}>
                            <AppButton w="40%" onPress={() => setShowModal(false)}>Cancelar</AppButton>
                            <AppButton w="40%" onPress={handleDelete} bgColor="red.700">Deletar</AppButton>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <AppTitle fontSize="xl" color="green.800" alignSelf="flex-start">
                {addressData?.plusCode}
            </AppTitle>

            <Text fontWeight="bold" color="gray.500" mt={5}>
                {addressData?.name ? "Nome: " + addressData?.name : " "} {"\n"}
                Tipo do Local: {addressData?.locationType} {"\n"}
                Criado em: {addressData?.createdAt ? formatDateString(addressData?.createdAt) : null} {"\n"}
                Criado por: {addressData?.createdBy.name} {"\n"}
                Projeto: {addressData?.project} {"\n"}
                Latitude: {addressData?.location.coordinates[1]} {"\n"}
                Longitude: {addressData?.location.coordinates[0]} {"\n"}
                {addressData?.observations ? "Observações: " + addressData?.observations : " "}
            </Text>

            <Box>

                <Divider mt={5} />

                <AppTitle fontSize="xl" color="green.800" alignSelf="flex-start">
                    Locais Próximos
                </AppTitle>

                {nearbyWaypoints.length > 0 ? (
                    nearbyWaypoints.map((address: { name?: string, plusCode: string }, index: any) => (
                        <VStack mb={0.5} w="100%" bgColor="white" key={index}>
                            <Text fontWeight="bold" color="gray.500" mt={2}>
                                {address.name ? "Nome: " + address.name : " "} {"\n"}
                                PlusCode: {address.plusCode}
                            </Text>
                        </VStack>
                    ))
                ) : (
                    <Text>Nenhum local próximo encontrado.</Text>
                )}

            </Box>

            <Divider mt={5} />

            <MapView
                region={region}
                style={{
                    width: "100%",
                    height: 300,
                    marginTop: 20
                }}
            >
                {addressData && addressData.location && addressData.location.coordinates && (
                    <Marker
                        coordinate={{
                            latitude: addressData.location.coordinates[1],
                            longitude: addressData.location.coordinates[0],
                        }}
                        title={addressData.name ? addressData.name : null}
                    />
                )}
            </MapView>

            <Box flexGrow={1} />

            <AppButton backgroundColor="red.700" onPress={() => setShowModal(true)} mb={10}>
                Deletar Endereço
            </AppButton>
        </ScrollView>
    );
}
