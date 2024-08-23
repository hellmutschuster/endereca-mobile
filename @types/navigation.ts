import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


export type ListaTelas = {
  Login: undefined;
  Addresses: undefined;
  Export: undefined;
  Map: undefined;
  Profile: undefined;
  Register: undefined;
  AddressInformation: {addressId: string}
}

export type NavigationProps< T extends keyof ListaTelas > = {
  navigation: NativeStackNavigationProp<ListaTelas, T>;
  route: RouteProp<ListaTelas, T>
}