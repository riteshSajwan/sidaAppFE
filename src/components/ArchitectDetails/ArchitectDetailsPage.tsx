import React from 'react';
import { ScrollView, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useLayoutStyle } from 'src/common/assets/styles/layout';
import Typography from 'src/common/components/Typography/Typography';
import DocumentUploads from './DocumentUploads/DocumentUploads';

const ArchitectDetailsPage = () => {
  const layout = useLayoutStyle();

  return (
    <ScrollView>
      <View style={layout.containerPadding}>
        {/* Page header */}
        <View style={[layout.container, layout.paddingTop26]}>
          <Typography variant="subHeading">Architect Details</Typography>
        </View>
        <Divider style={[layout.DividerSperator, layout.marBottom30]} />

        {/* Document uploads section */}
        <DocumentUploads />
      </View>
    </ScrollView>
  );
};

export default ArchitectDetailsPage;
