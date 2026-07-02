import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useButtonStyle } from 'src/common/assets/styles/button';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import Typography from 'src/common/components/Typography/Typography';
import {
  generateInitialForm,
  generateInitialFormErrors,
  IFormData,
  IFormErrors,
  validateArchitectDetailsForm,
} from './ArchitectDetailsPageUtils';
import { useDocumentUploadStyle } from './DocumentUploads/DocumentUpload';
import DocumentUploads from './DocumentUploads/DocumentUploads';
import {
  DOCUMENT_FIELDS,
  generateInitialErrors,
  generateInitialFilesState,
  IDocumentErrors,
  IDocumentFilesState,
  validateDocumentUploads,
} from './DocumentUploads/DocumentUploadsUtils';
import FormInputs from './FormInputs/FormInputs';

const ArchitectDetailsPage = () => {
  const { t: TranslateMessage } = useTranslation();
  const layout = useLayoutStyle();
  const button = useButtonStyle();
  const styles = useDocumentUploadStyle();
  const [errors, setErrors] = useState<IDocumentErrors>(generateInitialErrors);
  const [loading, setLoading] = useState<boolean>(false);
  const [pickerErrors, setPickerErrors] = useState<Record<string, string>>({});
  const [documentFiles, setDocumentFiles] = useState<IDocumentFilesState>(generateInitialFilesState);
  const [form, setForm] = useState<IFormData>(generateInitialForm);
  const [formErrors, setFormErrors] = useState<IFormErrors>(generateInitialFormErrors);

  const validateFormInputs = useCallback(() => {
    const { isValid, errors } = validateArchitectDetailsForm(form);
    setFormErrors(errors);
    return isValid;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    const isFormValid = validateFormInputs();
    const { isValid, errors: documentValidationErrors } = validateDocumentUploads(documentFiles);
    setErrors(documentValidationErrors);

    if (!isFormValid || !isValid) return;

    setLoading(true);
    try {
      // TODO: wire up API call
      console.log('Submit architect details and documents', { form, documentFiles });
    } catch {
      setErrors((prev: IDocumentErrors) => ({
        ...prev,
        apiError: TranslateMessage('Admin.Sida.App.DocumentUpload.ApiError'),
      }));
    } finally {
      setLoading(false);
    }
  }, [TranslateMessage, validateFormInputs, documentFiles, form]);


   const reset = useCallback(() => {
     setErrors({ ...generateInitialErrors() });
     setFormErrors({ ...generateInitialFormErrors() });
     setDocumentFiles(generateInitialFilesState());
   }, []);
 
   useFocusEffect(
     useCallback(() => {
       return () => {
         reset();
       };
     }, [reset]),
   );
  return (
    <ScrollView>
      <View style={layout.containerPadding}>
        {/* Page header */}
        <View style={[layout.container, layout.paddingTop26]}>
          <Typography variant="subHeading">Architect Details</Typography>
        </View>
        <Divider style={[layout.DividerSperator, layout.marBottom30]} />
        <FormInputs
          form={form}
          setForm={setForm}
          errors={formErrors}
          setErrors={setFormErrors}
        />
        {/* Document uploads section — owns all form state internally */}
        <DocumentUploads
          errors={errors}
          setErrors={setErrors}
          pickerErrors={pickerErrors}
          setPickerErrors={setPickerErrors}
          files={documentFiles}
          fields={DOCUMENT_FIELDS}
          onFilesChange={setDocumentFiles}
        />
        <View style={styles.submitWrap}>
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={[button.btnBase, button.btnPrimary, loading && button.btnDisabled]}
          >
            <Text style={[button.btnBase, button.btnPrimary, loading && button.btnDisabled]}>
              {loading
                ? TranslateMessage('Admin.Sida.App.DocumentUpload.Submitting')
                : TranslateMessage('Admin.Sida.App.DocumentUpload.Submit')}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default ArchitectDetailsPage;
