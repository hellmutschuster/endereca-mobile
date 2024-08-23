import React, { createContext, useState, useEffect, SetStateAction, Dispatch } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*

Esse trecho de código é a raiz do funcionamento do "modo offline", pois com ele toda a aplicação
sabe qual o modo que está sendo usado

Quando fui fazer isso pela primeira vez, pensei em algo mais dinâmico, sem precisar ativar ou
desativar o modo. Mas acabou sendo algo muito complicado e eu sabia que se estudasse o suficiente
para fazer algo assim, não teria tempo de fazer muitas coisas do aplicativo. Aí fui pela solução
mais simples, que funciona bem

*/

interface ModeContext {
  isOffline: boolean;
  setIsOffline: Dispatch<SetStateAction<boolean>>;
}

// Essa variável define qual o modo do aplicativo
export const ModeContext = createContext<ModeContext>({
  isOffline: false,
  setIsOffline: () => {},
});

export const ModeProvider = ({ children }: any) => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const loadMode = async () => {
      const storedMode = await AsyncStorage.getItem('isOffline');
      if (storedMode !== null) {
        setIsOffline(JSON.parse(storedMode));
      }
    };

    loadMode();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('isOffline', JSON.stringify(isOffline));
  }, [isOffline]);

  return (
    <ModeContext.Provider value={{ isOffline, setIsOffline }}>
      {children}
    </ModeContext.Provider>
  );
};
