import { documentDirectory, downloadAsync } from 'expo-file-system';
import { Alert, Platform } from 'react-native';
import { getTenantHeaders } from 'src/common/service/restService/restService';

export enum MediaIconName {
  PDF = 'pdf',
  DOCUMENT = 'word',
  FILE = 'word',
  EXCEL = 'excel',
}

function getFileType(fileName: string, fileType?: string) {
  const type = fileType || fileName;

  switch (type) {
    case 'image/jpeg':
    case 'image/jpg':
    case 'image/png':
    case 'image/jfif':
    case 'image/avif':
      return 'image';

    case 'application/pdf':
      return 'pdf';

    case 'text/plain':
      return 'txt';

    case 'application/x-tika-ooxml':
    case 'application/x-tika-msoffice':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'document';

    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'excel';

    // DXF drawing files — various MIME types browsers/OS may report
    case 'application/dxf':
    case 'image/vnd.dxf':
    case 'application/x-dxf':
    case 'drawing/x-dxf':
    case '.dxf':
      return 'dxf';

    default:
      // Last-resort: check the raw string for a .dxf extension
      if (type.toLowerCase().endsWith('.dxf')) {
        return 'dxf';
      }
      return 'unsupported';
  }
}

const openPdfDocument = (uri: string, fileName: string, tenantId?: string | null): Promise<void> => {
  const headers = getTenantHeaders(tenantId);

  if (Platform.OS === 'web') {
    return fetch(uri, { headers })
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      });
  } else {
    const fileUri = documentDirectory + fileName;
    return downloadAsync(uri, fileUri, { headers })
      .then(({ uri: downloadedUri }) => {
        Alert.alert('Download complete!', `File downloaded to ${downloadedUri}`);
      })
      .catch((error) => {
        console.error('Download failed:', error);
        Alert.alert('Download failed', 'Unable to download the file.');
      });
  }
};

function getFileName(fileURL: string): string {
  if (fileURL) {
    return fileURL.split('/').pop() || '';
  }

  return '';
}

export { getFileName, getFileType, openPdfDocument };
