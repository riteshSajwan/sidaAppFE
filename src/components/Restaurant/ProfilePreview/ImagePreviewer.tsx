import React from 'react';
import { Modal, View, Image, Pressable, Text } from 'react-native';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { RenderImage } from 'src/common/components/Image/Image';

interface ImageModalProps {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selectedImage: string | null;
}

const ImageModal: React.FC<ImageModalProps> = ({ modalVisible, selectedImage, setModalVisible }) => {
    const layout = useLayoutStyle();
    return (
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
            <Pressable style={layout.modalView} onPress={() => setModalVisible(false)}>
                {selectedImage && (
                    <View style={layout.imageContainer}>
                        <View style={layout.imageInsideContainer}>
                            <RenderImage
                                uri={selectedImage}
                                style={layout.modalImage}
                            />
                            <Pressable
                                style={[layout.modalClose,]}
                                onPress={() => setModalVisible(false)}>
                                <Text style={layout.modalText}>✕</Text>
                            </Pressable>
                        </View>

                    </View>
                )}
            </Pressable>
        </Modal>
    );
};

export default ImageModal;


