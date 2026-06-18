import { RegisteredStyle, StyleProp, ViewStyle } from "react-native";

export interface IFilterModalProps {
    visible: boolean;
    hideModal: () => void;
    title: string;
    children: React.ReactNode;
    onClear: () => void;
    onSave: () => void;
    disableSave?: boolean;
    style?:RegisteredStyle<ViewStyle>| StyleProp<ViewStyle>;
  }
