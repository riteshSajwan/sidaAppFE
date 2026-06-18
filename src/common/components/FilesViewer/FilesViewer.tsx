import { FunctionComponent, useState } from 'react';
import { Image, ImageStyle, Pressable, View } from 'react-native';
import { useUploadImageStyle } from 'src/common/assets/styles/uploadimage';
import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import {
  getFileType,
  MediaIconName,
  openPdfDocument,
} from 'src/common/components/FilesViewer/FilesViewerUtil';
import { Loader } from 'src/common/components/Loader/Loader';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useTenantId } from 'src/common/hooks/useTenantId';
import ImageModal from 'src/components/Restaurant/ProfilePreview/ImagePreviewer';
import { useProfilePreview } from 'src/components/Restaurant/ProfilePreview/ProfilePreviewStyle';
import { checkIfEmpty } from 'src/components/Restaurant/ProfilePreview/ProfilePreviewUtil';
import { Icon } from 'src/submodules/iconlibrary/src';
import { RenderImage } from 'src/common/components/Image/Image';

interface IFileViewerProps {
  filesData: IFilesData[];
  loading?: boolean;
  removeFile?: (index: number) => void;
  showDefaultImage?:boolean;
  disabled?:boolean;
  handleError?: (error: string) => void;
}

const FileViewer: FunctionComponent<IFileViewerProps> = (props) => {
  const { filesData = [], removeFile, showDefaultImage = false, loading,disabled=false } = props;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const uploadimage = useUploadImageStyle();
  const imagestyle = useProfilePreview();
  const {theme} = useAppTheme();
  const { tenantId } = useTenantId();

  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  function renderImages(index: number, imageURI: string) {
    return (
      <View key={index} style={uploadimage.itemImageBox}>
        <Pressable onPress={() => openImage(imageURI)}>
          <RenderImage
            uri={imageURI}
            style={[uploadimage.itemImage as ImageStyle]}
          />
        </Pressable>

        {removeFile && (
          <Pressable
            style={uploadimage.closeButton}
            disabled={disabled}
            onPress={() => removeFile(index)}
          >
            <Icon name='closeAlt' color={theme.colors.iconInverse} size={12}/>
          </Pressable>
        )}
        {selectedImage && (
          <ImageModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            selectedImage={selectedImage}
          />
        )}

      </View>
    );
  }


  function renderFiles(
    index: number,
    pdfURI: string,
    fileName: string,
    iconName: MediaIconName
  ) {
    function onClickPdfFile() {
      openPdfDocument(pdfURI, fileName, tenantId);
    }
    const iconColor = iconName === MediaIconName.EXCEL ? '#217346' : '#007bff';
    return (
      <View key={index} style={uploadimage.pdfborder}>
        <Pressable onPress={onClickPdfFile}>
          <Icon name={iconName} size={100} color={iconColor} />
          {/* <Text>{fileName}</Text> */}
        </Pressable>
        {removeFile && (
          <Pressable
            style={uploadimage.closeButton}
            onPress={() => removeFile(index)}
          >
            <Icon name='closeAlt' color={theme.colors.iconInverse} size={12} />
          </Pressable>
        )}
      </View>

    );
  }

  function renderDocFiles(index: number, docURI: string, fileName: string) {
    function onClickDocFile() {
      openPdfDocument(docURI, fileName, tenantId);
    }

    return (
      <View key={index} style={uploadimage.pdfborder}>
        <Pressable onPress={onClickDocFile}>
          <Icon name={MediaIconName.DOCUMENT} size={100} color='#007bff' />
          {/* <Text>{fileName}</Text> */}
        </Pressable>
        {removeFile && (
          <Pressable
            style={uploadimage.closeButton}
            onPress={() => removeFile(index)}
          >
            <Icon name='closeAlt' color={theme.colors.iconInverse} size={12} />
          </Pressable>
        )}
      </View>
    );
  }

  function renderFile(fileData: IFilesData, index: number) {
    const { uri: fileUri, fileName } = fileData;
    const fileType = getFileType(checkIfEmpty(fileData?.blob?.type), checkIfEmpty(fileData.fileType));
    switch (fileType) {
      case 'image':
        return renderImages(index, fileUri);
      case 'pdf':
        return renderFiles(index, fileUri, fileName, MediaIconName.PDF);
      case 'txt':
        return renderFiles(index, fileUri, fileName, MediaIconName.FILE);
      case 'document':
        return renderDocFiles(index, fileUri, fileName);
      case 'excel':
        return renderFiles(index, fileUri, fileName, MediaIconName.EXCEL);
      default:
        return renderImages(index, fileUri);
    }
  }
  function renderFileContainer() {
    return <View style={{ flexDirection: 'row', gap: 20 }}>
      {filesData.map((fileData: IFilesData, index: number) => renderFile(fileData, index))}
      {loading && <View >
        <Loader loading={true} size={20} styles={{}} />
      </View>}
    </View>
  }
  function renderImageContainer() {
    return filesData.length > 0 ? renderFileContainer() : <Image
      source={require('src/common/assets/images/no-image.png')}
      style={[imagestyle.userImageImg as ImageStyle]}
    />
  }

  return showDefaultImage ? renderImageContainer() : renderFileContainer();
};

export default FileViewer;
