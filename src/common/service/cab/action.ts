import {
  getCabByVehicleNumber,
  getNearbyRidersList,
} from 'src/common/service/cab/api';
import {
  fetchNearByCabsFailure,
  fetchNearByCabsRequest,
  fetchNearByCabsSuccess,
} from 'src/common/service/cab/slice';
import { INearbyCabs } from 'src/components/Cabs/CabsUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';

export const fetchNearByCabsAction =
  (lat: number, lng: number, radius: number, limit: number): AppThunk =>
  (dispatch) => {
    dispatch(fetchNearByCabsRequest());

    return getNearbyRidersList(lat, lng, radius, limit)
      .then((result: INearbyCabs[]) => {
        dispatch(fetchNearByCabsSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(
          fetchNearByCabsFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
      });
  };

export const fetchCabByVehicleNumberAction =
  (vehicleNumber: string): AppThunk =>
  (dispatch) => {
    dispatch(fetchNearByCabsRequest());

    return getCabByVehicleNumber(vehicleNumber)
      .then((result: INearbyCabs[]) => {
        dispatch(fetchNearByCabsSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(
          fetchNearByCabsFailure(
            translateMessage('Admin.Delivery.App.SomethingWentWrong')
          )
        );
      });
  };
