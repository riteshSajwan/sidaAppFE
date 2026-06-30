import { translateMessage } from 'src/i18n/createTranslation';
import { Routes } from 'src/routing/paths';

export const getHeaderTitle = (path: string): string | undefined => {
  const normalizedPath = path.toLowerCase();

  // Remove trailing /index, trailing slashes, and dynamic IDs
  const cleanPath = normalizedPath
    .replace(/\/index$/, '')
    .replace(/\/\d+$/, '')
    .replace(/\/$/, '');

  switch (true) {
    case cleanPath.includes(Routes.DASHBOARD.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Dashboard.Title');
    case cleanPath.includes(Routes.BOOKINGHISTORY.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Booking.History');
    case cleanPath.includes(Routes.DRIVERDETAILS.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Driver.Title');
    case cleanPath.includes(`${Routes.DRIVER}${Routes.ONBOARDING}`.toLowerCase()):
      return translateMessage('Admin.Delivery.Driver.Onboarding');
    case cleanPath.includes(Routes.DRIVER_ONBOARRDING.toLowerCase()):
      return translateMessage('Admin.Delivery.App.DriverManagement.Heading');
    case cleanPath.split('/').includes(Routes.DRIVER.toLowerCase().replace('/', '')):
      return translateMessage('Admin.Delivery.App.Drivers');
    case cleanPath.includes(Routes.CUSTOMER.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Customers');
    case cleanPath.includes(Routes.ROLES.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Roles.Label');
    case cleanPath.includes(Routes.USERS.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Users.Label');
    case cleanPath.includes(Routes.REQUESTS.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Request.Title');
    case cleanPath.includes(Routes.RESTAURANT.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Dashboard.RestaurantManagement');
    case cleanPath.includes(Routes.CITIES.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Configure.Service');
    case cleanPath.includes(Routes.COUNTRIES.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Country.Heading');
    case cleanPath.includes(Routes.ORDER.toLowerCase()):
      return translateMessage('Admin.Delivery.App.OrderManagement.Heading');
    case cleanPath.includes(Routes.TAGS.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Tags.TagsManager');
    case cleanPath.includes(Routes.COUPON.toLowerCase()):
      return translateMessage('Admin.Delivery.App.CouponManagement.Heading');
    case cleanPath.includes(Routes.BANNER.toLowerCase()):
      return translateMessage('Admin.Delivery.App.BannerManagement.Heading');
    case cleanPath.includes(Routes.TICKET.toLowerCase()):
      return translateMessage('Admin.Delivery.App.TicketManagement.Heading');
    case cleanPath.includes(Routes.TRIPDETAILS.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Trip.Details');
    case cleanPath.includes(Routes.REPORT.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Reports');
    case cleanPath.includes(Routes.BOOKING.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Bookings.Title');
    case cleanPath.includes(Routes.BUSINESS.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Business');
    case cleanPath.includes(Routes.INVOICING.toLowerCase()):
      return translateMessage('Admin.Delivery.App.InvoiceManagement');
    case cleanPath.includes(Routes.NEWBOOKING.toLowerCase()):
      return translateMessage('Admin.Delivery.App.New.Booking.Heading');
    case cleanPath.includes(Routes.RATE_TIERS.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Rate.Tiers.Management');
    case cleanPath.includes(Routes.PROFILE.toLowerCase()):
      return translateMessage('Admin.Delivery.App.Profile.Label');
    case cleanPath.includes(Routes.UPLOAD.toLowerCase()):
      return translateMessage('Admin.Sida.App.Layout.Upload');
    case cleanPath.includes(Routes.SCRUTINYREPORT.toLowerCase()):
      return translateMessage('Admin.Sida.App.Reports');
    case cleanPath.includes(Routes.ARCHITECTDETAILS.toLowerCase()):
      return translateMessage('Admin.Sida.APP.ArchitectDetails.Details');
    default:
      return undefined;
  }
};
