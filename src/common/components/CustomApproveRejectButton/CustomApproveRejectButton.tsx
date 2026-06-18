import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { IApproveRejectProps } from 'src/common/components/CustomApproveRejectButton/CustomApproveRejectButtonUtil';
import { RequestType } from 'src/components/RequestManagement/RequestListUtil';

const CustomApproveRejectButton: React.FC<IApproveRejectProps> = ({
    toggleModal,
    handleRequestApproveOrRejection,
}) => {
    const { t: TranslateMessage } = useTranslation();
    const layout = useLayoutStyle();
    const button = useButtonStyle();
    return (
        <View style={[layout.rowContainer, layout.flexCol]}>
            <Pressable style={layout.flexCol} onPress={toggleModal}>
                <Text
                    style={[
                        button.btn,
                        button.btnOutlineDanger,
                        layout.borderWidth_1,
                    ]}
                >
                    {TranslateMessage(
                        'Admin.Delivery.App.OnboardingRequest.Reject'
                    )}
                </Text>
            </Pressable>
            <Pressable style={layout.flexCol}>
                <Text
                    style={[button.btn, button.btnPrimary]}
                    onPress={() => handleRequestApproveOrRejection(RequestType.APPROVED, null)}
                >
                    {TranslateMessage(
                        'Admin.Delivery.App.OnboardingRequest.Approve'
                    )}
                </Text>
            </Pressable>
        </View>
    );
}


export default CustomApproveRejectButton;