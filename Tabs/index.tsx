import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// @ts-expect-error: Funciona mas a IDE estava reclamando
import Ionicons from "react-native-vector-icons/Ionicons";

import Map from "./Map";
import Register from "./Register";
import Addresses from "./Addresses";
import Export from "./Export";
import Profile from "./Profile";

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarStyle: {
    backgroundColor: "#347D5C"
  },
  tabBarActiveTintColor: "#3D9970",
  tabBarInactiveTintColor: "#FFF"
}

const tabs = [
  //{ Função de mapa está incompleta no momento
  //  name: "Mapa",
  //  component: Map,
  //  icon: "map"
  //},
  {
    name: "Cadastrar",
    component: Register,
    icon: "add-circle-outline"
  },
  {
    name: "Endereços",
    component: Addresses,
    icon: "list-outline"
  },
  {
    name: "Exportar",
    component: Export,
    icon: "download-outline"
  },
  {
    name: "Perfil",
    component: Profile,
    icon: "person"
  }
];

export default function Tabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} color={color} size={size} />
            )
          }}
        />
      ))
      }
    </Tab.Navigator>
  )
}