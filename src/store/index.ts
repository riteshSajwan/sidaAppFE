import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';

// IMPORT SLICES:--
import { authReducer } from 'src/common/service/auth/slice';
import { BookingReducer } from 'src/common/service/booking/slice';
import { BusinessReducer } from 'src/common/service/business/slice';
import { CabReducer } from 'src/common/service/cab/slice';
// import { CityReducer } from 'src/common/service/city/slice';
// import { CountryReducer } from 'src/common/service/country/slice';
import { CouponReducer } from 'src/common/service/coupon/slice';
import { CustomerReducer } from 'src/common/service/customer/slice';
import { DriverReducer } from 'src/common/service/driver/slice';
import { InvoicingReducer } from 'src/common/service/invoicing/slice';
import { NotificationReducer } from 'src/common/service/notification/slice';
import { OnboardingReducer } from 'src/common/service/onboarding/slice';
import { ProfileReducer } from 'src/common/service/profile/slice';
import { rateTierListReducer } from 'src/common/service/rateTier/slice';
import { ReportReducer } from 'src/common/service/report/slice';
import { RoleReducer } from 'src/common/service/role/slice';
import { TicketReducer } from 'src/common/service/ticket/slice';
import { UserReducer } from 'src/common/service/user/slice';
import { NewBookingNotificationReducer } from 'src/common/service/websocket/newBookingNotificationSlice';

const combinedReducer = combineReducers({
  auth: authReducer,
  profile: ProfileReducer,

  ticket: TicketReducer,


  // to be removed
  rateTier: rateTierListReducer,
  driver: DriverReducer,
  invoicing: InvoicingReducer,

  customer: CustomerReducer,
  coupon: CouponReducer,
  report: ReportReducer,
  booking: BookingReducer,
  notification: NotificationReducer,
  newBookingNotification: NewBookingNotificationReducer,
  cab: CabReducer,
  role: RoleReducer,
  user: UserReducer,
  onboarding: OnboardingReducer,
  business: BusinessReducer
});

const rootReducer = (state: any, action: Action) => {
  if (action.type === 'RESET') {
    state = {};
  }

  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
export type AppThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
