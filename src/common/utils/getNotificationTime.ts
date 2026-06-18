import moment from 'moment';
 
export const getTimeAgo = (dateString: string): string => {
  const date = moment.parseZone(dateString);
  return date.fromNow();
};