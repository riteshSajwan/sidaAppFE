import moment from 'moment-timezone';
import { DateType } from 'src/components/Restaurant/component/RestaurantLicenseAndTaxSection/RestaurantLicenseAndTaxUtil';
import { ITime } from 'src/components/Restaurant/utils/RestaurantUtil';

type TimezoneType = string | null | undefined;

function formatDateToMomentString(date: DateType) {
  return moment(date).format('YYYY-MM-DDTHH:mm:ss');
}

function formatTime({ hours, minutes }: ITime) {
  const dateObj = new Date();
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);
  return dateObj;
}

function formatTimeString(dateString: string) {
  return moment(dateString).format('LT');
}

function formatMomentToDate(date: string) {
  return moment(date).toDate();
}

function formatTimeToMoment(timeObj: string) {
  return moment(timeObj, 'HH:mm').format('YYYY-MM-DDTHH:mm:ss');
}

function formatToMonthYear(dateString: string) {
  return moment(dateString).format('MMM YYYY'); // 30 Nov
}

function getTodayDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight
  return today;
}

function formatToHoursMinutes(timeObj: string) {
  if (!timeObj) {
    return '';
  }
  return moment(timeObj).format('HH:mm');
}

function formatToMonthDateYear(timeObj: string) {
  return moment(timeObj).format('ll');
}

function formatToDateMonthYear(timeObj: string) {
  return moment(timeObj).format('DD/MM/YY');
}

function formatYearMonthDate(timeObj: Date) {
  return moment(timeObj).format('YYYY-MM-DD');
}

const formatToPascalCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/(?:^|_)([a-z])/g, (_, letter) => letter.toUpperCase());
};

const getTimezoneId = (timezoneId?: TimezoneType) => {
  return timezoneId || moment.tz.guess();
};

function formatTimeHoursMinutes(
  time?: string | null | moment.Moment,
): string | null {
  if (!time) return null;

  return moment(time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
}
function formatTimeHoursMinutes24Hours(
  time?: string | null | moment.Moment,
): string | null {
  if (!time) return null;

  return moment(time, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm');
}

function convertUTCToLocal(value: string | null) {
  if (!value) {
    return '';
  }
  const localTimezone = moment.tz.guess();
  const localTime = moment.tz(value, 'HH:mm', 'UTC').tz(localTimezone);
  return localTime.format('YYYY-MM-DDTHH:mm:ss');
}

function formatToDateMonthYearAndTime(localTime: string | null): string | null {
  if (!localTime) return null;

  return moment(localTime).format('DD MMM YYYY @ hh:mm A');
}
function formatToDateMonthYearAndTime24Hours(
  localTime: string | null,
): string | null {
  if (!localTime) return null;

  return moment(localTime).format('DD MMM YYYY @ HH:mm');
}

function convertUTCDateToLocalDate(
  utcTime: string | undefined,
  outputFormat: string = 'YYYY-MM-DD HH:mm:ss',
): string | null {
  if (!utcTime) return null;

  const localTimezone = moment.tz.guess();

  const localTime = moment.utc(utcTime).tz(localTimezone).format(outputFormat);

  return localTime;
}
function formatToDayMonthTime(value: string | null): string | null {
  if (!value) return null;
  const localTimezone = moment.tz.guess();
  return moment.utc(value).tz(localTimezone).format('ddd, MMM DD, hh:mm A');
}

function convertToMilliseconds(dateString: string | DateType | number) {
  if (dateString) {
    return new Date(dateString).getTime();
  }
  return '';
}

function getTomorrowDate(): string {
  return moment().add(1, 'days').format('YYYY-MM-DD');
}

export {
  convertToMilliseconds,
  convertUTCDateToLocalDate,
  convertUTCToLocal,
  formatDateToMomentString,
  formatMomentToDate,
  formatTime,
  formatTimeHoursMinutes,
  formatTimeHoursMinutes24Hours,
  formatTimeString,
  formatTimeToMoment,
  formatToDateMonthYear,
  formatToDateMonthYearAndTime,
  formatToDateMonthYearAndTime24Hours,
  formatToDayMonthTime,
  formatToHoursMinutes,
  formatToMonthDateYear,
  formatToMonthYear,
  formatToPascalCase,
  formatYearMonthDate,
  getTimezoneId,
  getTodayDate,
  getTomorrowDate
};
