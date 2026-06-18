import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { translateMessage } from 'src/i18n/createTranslation';

export type IFileType = Blob | null | undefined;

function validateDate(date: DateType | null, isRequired: boolean = false): string {
    if (isRequired && !date) {
        return translateMessage('Admin.Delivery.App.Date.Required');
    }
    return '';
}

function validateImage(imageFile: IFileType) {

    if (!imageFile) {
        return translateMessage('Admin.Delivery.App.Image.Required');
    }

    return '';
}
function validateImages(imageFiles: IFilesData[]) {

    if (!imageFiles || imageFiles.length === 0) {
        return translateMessage('Admin.Delivery.App.Image.Required');;
    }

    return '';
}

function validateDocFile(docFile: IFileType | null, maxSize: number = 0, isRequired: boolean = false): string {
    if (isRequired && !docFile) {
        return translateMessage('Admin.Delivery.App.Document.Required');;
    }
    
    if (docFile && maxSize) {
        const sizeInBytes = maxSize * 1024 * 1024; 
        if (docFile.size > sizeInBytes) {
            return `Image size cannot exceed ${maxSize} MB`;
        }
    }

    return '';
}

export {
    validateDocFile,
    validateImage,
    validateDate,
    validateImages
}