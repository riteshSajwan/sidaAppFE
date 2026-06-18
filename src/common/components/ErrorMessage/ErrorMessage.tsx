import { Text, View } from 'react-native';
import { useFormStyle } from 'src/common/assets/styles/form';

interface IErrorMessageContainerProps {
    message?: string | null | undefined;
}
const ErrorMessageContainer = (props: IErrorMessageContainerProps) => {
    const formStyle = useFormStyle();
    if (!props.message) return <View />;

    const lines = props.message.split('\n').filter(Boolean);

    return (
        <View>
            {lines.map((line, index) => (
                <Text key={index} style={formStyle.errorMessage}>
                    {lines.length > 1 ? `• ${line}` : line}
                </Text>
            ))}
        </View>
    );
}

export default ErrorMessageContainer