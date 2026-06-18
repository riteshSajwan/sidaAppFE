import { INearbyCabs } from "src/components/Cabs/CabsUtil";
import { AUTH_BASE_URL } from "src/constants";
import restService from "../restService/restService";

const getNearbyRidersList = async (
  userLatitude: number,
  userLongitude: number,
  radius: number,
  limit: number
): Promise<INearbyCabs[]> => {
 return restService.generateHeaders().then((headers) => {
  

  const url = `${AUTH_BASE_URL}/api/delivery/rider/nearby?userLatitude=${userLatitude}&userLongitude=${userLongitude}&radius=${radius}&limit=${limit}`;

  return restService.fetch(url, {
    method: 'GET',
    headers,
  }
    );
  });
};

const getCabByVehicleNumber = async (
  vehicleNumber: string,
): Promise<INearbyCabs[]> => {
 return restService.generateHeaders().then((headers) => {
  

  const url = `${AUTH_BASE_URL}/api/delivery/rider/by-vehicle-registration-number?vehicleRegistrationNumber=${vehicleNumber}`;

  return restService.fetch(url, {
    method: 'GET',
    headers,
  }
    );
  });
};

export { getCabByVehicleNumber, getNearbyRidersList };

