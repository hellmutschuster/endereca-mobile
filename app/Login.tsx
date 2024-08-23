import { VStack, Image, Box, useToast } from "native-base";
import { AppButton } from "@/components/AppButton";
import { AppTextInput } from "@/components/AppTextInput";
import { AppTitle } from "@/components/AppTitle";
import { useEffect, useState } from "react";
import { performLogin } from "@/services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
// @ts-expect-error: Funciona mas a IDE estava reclamando
import Logo from "@/assets/Logo.png";

/*

Essa é a tela de Login. Não existe tela de registro pois o registro de novas contas deverá ser feito
direto pela API por questões de segurança

Esse useState é o estado inicial de cada variável

*/

export default function Login({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function verifyLogin() {
      const token = await AsyncStorage.getItem("token");
      if(token) {
        navigation.replace("Tabs");
      }
      setLoading(false);
    }
    verifyLogin();
  });

  async function login() {
    const result = await performLogin(email, password);
    if(result) {
      const { token } = result;
      AsyncStorage.setItem("token", token);

      const decodedToken = jwtDecode(token) as any;
      const userId = decodedToken.id;
      AsyncStorage.setItem("userId", userId);
      navigation.replace("Tabs");
    }
    else {
      toast.show({
        title: "Erro no login",
        description: "O email ou senha não conferem",
        backgroundColor: "red.500"
      });
    }
  }

  if(loading){
    return null;
  }

  return (
    <VStack flex={1} alignItems="center" justifyContent="center" p={5}>
      <Image source={require("@/assets/Logo.png")} alt="Logo Endereça" style={{height: 50, resizeMode: "contain"}}/>

      <AppTitle>
        Faça login em sua conta
      </AppTitle>

      <Box>
        <AppTextInput
          label="Email"
          placeholder="Insira seu endereço de e-mail"
          value={email}
          onChangeText={setEmail}
        />
        <AppTextInput
          label="Senha"
          placeholder="Insira sua senha"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      </Box>
      <AppButton onPress={login}>Entrar</AppButton>
    </VStack>
  );
}