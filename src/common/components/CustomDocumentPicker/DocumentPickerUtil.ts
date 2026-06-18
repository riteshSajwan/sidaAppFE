import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { getFileName } from 'src/common/components/FilesViewer/FilesViewerUtil';
import { getTenantHeaders } from 'src/common/service/restService/restService';
 
const DOC_TYPES = [
  'application/pdf', // PDF files
 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word .docx files
  'application/vnd.ms-excel', // Excel .xls files
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel .xlsx files
  'text/plain' // Text files
];
 
export interface IImagesSectionInfo {
  id: number;
  fileUrl: string;
}
export interface IErrorsMsg {
  imageUplodFieldError: string;
  apiError: string;
}
export function generateIntialErrorMsg(): IErrorsMsg {
    return {

        imageUplodFieldError: '',
        apiError: '',
    };
}
 
function createBlobForSingleFile(fileURL: string,tenantId?:string): Promise<Blob> {
  const headers = getTenantHeaders(tenantId);
  return fetch(fileURL,{headers})
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image from ${fileURL}, status: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => blob);
}
export interface IImagesResponse{
  id: number;
  imageUrl: string;
  fileUrl: string;
}
 
function returnBlobForSingleFile(fileURL: string) {
  if (!fileURL) {
    return Promise.resolve(null);
  }
 
  return createBlobForSingleFile(fileURL)
    .then((blob) => {
      return {
        uri: fileURL,
        blob: blob,
        fileName: getFileName(fileURL),
      };
    });
}
 
 
function returnBlobForSingleFileNew(fileURL: string, tenantId?:string) {
  if (!fileURL) {
    return Promise.resolve(null);
  }
 
  return createBlobForSingleFile(fileURL,tenantId).then((blob) => ({
    uri: fileURL,
    blob: blob,
    fileName: getFileName(fileURL),
  }));
}
 
 
function createMediaInfoObjects(
  filesData: IImagesResponse[],
  type: string = ''
): Promise<IFilesData[]> {
  
  return Promise.all(
    filesData.map((fileData) => {
      const fileURL = type ? fileData.fileUrl : fileData.imageUrl;
      const id = fileData.id;
 
      return {
        uri: fileURL,
        fileName: getFileName(fileURL),
        id
      };
    })
  );
}
 
 
function validateImageFiles(images: IFilesData[], maxSize: number = 0): boolean {
  const totalSizeInBytes = images.reduce((total, image) => total + (image?.blob?.size ?? 0), 0);
  const maxSizeInBytes = maxSize * 1024 * 1024;
  if (totalSizeInBytes > maxSizeInBytes) {
      return true
  }
 
  return false;
}
 
export {
  createMediaInfoObjects, DOC_TYPES,
  returnBlobForSingleFile, returnBlobForSingleFileNew, validateImageFiles
};
 