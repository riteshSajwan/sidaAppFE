import { IFilesData } from 'src/common/components/CustomDocumentPicker/CustomDocumentPicker';
import { PermissionType } from 'src/common/utils/permissionUtils';

export type SignInRequestDto = {
  username: string;
  password: string;
  deviceToken: string;
  fcmToken : string;
  role: string;
};

export type SuperAdminProperties = {
  id: string;
  password: string;
  googleApiKey: string;
};

export type SignInResponseDto = {
  token: string;
  userDetails: UserProfilesDetailsDto;
  refreshToken: string;
  supperAdminProperties: SuperAdminProperties;
};

export type UserProfilesDetailsDto = {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  address: string;
  pinCode: string;
  status: string;
  profileUrl: string;
  isSuperAdmin: boolean;
  language?: string;
  requireSetPassword: boolean;
  roles: string[];
  role: {
    id: 1;
    name: string;
  };
  permissionList: [
    {
      menuName: string;
      permission: PermissionType;
    },
  ];
  superAdmin: boolean;
  isProductAdmin: boolean;
};



export type RegisterArchitectRequestDto = {
  // Personal
  firstName:      string;
  middleName:     string;
  lastName:       string;
  fatherName:     string;
  spouseName?:    string;
  // Contact
  mailingAddress:   string;
  state:            string;
  district:         string;
  tehsil:           string;
  cityVillage:      string;
  otherCityVillage?: string;
  pinCode:          string;
  mobileNumber:     string;
  emailId:          string;
  password:         string;
  // Registration
  role:                   string;
  registeringAuthority?:  string;
  applicationType?:       string;
  experience?:            string;
  registrationCoaNumber:  string;   // maps from regLicenseNo
  validityDate?:          string;
  // Education
  nameOfInstitute:  string;
  yearOfPassing:    number;
};

export type RegisterArchitectFilesDto = {
  twelfthPassCertificate: IFilesData | null;
  identityProof:          IFilesData | null;
  coaCertificate:         IFilesData | null;
  degreeMarksheet:        IFilesData | null;
  latestPhoto:             IFilesData | null;
};

export type RegisterArchitectResponseDto = {
  message?: string;
  success?: boolean;
};