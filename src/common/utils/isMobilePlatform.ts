import { Platform } from 'react-native';

enum PlatformType {
    Android = 'android',
    IOS = 'ios',
    WEB = 'web'
}

function isMobilePlatform(): boolean {
    return Platform.OS === PlatformType.Android || Platform.OS === PlatformType.IOS;
}

function isIOSPlatform(): boolean {
    return Platform.OS === PlatformType.IOS;
}

function isAndroidPlatform(): boolean {
    return Platform.OS === PlatformType.Android;
}
function isWebPlatform(): boolean {
    return Platform.OS === PlatformType.WEB;
}

export {
    isMobilePlatform,
    PlatformType,
    isIOSPlatform,
    isAndroidPlatform,
    isWebPlatform
};