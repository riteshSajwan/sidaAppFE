interface IRestaurants {
  id: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  logoURL: string;
  blockStatus: boolean;
  sellerRatings: number,
  sellerReviews: number,
  email:string,
}

interface ISelectedRestaurant {
  id: string;
  status: boolean;
}

interface IRestaurantsListResponse {
  data: IRestaurants[];
  page: number;
  size: number;
  total: number;
}

interface ISellerLicense {
  id: number;
  sellerId: number;
  fssaiLicenseNumber: string;
  fssaiLicenseImageId: number;
  fileUrl: string;
  licenseExpiryDate: string;
}

interface ISellerImages {
  id: number;
  imageId: number;
  sellerId: number;
  fileUrl: string;
}

interface IRestaurantDetails {
  logoImageId: number;
  logoImageUrl: string;
  sellerId: number;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerLicense: ISellerLicense;
  createdAt: string;
  order: number;
  sellerImages: ISellerImages[];
}

interface IRestaurantFilter {
  country: string;
  searchKey: string;
  sortField?: string;
  sortOrder?:string;
  paymentMethod?:string
}

interface IRestaurantCountries {
  id: number;
  countryName: string;
  distanceUnit: string;
  currencyType: string;
  countryISO: string;
  name:string;
  currency:string
}

interface ICountries {
  label: string;
  value: string;
  currency?:string;
  distanceUnit?:string;
  countryISO?:string;
}

export {
  IRestaurants,
  IRestaurantsListResponse,
  ISellerLicense,
  ISellerImages,
  IRestaurantDetails,
  IRestaurantFilter,
  IRestaurantCountries,
  ISelectedRestaurant,
  ICountries
}