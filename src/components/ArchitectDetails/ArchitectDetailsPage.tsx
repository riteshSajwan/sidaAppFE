import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import Typography from 'src/common/components/Typography/Typography';
import DocumentUploads from './DocumentUploads/DocumentUploads';
import { generateInitialErrors, IDocumentErrors } from './DocumentUploads/DocumentUploadsUtils';

const ArchitectDetailsPage = () => {
  const layout = useLayoutStyle();

  const [errors, setErrors]             = useState<IDocumentErrors>(generateInitialErrors);
  const [loading, setLoading]           = useState<boolean>(false);
  const [pickerErrors, setPickerErrors] = useState<Record<string, string>>({});

  useFocusEffect(
    useCallback(() => {
      return () => {
        // intentional no-op — DocumentUploads resets itself on blur
      };
    }, []),
  );

  return (
    <ScrollView>
      <View style={layout.containerPadding}>
        {/* Page header */}
        <View style={[layout.container, layout.paddingTop26]}>
          <Typography variant="subHeading">Architect Details</Typography>
        </View>
        <Divider style={[layout.DividerSperator, layout.marBottom30]} />

        {/* Document uploads section — owns all form state internally */}
        <DocumentUploads 
        errors={errors}
        setErrors={setErrors}
        loading={loading}
        setLoading={setLoading}
        pickerErrors={pickerErrors}
        setPickerErrors={setPickerErrors}
        />
      </View>
    </ScrollView>
  );
};

export default ArchitectDetailsPage;
