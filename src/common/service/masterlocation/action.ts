import { translateMessage } from 'src/i18n/createTranslation';
import { AppThunk } from 'src/store';
import { getDistrictListing } from './api';
import { fetchDistrictListing, fetchDistrictListingFailure, fetchDistrictListingSuccess } from './slice';


export const fetchDistrictListingAction = (cityId:number): AppThunk => (dispatch) => {
    dispatch(fetchDistrictListing());
    return getDistrictListing(cityId)
        .then((result) => {
            dispatch(fetchDistrictListingSuccess(result));
            return result;
        })
        .catch(() => {
            dispatch(fetchDistrictListingFailure(translateMessage('Admin.Sida.App.SomethingWentWrong'))
            );
        });
};

