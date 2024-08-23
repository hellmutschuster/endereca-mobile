import { Text, ITextProps } from "native-base"
import { ReactNode } from "react"

// Pode ser o nome de título, mas é usado como texto comum também

interface TituloProps extends ITextProps {
  children: ReactNode
}

export function AppTitle({ children, ...rest }: TituloProps){
  return (
    <Text
      fontSize="2xl"
      fontWeight="bold"
      color="gray.500"
      textAlign="center"
      mt={5}
      {...rest}
    >
      {children}
    </Text>
  )
}