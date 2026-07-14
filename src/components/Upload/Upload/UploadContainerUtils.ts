import { Dispatch, SetStateAction } from 'react';
import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { IBuildingDataState } from 'src/common/service/masterData/slice';
import { translateMessage } from 'src/i18n/createTranslation';

// ─── Dropdown option type ────────────────────────────────────────────────────
export interface IOption {
  label: string;
  value: string;
}

// Building type code for which the Location dropdown is shown.
export const INDUSTRIES_BUILDING_TYPE_CODE = 'INDUSTRIES';

// ─── Local state shape ───────────────────────────────────────────────────────
export interface IUploadFormState {
  category: IOption;
  subCategory: IOption;
  terrain: IOption;
  location: IOption;
}

export interface uploadFormRequest {
  category: IOption;
  subCategory: IOption;
  terrain: IOption;
  location: IOption;
}
export interface uploadFormResponse {
  category: IOption;
  subCategory: IOption;
  terrain: IOption;
  location: IOption;
}

export interface IUploadErrors {
  apiError: string;
  file: string;
  category: string;
  subCategory: string;
  terrain: string;
  location: string;
}

export const isIndustriesCategory = (categoryCode: string) =>
  categoryCode?.trim().toUpperCase() === INDUSTRIES_BUILDING_TYPE_CODE;



// ─── Props type for UploadContainer ─────────────────────────────────────────
export interface IUploadContainerProps {
  form: IUploadFormState;
  setForm: Dispatch<SetStateAction<IUploadFormState>>;
  uploadedFiles: IFilesData[];
  setUploadedFiles: Dispatch<SetStateAction<IFilesData[]>>;
  infoError:IUploadErrors
  setInfoError:Dispatch<SetStateAction<IUploadErrors>>;
  buildingData: IBuildingDataState;
}

export function generateInitialUploadContainerErrorsData(): IUploadErrors {
  return {
    file: '',
    category: '',
    subCategory: '',
    terrain: '',
    location: '',
    apiError: '',
  };
}

export const generateInitialState = (): IUploadFormState => ({
  category: { label: 'Select Category', value: '' },
  subCategory: { label: 'Select Sub-Category', value: '' },
  terrain: { label: 'Select File Type', value: '' },
  location: { label: 'Select Location', value: '' },
});


const validateUpload = (form: IUploadFormState ,uploadedFiles:IFilesData[]) => {
    let isValid = true;
    const errors = {
        file: '',
        category: '',
        subCategory: '',
        terrain: '',
        location: '',
        apiError: '',
    };

    if (!form.category.value || form.category.value.trim() === '') {

        errors.category =translateMessage('Admin.Sida.App.Upload.Category.Required');
        isValid = false;
    }
    if (!form.subCategory.value || form.subCategory.value.trim() === '') {

        errors.subCategory =translateMessage('Admin.Sida.App.Upload.SubCategory.Required');
        isValid = false;
    }
    if (!form.terrain.value || form.terrain.value.trim() === '') {

        errors.terrain =translateMessage('Admin.Sida.App.Upload.Terrain.Required');
        isValid = false;
    }
    if (isIndustriesCategory(form.category.value) && (!form.location.value || form.location.value.trim() === '')) {

        errors.location =translateMessage('Admin.Sida.App.Upload.Location.Required');
        isValid = false;
    }
    if (uploadedFiles.length==0) {
        console.log("first")
        errors.file =translateMessage('Admin.Sida.App.Upload.File.Required');
        isValid = false;
    }

    return { isValid, errors };
};

function getFileName(fileURL: string): string {
    if (fileURL) {
        return fileURL.split('/').pop() || '';
    }
 
    return '';
};

const getMimeType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'pdf':
        return 'application/pdf';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'doc':
        return 'application/msword';
      default:
        return 'application/octet-stream'; 
    }
  };

export {validateUpload , getFileName , getMimeType}