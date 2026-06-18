import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, IconButton, Modal, Portal, Text } from 'react-native-paper';
import color from '../../assets/styles/color';
import { isIOSPlatform } from '../../utils/platformUtil';

interface CustomErrorModalSelectorProps {
    visible: boolean;
    onClose: () => void;
    message: string;
}

const CustomErrorModalSelector: React.FC<CustomErrorModalSelectorProps> = ({ visible, onClose, message }: CustomErrorModalSelectorProps) => {

    return (
        <Portal>
            <Modal visible={visible} contentContainerStyle={styles.dialogContainer}>
                <View style={styles.modalBodyContainer}>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Icon source='close' size={25} color={'#000000'} />
                    </Pressable>
                    <IconButton
                        icon='alert'
                        size={25}
                        iconColor='#FFA600'
                        style={{ margin: 0 }}
                    />
                    <Text style={styles.modalBodyText}>{message}</Text>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalBodyContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    dialogContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        zIndex: 2,
        padding: 20,
        width: '92%',
        marginHorizontal: '4%',
        marginBottom: isIOSPlatform() ? 70 : 0,
        top: isIOSPlatform() ? -60 : 0
    },
    modalBodyText: {
        fontSize: 16,
        color: color.color_303030.color,
        fontFamily: 'Barlow500',
        lineHeight: 24,
        paddingHorizontal: 15,
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
});

export default CustomErrorModalSelector;