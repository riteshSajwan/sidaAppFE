import { router } from 'expo-router';
import { getAllCouponList, getCouponById, getCouponUpdateStatus, SaveCoupon } from 'src/common/service/coupon/api';
import { fetchCouponDetailsFailure, fetchCouponDetailsRequest, fetchCouponDetailsSuccess, fetchCouponListingFailure, fetchCouponListingRequest, fetchCouponListingSuccess, saveCouponFailure, saveCouponRequest, saveCouponSuccess, updateCouponStatusFailure, updateCouponStatusRequest, updateCouponStatusSuccess } from 'src/common/service/coupon/slice';
import { formatDateToMomentString, formatMomentToDate } from 'src/common/utils/dateUtil';
import { APIError } from 'src/common/utils/errors';
import { ICouponTag } from 'src/components/CouponPage/add/AddCouponUtil';
import { ICouponListFilter } from 'src/components/CouponPage/CouponListUtil';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { translateMessage } from 'src/i18n/createTranslation';
import { Routes } from 'src/routing/paths';
import { AppThunk } from 'src/store';

export const fetchCouponListingAction = (filter: ICouponListFilter, page: number, size: number): AppThunk => (dispatch) => {
    dispatch(fetchCouponListingRequest());
    return getAllCouponList(filter, page, size)
        .then((result) => {
            dispatch(fetchCouponListingSuccess(result));
            return result;
        })
        .catch(() => {
            dispatch(fetchCouponListingFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
            );
        });
};
export const fetchCouponDetailsAction = (id: string): AppThunk<Promise<ICouponTag | undefined>> => (dispatch) => {
    dispatch(fetchCouponDetailsRequest());
    return getCouponById(id).then((result: ICouponTag) => {
        const rawDate =
          typeof result.expirationDateTime === 'string'
            ? result.expirationDateTime
            : result.expirationDateTime?.toString() || '';
  
        const formattedExpirationDate = formatMomentToDate(rawDate);
  
        const updatedCoupon: ICouponTag = {
          ...result,
          expirationDateTime: formattedExpirationDate,
        };
  
        dispatch(fetchCouponDetailsSuccess(updatedCoupon));
        return updatedCoupon;
      })
      .catch(() => {
        dispatch(fetchCouponDetailsFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong')));
        return undefined;
      });
  };

export const updateCouponStatusAction =(id: number, isActive: boolean): AppThunk =>(dispatch) => {
    dispatch(updateCouponStatusRequest());
    return getCouponUpdateStatus(id, isActive).then(() => {
        dispatch(updateCouponStatusSuccess({ id, isActive }));
      })
      .catch(() => {
        dispatch(updateCouponStatusFailure(translateMessage('Admin.Delivery.App.SomethingWentWrong'))
        );
      });
  };

export const addCouponAction =(couponData: ICouponTag): AppThunk<Promise<void>> =>(dispatch) => {
    dispatch(saveCouponRequest());
    const payload = {
      ...couponData,
      expirationDateTime: formatDateToMomentString(couponData.expirationDateTime as DateType),
    };
    return SaveCoupon(payload).then(() => {
        dispatch(saveCouponSuccess());
        setTimeout(()=>{
          router.push(Routes.COUPON);
        },2000)
      })
      .catch((error) => {
        let apiError: string;

        if (
          typeof error === 'object' &&
          error !== null &&
          'errors' in error &&
          Array.isArray((error as APIError).errors)
        ) {
          const errorObj = error as { errors: string[] };
          apiError = errorObj.errors[0]?.split(' | ')[0] || errorObj.errors[0];
        } else {
          apiError = translateMessage('Admin.Delivery.App.SomethingWentWrong');
        }
        dispatch(saveCouponFailure(apiError));
      });
};

