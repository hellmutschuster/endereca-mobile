import { NativeBaseProvider, StatusBar } from 'native-base';
import { THEMES } from "@/styles/themes";
import Routes from './Routes';
import { ModeProvider } from './ModeContext';

// A raiz do aplicativo, tudo começa aqui

export default function App() {
  return (
    <ModeProvider>
      <NativeBaseProvider theme={THEMES}>
        <StatusBar backgroundColor={THEMES.colors.green[800]} />
        <Routes />
      </NativeBaseProvider>
    </ModeProvider>
  );
}
