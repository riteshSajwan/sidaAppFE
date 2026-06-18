import { translateMessage } from "src/i18n/createTranslation";

const STANDARD_VEHICLE_IMAGE = require('src/common/assets/images/car.png');
const FULL_SIZE_VEHICLE_IMAGE = require('src/common/assets/images/FullSize.png');
const SUV_VEHICLE_IMAGE = require('src/common/assets/images/Suv.png');

interface INearbyCabs {
  id?: number;
  status?: string;
  latitude: number;
  longitude: number;
  vehicleCategory?: string;
  vehicleType?: string
}
interface ILocation {
    latitude: number,
    longitude: number,
    address?: string
}

enum IVEHICLECATEGORY {
    STANDARD = 'STANDARD',
    FULL_SIZE = 'FULL_SIZE',
    SUV='SUV'
  }

  enum ISearchType {
  VEHICLE_NO='VEHICLE_NO',
  ADDRESS='ADDRESS',
}
interface IDriverForCabs {
  id: number;
  firstName: string;
  email: string;
  phoneNumber: string;
  registrationNumber?: string;
  profileUrl?: string;
  activeStatus: string;
  latitude?: number;
  longitude?: number;
  vehicleCategory?: string;
  vehicleType?: string;
  isBlocked: boolean;
  scheduledTimes?: string[];
}
function searchByOptions() { 
  return[
  
  {
    label: translateMessage('Admin.Delivery.App.SearchBy.Address'),
    value: ISearchType.ADDRESS,
  },
  {
    label: translateMessage('Admin.Delivery.App.SearchBy.VehicleNumber'),
    value: ISearchType.VEHICLE_NO,
  },
];}

const getVehicleImageTopView = (category?: string | null) => {
  const normalizedVehicleCategory = (category || IVEHICLECATEGORY.STANDARD)
    .toUpperCase()
    .replace(/[\s_]+/g, '');

  switch (normalizedVehicleCategory) {
    case IVEHICLECATEGORY.FULL_SIZE.replace(/_/g, ''):
      return FULL_SIZE_VEHICLE_IMAGE;
    case IVEHICLECATEGORY.SUV:
      return SUV_VEHICLE_IMAGE;
    case IVEHICLECATEGORY.STANDARD:
    default:
      return STANDARD_VEHICLE_IMAGE;
  }
};

function getVehicleImageByCategory(
  vehicleCategory?: string | null,
  vehicleType?: string | null
) {
  return getVehicleImageTopView(vehicleCategory || vehicleType || IVEHICLECATEGORY.STANDARD);
}

interface ICabFilter {
    searchKey: string;
    searchType:string
}

function generateInitialFilterData(): ICabFilter {
    return {
        searchKey: '',
        searchType:ISearchType.ADDRESS
    }
}

export { generateInitialFilterData, getVehicleImageByCategory, getVehicleImageTopView, ICabFilter, ILocation, INearbyCabs, ISearchType, IVEHICLECATEGORY, searchByOptions,IDriverForCabs };
