import { AppThunk } from 'src/store';
import { fetchSupportListingFailure, fetchSupportListingRequest, fetchSupportListingSuccess } from './slice';
import { getAllChatSupportList } from 'src/common/service/chat/api';
import { translateMessage } from 'src/i18n/createTranslation';

export const fetchSupportListAction = (page: number, size: number): AppThunk => (dispatch) => {
    dispatch(fetchSupportListingRequest());
    return getAllChatSupportList(page, size)
      .then((result) => {
        dispatch(fetchSupportListingSuccess(result));
        return result;
      })
      .catch(() => {
        dispatch(
          fetchSupportListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
        );
      });
  };
