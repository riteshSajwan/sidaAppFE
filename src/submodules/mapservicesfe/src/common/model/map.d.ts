export interface ILocationInfo {
    latitude: number;
    longitude: number;
}

export interface IAvailableRider extends ILocationInfo {
    pointImage: ImageSourcePropType;
    id: number
}