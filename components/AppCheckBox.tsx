import { Checkbox, ITextProps } from "native-base";
import { ReactNode } from "react";

interface CheckBoxProps extends ITextProps{
    value: string
    children: ReactNode
    mt?: number
    ml?: number
    onChange?: (event: any) => void;
  }

export function AppCheckBox({ 
    children,
    value,
    mt,
    ml,
    onChange
}: CheckBoxProps) {
    return (
        <Checkbox
            _text={{color: "gray.500", ml: 0}}
            _checked={{bg: "green.500"}}
            mt={mt}
            ml={ml}
            value={value}
            onChange={onChange}
        >
            {children}
        </Checkbox>
    );
}