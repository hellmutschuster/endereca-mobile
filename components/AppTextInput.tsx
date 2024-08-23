import { Input, FormControl } from "native-base";

/*

Talvez o componente mais importante da aplicação, pois é responsável por
receber inputs de texto. Parece meio bagunçado mas funciona bem

*/

interface InputProps {
  label?: string;
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  mt?: number;
  width?: string;
}

export function AppTextInput ({ 
  label, 
  placeholder, 
  secureTextEntry = false,
  mt = 3,
  width = "100%",
  value,
  onChangeText
} : InputProps) : JSX.Element {
  return (
    <FormControl mt={mt}>
      {label && <FormControl.Label>{label}</FormControl.Label>}
      <Input
        placeholder={placeholder}
        size="lg"
        w={width}
        borderRadius="lg"
        bgColor="gray.100"
        secureTextEntry={secureTextEntry}
        shadow={3}
        value={value}
        onChangeText={onChangeText}
      />
    </FormControl>
  );
};