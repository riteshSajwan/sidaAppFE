import { convertUTCDateToLocalDate } from 'src/common/utils/dateUtil';
import { IBookingType } from 'src/components/Booking/Table/BookingListTableUtil';
import { IDriverForCabs } from 'src/components/Cabs/CabsUtil';
import { RequestType } from 'src/components/RequestManagement/RequestListUtil';
import { ITicket } from 'src/components/TicketPage/TicketDetailUtil';

interface IBooking {
  id: number;
  activeStatus: string;
  createdAt: string;
  profileUrl: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  riderVehicleRegistration: IRiderVehicleRegistration;
  riderLicense: IRiderLicense;
  emergencyContactDto: IEmergencyContactDto;
  bankDetailsResponse: IBankDetailsResponse;
  vehicleInsurance: IInsuranceDetailsResponse;
  isApproved: RequestType;
  isBlocked: boolean;
  blockedReason: string;
  comment: string;
  approvalRequestStatus: RequestType | null;
  requestName: string;
  requestType: number;
  sellerName: string;
  renderViewDetails: boolean;
  registrationDate: string;
  username: string;
  licenseImages: ILicenseImage[];
  registrationImages: IRegistrationImage[];
  insuranceImages: IInsuranceImages[];
}

interface IRiderVehicleRegistration {
  vehicleType: string;
  registrationNumber: string;
  createdAt: string;
  expiryDate: string;
}
interface ILicenseImage {
  id: number;
  userId: number;
  fileId: number;
  fileType: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  isPrimary: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}
export interface IRegistrationImage {
  id: number;
  userId: number;
  fileId: number;
  fileType: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  isPrimary: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}
export interface IInsuranceImages {
  id: number;
  userId: number;
  fileId: number;
  fileType: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  isPrimary: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

interface IRiderLicense {
  licenseNumber: string;
  expiryDate: string;
  userId: string;
  createdAt: string;
}
interface IEmergencyContactDto {
  fullName: string;
  phoneNumber: string;
  relationship: string;
  address: string;
}

interface IBankDetailsResponse {
  accountNumber: string;
  paymentMethod: string;
  ifscCode: string;
  dob: string;
  accountHolderName: string;
  activeStatus: boolean;
  mobileNumber: string;
  ribNumber: string;
}

interface IInsuranceDetailsResponse {
  insuranceNumber: string;
  expiryDate: string;
  createdAt: string;
}

function generateIntialBookingData(): IBooking {
  return {
    id: 0,
    firstName: '',
    phoneNumber: '',
    email: '',
    createdAt: '',
    profileUrl: '',
    activeStatus: '',
    comment: '',
    riderLicense: {
      licenseNumber: '',
      userId: '',
      expiryDate: '',
      createdAt: '',
    },
    emergencyContactDto: {
      fullName: '',
      phoneNumber: '',
      relationship: '',
      address: '',
    },
    bankDetailsResponse: {
      accountNumber: '',
      paymentMethod: '',
      ifscCode: '',
      dob: '',
      accountHolderName: '',
      activeStatus: false,
      mobileNumber: '',
      ribNumber: '',
    },
    vehicleInsurance: {
      insuranceNumber: '',
      expiryDate: '',
      createdAt: '',
    },
    riderVehicleRegistration: {
      vehicleType: '',
      registrationNumber: '',
      createdAt: '',
      expiryDate: '',
    },

    licenseImages: [
      {
        id: 0,
        userId: 0,
        fileId: 0,
        fileType: '',
        fileName: '',
        filePath: '',
        fileUrl: '',
        fileSize: 0,
        isPrimary: false,
        deleted: false,
        createdAt: '',
        updatedAt: '',
        createdBy: 0,
        updatedBy: 0,
      },
    ],
    registrationImages: [
      {
        id: 0,
        userId: 0,
        fileId: 0,
        fileType: '',
        fileName: '',
        filePath: '',
        fileUrl: '',
        fileSize: 0,
        isPrimary: false,
        deleted: false,
        createdAt: '',
        updatedAt: '',
        createdBy: 0,
        updatedBy: 0,
      },
    ],
    insuranceImages: [
      {
        id: 0,
        userId: 0,
        fileId: 0,
        fileType: '',
        fileName: '',
        filePath: '',
        fileUrl: '',
        fileSize: 0,
        isPrimary: false,
        deleted: false,
        createdAt: '',
        updatedAt: '',
        createdBy: 0,
        updatedBy: 0,
      },
    ],

    isApproved: RequestType.PENDING,
    isBlocked: false,
    blockedReason: '',
    approvalRequestStatus: null,
    requestName: '',
    requestType: 0,
    sellerName: '',
    renderViewDetails: false,
    registrationDate: '',
    username: '',
  };
}

async function getInitialOnDataDriver(driverDataResponse: IBooking) {
  const {
    id,
    firstName,
    phoneNumber,
    email,
    licenseImages,
    createdAt,
    profileUrl,
    activeStatus,
    riderVehicleRegistration,
    riderLicense,
    emergencyContactDto,
    bankDetailsResponse,
    vehicleInsurance,
    isApproved,
    isBlocked,
    blockedReason,
    approvalRequestStatus,
    comment,
    requestName,
    requestType,
    registrationImages,
    sellerName,
    renderViewDetails,
    registrationDate,
    username,
    insuranceImages,
  } = driverDataResponse;

  const data = {
    id,
    firstName,
    phoneNumber,
    email,
    createdAt,
    profileUrl,
    activeStatus,
    riderVehicleRegistration,
    riderLicense,
    emergencyContactDto,
    bankDetailsResponse,
    vehicleInsurance,
    isApproved,
    isBlocked,
    blockedReason,
    approvalRequestStatus,
    comment,
    requestName,
    requestType,
    sellerName,
    renderViewDetails,
    registrationDate,
    username,
    licenseImages,
    registrationImages,
    insuranceImages,
  };

  return data;
}

enum PaymentOptions {
  BANKTRANSFER = 'BANKTRANSFER',
  ORANGETRANSFER = 'ORANGETRANSFER',
  WAVE = 'WAVE',
}
interface IApiErrorAuthResponse {
  message: string;
  code?: string;
}

enum RideType {
  INTERCITY = 'INTERCITY',
}

enum AssignmentTarget {
  MAIN = 'main',
  ROUND_TRIP = 'roundTrip',
}
export const formatBookingDateTime = (date?: string | null) => convertUTCDateToLocalDate(date ?? undefined, 'DD MMM YYYY @ hh:mm A');
export interface IPastRideListData {
  destinationName: string | null;
  sourceName: string | null;
  id: number;
  rideType?: string;
  isRoundTrip?: boolean;
  customerName?: string;
  orderStatus: string;
  orderTime: string;
  scheduledTime?: string;
  returnScheduledTime?: string | null;
  totalAmount: number;
  totalReturnAmount?: number | null;
  vehicleCategory: string;
  vehicleName: string;
  currency: string;
  phoneNumber?: string;
  riderPhoneNumber?: string | null;
  sourceLat: number;
  sourceLong: number;
  destinationLat: number;
  destinationLong: number;
  riderId: number | null;
  riderImage: string | null;
  riderName: string | null;
  riderRatings: number | null;
  activeStatus: boolean;
  pickupTime: string | null;
  dropTime: string | null;
  tickets?: ITicket[];
  stops?: IRideStop[];
  paymentMethod?: string | null;
  chatRoomId?: string | null;
  waitingCharges?: number | null;
  rideSubTotal?: number | null;
  cancellationCharge?: number | null;
  outstandingDues?: number | null;
}

export interface IRideStop {
  id: number | null;
  orderId: number;
  latitude: number;
  longitude: number;
  address: string;
  stopType: 'SOURCE' | 'MIDDLE_POINT' | 'DESTINATION' | string;
  stopStatus?: 'PENDING' | 'REACHED' | 'COMPLETED' | string | null;
  sequenceOrder?: number | null;
  reachedAt?: string | null;
  completedAt?: string | null;
}

interface IRideLocationPoint {
  key: string;
  type: 'pickup' | 'stop' | 'drop';
  time: string | null;
  title: string;
  stopNumber?: number;
}

export interface IItemPageList {
  total: number;
  page: number;
  size: number;
}

export interface IPastRideResponse extends IItemPageList {
  data: IPastRideListData[];
}

const isRideAssignmentAllowed = (ride?: IPastRideListData | null) => ride?.orderStatus === IBookingType.REQUESTED || ride?.orderStatus === IBookingType.RIDER_ASSIGNED;

const isRideReassignAllowed = (ride?: IPastRideListData | null) => ride?.orderStatus === IBookingType.RIDER_ASSIGNED;

const buildAssignedDriver = (ride: IPastRideListData | null | undefined, translate: (key: string) => string): IDriverForCabs | null => {
  if (!isRideReassignAllowed(ride) || !ride?.riderId) {
    return null;
  }

  return {
    id: ride.riderId,
    firstName: ride.riderName || translate('Admin.Delivery.App.UnknownDriver'),
    email: '',
    phoneNumber: ride.riderPhoneNumber || '',
    profileUrl: ride.riderImage || undefined,
    activeStatus: ride.activeStatus ? translate('Admin.Delivery.App.UserManagementList.Filter.Active') : translate('Admin.Delivery.App.UserManagementList.Filter.Inactive'),
    isBlocked: false,
    latitude: undefined,
    longitude: undefined,
  };
};

const getScheduledDate = (dateTime?: string | null) => dateTime?.split('T')[0] ?? null;

const shouldShowRoundTripRideCard = (ride?: IPastRideListData | null) => ride?.rideType === RideType.INTERCITY && Boolean(ride?.isRoundTrip);

const getActiveAssignmentRide = (assignmentTarget: AssignmentTarget, rideDetails: IPastRideListData | null | undefined, roundTripDetails: IPastRideListData | null | undefined) =>
  assignmentTarget === AssignmentTarget.ROUND_TRIP ? roundTripDetails : rideDetails;

const getAssignedDriverLabel = (ride?: IPastRideListData | null) => (ride?.riderName ? `${ride.riderName}${ride.riderId ? ` (#${ride.riderId})` : ''}` : '-');

const buildScheduleMarkedDates = (upcomingScheduledTimes: string[] | undefined, selectedColor: string) =>
  (upcomingScheduledTimes || []).reduce<Record<string, { selected: boolean; marked: boolean; selectedColor: string }>>((acc, scheduledTime) => {
    const date = getScheduledDate(scheduledTime);

    if (date) {
      acc[date] = {
        selected: true,
        marked: true,
        selectedColor,
      };
    }

    return acc;
  }, {});

const buildRideLocationPoints = (ride: IPastRideListData | null | undefined, formatTime: (date?: string | null) => string | null): IRideLocationPoint[] => {
  if (!ride) {
    return [];
  }

  const fallbackPoints: IRideLocationPoint[] = [
    {
      key: 'pickup',
      type: 'pickup',
      time: formatTime(ride.pickupTime),
      title: ride.sourceName || '-',
    },
    {
      key: 'drop',
      type: 'drop',
      time: formatTime(ride.dropTime),
      title: ride.destinationName || '-',
    },
  ];

  if (!ride.stops?.length) {
    return fallbackPoints;
  }

  const sortedStops = [...ride.stops].sort((firstStop, secondStop) => {
    const firstOrder = firstStop.sequenceOrder ?? 0;
    const secondOrder = secondStop.sequenceOrder ?? 0;

    return firstOrder - secondOrder;
  });

  const sourceStop = sortedStops.find((stop) => stop.stopType === 'SOURCE');
  const destinationStop = [...sortedStops].reverse().find((stop) => stop.stopType === 'DESTINATION');
  const intermediateStops = sortedStops.filter((stop) => stop.stopType === 'MIDDLE_POINT');

  const locationPoints: IRideLocationPoint[] = [];

  locationPoints.push({
    key: `pickup-${sourceStop?.id ?? sourceStop?.orderId ?? 'default'}`,
    type: 'pickup',
    time: formatTime(sourceStop?.completedAt || sourceStop?.reachedAt || ride.pickupTime),
    title: sourceStop?.address || ride.sourceName || '-',
  });

  intermediateStops.forEach((stop, index) => {
    locationPoints.push({
      key: `stop-${stop.id ?? stop.orderId ?? index}`,
      type: 'stop',
      time: formatTime(stop.completedAt || stop.reachedAt),
      title: stop.address || '-',
      stopNumber: index + 1,
    });
  });

  locationPoints.push({
    key: `drop-${destinationStop?.id ?? destinationStop?.orderId ?? 'default'}-dest`,
    type: 'drop',
    time: formatTime(destinationStop?.completedAt || destinationStop?.reachedAt || ride.dropTime),
    title: destinationStop?.address || ride.destinationName || '-',
  });

  return locationPoints;
};

export {
    AssignmentTarget,
    buildAssignedDriver,
    buildRideLocationPoints,
    buildScheduleMarkedDates,
    generateIntialBookingData,
    getActiveAssignmentRide,
    getAssignedDriverLabel,
    getInitialOnDataDriver,
    getScheduledDate,
    IApiErrorAuthResponse,
    IBooking,
    ILicenseImage,
    isRideAssignmentAllowed,
    isRideReassignAllowed,
    PaymentOptions,
    RideType,
    shouldShowRoundTripRideCard
};

