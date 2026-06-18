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
