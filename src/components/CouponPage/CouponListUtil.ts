import { DEFAULT_TABLE_SIZE } from 'src/common/components/CustomDataTable/CustomDataTableUtil';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { translateMessage } from 'src/i18n/createTranslation';

interface ICoupon {
  id?: string | number;
  couponName: string;
  expirationDateTime:string | Date;
  minimumOrderValue:string,
  couponDiscountPercent: string
  activeStatus:boolean;
  couponFrenchName:string;
  maxDiscountAvailable:string
}
interface IAddOnDetail {
  id: number;
  addOnId: number;
  addOnQuantity: number;
  addOnGroupName: string;
  addOnName: string;
}

interface IVariantDetail {
  id: number;
  variantId: number;
  variantName: string;
  variantGroupName: string;
  variantPrice: number;
}

interface IOrderItemDetail {
  itemId: number;
  itemName: string;
  itemQuantity: number;
  itemImageURL: string;
  itemBasePrice: number | null;
  addOnDetails: IAddOnDetail[];
  variantsDetails: IVariantDetail[];
}

interface IRiderDetails {
  name: string;
  phone: string;
}

interface IOrder {
  id: number;
  orderTime: string;
  orderItemsDetails: IOrderItemDetail[];
  userId: number;
  userLatitude: number | null;
  userLongitude: number | null;
  sellerId: number;
  logoUrl: string;
  sellerName: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  addressId: number;
  address: string;
  customerName: string;
  phoneNumber: string;
  specialRequest: string | null;
  createdAt: string;
  updatedAt: string;
  mode: string;
  deliveryFee: number | null;
  serviceCharge: number | null;
  scheduledAt: string | null;
  riderDetails: IRiderDetails;
  timeRemaining: number;
}

interface ICouponListFilter {
  searchKey?: string;
  sortField: string;
  sortOrder: string;
  status?: string;
  createdAt?: DateType | null;
  isActive:string
}

interface ICouponListTempFilter {
  status: string;
  searchKey: string;
  createdAt: DateType | null;
  isActive:string
}

interface IOrderListResponse {
  data: IOrder[];
  total: number;
  page: number;
  size: number;
}

interface IOrderStatusCount {
  status: string;
  count: number;
}

interface IOrderListAPIResponse {
  orderList: IOrderListResponse;
  orderStatusCount: IOrderStatusCount[];
}

 interface ICouponListResponse {
  data: ICoupon[];
  total: number;
  page: number;
  size: number;
}
interface ICusineListFilter {
  searchKey?: string;
  status?: string;
  createdAt?: DateType | null;
}

function generateCouponListData(): ICouponListResponse {
  return {
    data: [],
    total: 0,
    page: 0,
    size: DEFAULT_TABLE_SIZE
  };
}



function generateInitialFilterData(): ICouponListFilter {
  return {
    status: '',
    createdAt: null,
    searchKey: '',
    sortField: '',
    sortOrder: '',
    isActive:''
  }
}

enum ICouponStatusType {
  ACTIVE='TRUE',
  INACTIVE='FALSE',
}

function generateInitialTempFilterData(): ICouponListTempFilter {
    return {
        status: '',
        searchKey: '',
        createdAt: null,
        isActive:''
    }
}

function couponStatusOptions() { 
  return[
  {
    label: translateMessage('Admin.Delivery.App.RequestManagementList.Filter.All'),
    value: '',
  },
  {
    label: translateMessage('Admin.Delivery.App.UserManagementList.Filter.Active'),
    value: ICouponStatusType.ACTIVE,
  },
  {
    label: translateMessage('Admin.Delivery.App.UserManagementList.Filter.Inactive'),
    value: ICouponStatusType.INACTIVE,
  },
];}


export {
  ICouponListResponse,
    IOrder,
    IOrderItemDetail,
    IAddOnDetail,
    IVariantDetail,
    IRiderDetails,
    IOrderListResponse,
    IOrderStatusCount,
    IOrderListAPIResponse,
    ICouponListFilter,
    ICouponListTempFilter,
    generateCouponListData,
    generateInitialFilterData,
    generateInitialTempFilterData,
    couponStatusOptions,
    ICoupon,
    ICusineListFilter,
    ICouponStatusType
  };
  
