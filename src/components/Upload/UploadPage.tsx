
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { Loader } from 'src/common/components/Loader/Loader';
import Typography from 'src/common/components/Typography/Typography';
import { useAppTheme } from 'src/common/context/AppTheme';
import { useRestroStyle } from 'src/components/Restaurant/RestroStyle';
import { useTableStyle } from 'src/components/ServiceArea/ServiceTable';

import { AppDispatch, RootState } from 'src/store';
import UploadContainer from './Upload/UploadContainer';
import { generateInitialState, IUploadFormState ,  generateInitialUploadContainerErrorsData,
  IUploadErrors,
  validateUpload,
  getFileName,
  getMimeType,} from './Upload/UploadContainerUtils';

const Upload = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const button = useButtonStyle();
  const tablestyle = useTableStyle();
  const styles = useRestroStyle();

  const [form, setForm] = useState<IUploadFormState>(generateInitialState());
  const [loading,setLoading] = useState<boolean>(false)
  const [uploadedFiles, setUploadedFiles] = useState<IFilesData[]>([]);
   const [infoError, setInfoError] = useState<IUploadErrors>({
    ...generateInitialUploadContainerErrorsData(),
  });


  const { theme } = useAppTheme();
  // const { loading, loading: rolesLoading } = useSelector(
  //   (state: RootState) => state.user.userList
  // );
  const dispatch = useDispatch<AppDispatch>();








  const handleUploadSubmit = ()=>{

     
    try {

   const { isValid, errors } = validateUpload(form,uploadedFiles);
    setInfoError(errors);
    console.log("errors",errors)
    if (!isValid) return;

    const payLoad = {
     };

    setLoading(true);
    const formData = new FormData();
    uploadedFiles.forEach((image) => {
      if (!image?.id && image.blob) {
        const fileName = getFileName(image?.uri) ?? image?.fileName;      
        const blobType = image.blob.type ? image.blob.type : getMimeType(image.fileName);
        const file = new Blob([image.blob], { type: blobType });
        formData.append('file', file, fileName);
      }
    });

    
    // formData.append('bannerName', payLoad.bannerName.trim());
    // formData.append('sellerId', payLoad.sellerId.toString());
    // formData.append('expirationDate', payLoad.expirationDate.toString());

    // const result = await saveBanner(formData);
    // setSnackbarVisible(true);
    
  } catch (err) {
    setInfoError((prevState) => ({
      ...prevState,
      apiError: TranslateMessage('Admin.Sida.APP.API.Error'),
    }));
  } finally {
    setLoading(false);
  }
  }



  function renderHeading() {
    return (
      <>
        <View
          style={[
            layout.container,
            styles.headerContainer,
            layout.paddingTop26,
          ]}
        >
          <Typography variant="subHeading">
            {TranslateMessage('Admin.Sida.App.Layout.Upload')}
          </Typography>
          <View style={styles.breadcrumbContainer}>
            <Text style={styles.breadcrumb}>
              {TranslateMessage('Admin.Delivery.App.Home')}
            </Text>
            <Text style={styles.breadcrumb}>/</Text>
            <Text style={[styles.breadcrumb, styles.bredcrumActive]}>
              {TranslateMessage('Admin.Sida.App.Layout.Upload')}
            </Text>
          </View>
        </View>
        <Divider style={[layout.DividerSperator, layout.marBottom30]} />
      </>
    );
  }

  return (
    <>
      {/* <Loader loading={loading || rolesLoading} /> */}
      <ScrollView>
        <View style={[layout.containerPadding]}>
          {renderHeading()}
          <View style={[layout.cardBox, layout.tableContainer]}>
            <View style={[tablestyle.container]}>
              <View style={layout.flexCol}>
                <ScrollView
                  horizontal={true}
                  style={layout.flexCol}
                  contentContainerStyle={layout.flexCol}
                >
                  <UploadContainer
                    form={form}
                    setForm={setForm}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                    infoError={infoError}
                    setInfoError={setInfoError}
                  />
                </ScrollView>
              </View>
              <Pressable onPress={handleUploadSubmit}>
                {false ? (
                  <View style={[button.btnBase, button.btnPrimary]}>
                    <Loader loading={true} color={theme.colors.textInverse} />
                  </View>
                ) : (
                  <Text style={[button.btnBase, button.btnPrimary]}>
                    {TranslateMessage('Admin.Sida.App.Upload.btn')}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Upload;
