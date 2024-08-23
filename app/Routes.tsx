import React from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

/*

Bem simples, define as rotas do aplicativo e sua navegação

*/

const Tab = createNativeStackNavigator();

import Login from "./Login";
import Tabs from "@/Tabs";
import AddressInformation from "./AddressInformation";

export default function Rotas(){
  return(
    <NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen
          name="Login" component={Login} options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Tabs" component={Tabs} options={{ headerShown: false }}
        />
        <Tab.Screen
          name="AddressInformation" component={AddressInformation} options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}