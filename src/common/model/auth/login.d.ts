import { PermissionType } from 'src/common/utils/permissionUtils';

export type SignInRequestDto = {
  username: string;
  password: string;
  deviceToken: string;
  admin: boolean;
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
  firstName:    string;
  middleName:   string;
  lastName:     string;
  fatherName:   string;
  mailingAddress: string;
  state:          string;
  district:       string;
  tehsil:         string;
  cityVillage:    string;
  pinCode:        string;
  mobileNumber:   string;
  email:          string;
  regLicenseNo: string;
  instituteName: string;
  yearOfPassing: string;
  declared: boolean;
  attachments:any 
};

export type RegisterArchitectResponseDto = {
 
};