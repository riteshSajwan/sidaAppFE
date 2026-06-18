export interface IAddRestaurant {
    sellerName: string,
    file: Blob | null,
    businessType:string,
    ownerName: string;
    ownerPhone: string;
    owneremail: string;
    managerName: string;
    managerPhone: string;
    manageremail: string;
    sellerSharePercentage: number | null;
    isApproved: boolean;
    managerId?:string
    staffIdToBeRemoved?:string
}

export interface IRestaurantTax {
    sellerId: string,
    taxDocumentNumber: string,
    taxExpiryDate: Date,
    taxDocumentProofFilePart: Blob | null
}
export interface IAddRestaurantTiming {
    sellerId: string,
    breakfast: {
        openingTime: string,
        closingTime: string
    },
    lunch: {
        openingTime: string,
        closingTime: string
    },
    dinner: {
        openingTime: string,
        closingTime: string
    }
}

export interface IStaffMember {
    id?:string;
    memberEmail: string;
    memberPhone: string;
    memberName: string;
    role: string;
}
export interface IStaffMemberResponse {
    id?:string;
    email: string;
    phone: string;
    name: string;
    role: string;
}

export interface IRestaurantAddress {
    address: string,
    longitude: number,
    latitude: number,
    // city: string,
    state: string,
    country: string,
    postal: string,
    geoLocation: string;
    stateName: string;
    cityName: string;
}

export interface IRestaurantStaff {
    staffData: IStaffMember[];
}

export interface IRestaurantCreate {

    sellerName: string,
    file?: Blob | null,
    address: string,
    longitude: number,
    latitude: number,
    city?: string,
    state?: string,
    cityName?: string,
    stateName?: string,
    country: string,
    postal?: string,
    businessType:string,
    staffData: IStaffMember[];
    geoLocation: string;
    sellerSharePercentage: number;
    managerId?:string
    staffIdToBeRemoved?:string
}

export interface IStaffForm {
    ownerName: string;
    ownerPhone: string;
    owneremail: string;
    managerName: string;
    managerPhone: string;
    manageremail: string;
}

export interface IStaffValid {
    name: string;
    phone: string;
    email: string;
}

export interface IRestaurantInfo extends IAddRestaurant {
    id: number;
    logoUrl: string;
    staffMembers:IStaffMemberResponse[]
}


export interface IFoodLicenseAndTaxResponseDTO {
    id: number;
    sellerId: number;
    documentNumber:string,
    documentType:string;
    documentURL: string;
    documentExpiryDate:string;
}

export interface IOwnerInfoResponse {
    id: number;
    memberEmail: string;
    memberPhone: string;
    memberName: string;
    role: StaffRole;
}
export interface IRestaurantAddressResponse {
    id:number,
    address: string,
    longitude: number,
    latitude: number,
    cityId: string,
    stateId: string,
    stateName: string,
    cityName: string,
    countryId: string,
    postal: string,
    geoLocation: string;
    isApproved:boolean
}

export interface IRevenueRequestPayload extends IAddRevenueShare {
    sellerId: string;
}

export interface ITimingData {
    id: number;
    slotName: RestaurantTimingType;
    openingTime: string;
    closingTime: string;
}

export interface IMealTimingResponse {
    timingData:ITimingData[]
    sellerId: string;
    openingTime: string;
    closingTime: string;
    averagePrepTime: string;
    pickupAvailable:boolean;
    deliveryAvailable:boolean;
    zoneId: string;
}


export interface ITAXDetailsResponse {
    id: number;
    sellerId: number;
    taxDocumentNumber: string;
    taxDocumentProofId: number;
    fileUrl: string;
    taxExpiryDate: string;
}

interface IRevenueShareRanges {
    id?: number;
    minRevenue: number;
    maxRevenue: number;
    percentageShare: number;
}

export interface IRevenueShareResponse {
    id: number;
    ranges: IRevenueShareRanges[];
}

export interface IBusinessType {
    id: number;
    name: string;
}