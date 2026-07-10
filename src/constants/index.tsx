// ################################################################################## //
// MISCELLANEOUS CONSTANTS :--
const sanitizeEnvValue = (value?: string) => value?.trim().replace(/^['"]|['"]$/g, '');

export const AUTH_BASE_URL = sanitizeEnvValue(process.env.EXPO_PUBLIC_API_BASE_URL);
export const IS_SAAS = sanitizeEnvValue(process.env.EXPO_PUBLIC_IS_SAAS) !== 'false';
export const BUNDLE_ID = sanitizeEnvValue(process.env.EXPO_PUBLIC_BUNDLE_ID);
export const IS_INTERCITY = sanitizeEnvValue(process.env.EXPO_PUBLIC_IS_INTERCITY) !== 'false';
export const WEBSOCKET_BASE_URL =
  sanitizeEnvValue(process.env.EXPO_PUBLIC_WEBSOCKETCONNECTION_BASE_URL) ||
  'wss://taxiappsaas.findnerd.com/ws/order/admin';
export const API_AUTH_CUSTOMER_URL = AUTH_BASE_URL + '/api/auth/customer';
export const API_AUTH_BUSINESS_ADMIN_URL = AUTH_BASE_URL + '/api/auth';
export const LOGIN_URL = AUTH_BASE_URL + `/api/auth/signin`;
export const BUSINESS_ADMIN_LOGIN_URL = API_AUTH_BUSINESS_ADMIN_URL + `/signin`;
export const FORGOT_PASSWORD_URL = AUTH_BASE_URL + `/api/auth/forget-password`;
// COMMON ERROR CONSTANTS :--
export const ERRORS = {
  COMMON_ERROR: 'Something went wrong. Please try again',
};
export const SNACKBAR_DEFAULT_DURATION = 2000;
export const DEBOUNCE_TIME = 500;
export const MAX_CHECK_LENGTH = 50;
export const ALLOW_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const SIZE_VALIDATION = 10;
export const DXF_FILE_SIZE_BYTES = 1024 * 1024 * 1024; // 1 GB
export const DXF_SIZE_VALIDATION = 1024; // MB label shown in error messages
export const DELAY_TOOLTIP = 100;
export const MIN_CHECK_LENGTH = 3;
export const DEFAULT_SIZE = 10;

const SUPPORT_CHAT_DOMAIN = process.env.EXPO_PUBLIC_SUPPORT_CHAT_DOMAIN;

const SUPPORT_CHAT_COMMON_CONFIG = {
  hosts: {
    domain: SUPPORT_CHAT_DOMAIN,
    muc: `conference.${SUPPORT_CHAT_DOMAIN}`,
    focus: `focus.${SUPPORT_CHAT_DOMAIN}`,
  },
  externalConnectUrl: `https://${SUPPORT_CHAT_DOMAIN}/http-pre-bind`,
  enableP2P: true,
  p2p: {
    enabled: true,
    preferredCode: true,
    disabledCodec: true,
    useStunTurn: true,
  },
  useStunTurn: true,
  serviceUrl: `https://${SUPPORT_CHAT_DOMAIN}/http-bind?`,
  websocket: `wss://${SUPPORT_CHAT_DOMAIN}/xmpp-websocket`,
};



export const REGISTER_URL = AUTH_BASE_URL + `/api/auth/registration/architecture`;

export const SUPPORT_CHAT_CONFIG = SUPPORT_CHAT_COMMON_CONFIG;
