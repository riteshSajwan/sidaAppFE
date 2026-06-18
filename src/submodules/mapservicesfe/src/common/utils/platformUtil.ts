import { Platform } from 'react-native';

enum PlatformType {
  Android = 'android',
  IOS = 'ios',
  Web = 'web',
}

function isIOSPlatform(): boolean {
  return Platform.OS === PlatformType.IOS;
}

function isWebPlatform(): boolean {
  return Platform.OS === PlatformType.Web;
}

export { isIOSPlatform, isWebPlatform };