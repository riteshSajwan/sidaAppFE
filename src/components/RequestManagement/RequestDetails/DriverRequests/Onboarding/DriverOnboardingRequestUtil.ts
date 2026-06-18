import { RequestType } from 'src/components/RequestManagement/RequestListUtil';

interface IDriver {
    id: number,
    activeStatus: string,
    createdAt: string;
    profileUrl: string,
    email: string,
    phoneNumber: string,
    firstName: string,
    riderVehicleRegistration: IRiderVehicleRegistration
    riderLicense: IRiderLicense,
    emergencyContactDto: IEmergencyContactDto
    bankDetailsResponse: IBankDetailsResponse
    vehicleInsurance: IInsuranceDetailsResponse
    isApproved: RequestType
    isBlocked: boolean
    blockedReason: string,
    comment:string,
    approvalRequestStatus: RequestType | null,
    requestName: string,
    requestType: number,
    sellerName: string,
    renderViewDetails: boolean,
    registrationDate: string,
    username: string,
    licenseImages:ILicenseImage[],
    registrationImages:IRegistrationImage[]
    insuranceImages:IInsuranceImages[]
}

interface IRiderVehicleRegistration {
    vehicleType: string;
    registrationNumber: string;
    createdAt: string;
    expiryDate: string;
    vehicleCategory: string;
    vehicleName: string;
}
interface ILicenseImage {
    id: number;
    userId: number;
    fileId: number;
    fileType: string;
    fileName: string;
    filePath: string;
    fileUrl: string;
    fileSize: number;
    isPrimary: boolean;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
  }
  export interface IRegistrationImage {
    id: number;
    userId: number;
    fileId: number;
    fileType: string;
    fileName: string;
    filePath: string;
    fileUrl: string;
    fileSize: number;
    isPrimary: boolean;
    deleted: boolean;
    createdAt: string; 
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
  }
  export interface IInsuranceImages {
    id: number;
    userId: number;
    fileId: number;
    fileType: string;
    fileName: string;
    filePath: string;
    fileUrl: string;
    fileSize: number;
    isPrimary: boolean;
    deleted: boolean;
    createdAt: string; 
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
  }
  
  
interface IRiderLicense {
    licenseNumber: string
    expiryDate: string
    userId: string
    createdAt: string
}
interface IEmergencyContactDto {
    fullName: string,
    phoneNumber: string,
    relationship: string,
    address: string
}

interface IBankDetailsResponse {
    accountNumber: string
    paymentMethod: string
    ifscCode: string
    dob: string
    accountHolderName: string
    activeStatus: boolean;
    mobileNumber: string;
    ribNumber: string;
}

interface IInsuranceDetailsResponse {
    insuranceNumber: string
    expiryDate: string
    createdAt: string
}

function generateIntialDriverData(): IDriver {
    return {
        id: 0,
        firstName: '',
        phoneNumber: '',
        email: '',
        createdAt: '',
        profileUrl: '',
        activeStatus: '',
        comment: '',
        riderLicense: {
            licenseNumber: '',
            userId: '',
            expiryDate: '',
            createdAt: '',
        },
        emergencyContactDto: {
            fullName: '',
            phoneNumber: '',
            relationship: '',
            address: '',
        },
        bankDetailsResponse: {
            accountNumber: '',
            paymentMethod: '',
            ifscCode: '',
            dob: '',
            accountHolderName: '',
            activeStatus: false,
            mobileNumber: '',
            ribNumber: '',
        },
        vehicleInsurance: {
            insuranceNumber: '',
            expiryDate: '',
            createdAt: ''
        },
        riderVehicleRegistration: {
            vehicleType: '',
            registrationNumber: '',
            createdAt: '',
            expiryDate: '',
            vehicleCategory: '',
            vehicleName: '',
        },

        licenseImages: [
            {
                id: 0,
                userId: 0,
                fileId: 0,
                fileType: '',
                fileName: '',
                filePath: '',
                fileUrl: '',
                fileSize: 0,
                isPrimary: false,
                deleted: false,
                createdAt: '',
                updatedAt: '',
                createdBy: 0,
                updatedBy: 0,
            }
        ],
        registrationImages: [
        {
            id: 0,
            userId: 0,
            fileId: 0,
            fileType: '',
            fileName: '',
            filePath: '',
            fileUrl: '',
            fileSize: 0,
            isPrimary: false,
            deleted: false,
            createdAt: '',
            updatedAt: '',
            createdBy: 0,
            updatedBy: 0,
        }
    ],
    insuranceImages: [
        {
            id: 0,
            userId: 0,
            fileId: 0,
            fileType: '',
            fileName: '',
            filePath: '',
            fileUrl: '',
            fileSize: 0,
            isPrimary: false,
            deleted: false,
            createdAt: '',
            updatedAt: '',
            createdBy: 0,
            updatedBy: 0,
        }
    ],

        isApproved: RequestType.PENDING,
        isBlocked: false,
        blockedReason: '',
        approvalRequestStatus: null,
        requestName: '',
        requestType: 0,
        sellerName: '',
        renderViewDetails: false,
        registrationDate: '',
        username: '',
    };
}

async function getInitialOnDataDriver(
    driverDataResponse: IDriver
) {
    const {
        id,
        firstName,
        phoneNumber,
        email,
        licenseImages,
        createdAt,
        profileUrl,
        activeStatus,
        riderVehicleRegistration,
        riderLicense,
        emergencyContactDto,
        bankDetailsResponse,
        vehicleInsurance,
        isApproved,
        isBlocked,
        blockedReason,
        approvalRequestStatus,
        comment,
        requestName,
        requestType,
        registrationImages,
        sellerName,
        renderViewDetails,
        registrationDate,
        username,
        insuranceImages
    } = driverDataResponse;


    const data = {
        id,
        firstName,
        phoneNumber,
        email,
        createdAt,
        profileUrl,
        activeStatus,
        riderVehicleRegistration,
        riderLicense,
        emergencyContactDto,
        bankDetailsResponse,
        vehicleInsurance,
        isApproved,
        isBlocked,
        blockedReason,
        approvalRequestStatus,
        comment,
        requestName,
        requestType,
        sellerName,
        renderViewDetails,
        registrationDate,
        username,
        licenseImages,
        registrationImages,
        insuranceImages
    };

    return data;
}


enum PaymentOptions {
    BANKTRANSFER = 'BANKTRANSFER',
    ORANGETRANSFER = 'ORANGETRANSFER',
    WAVE = 'WAVE'
}

export {
    generateIntialDriverData,
    getInitialOnDataDriver, IDriver, ILicenseImage, PaymentOptions
};

