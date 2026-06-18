import { translateMessage } from 'src/i18n/createTranslation';

export const rejectionOptions = [
  {
    value: 'discrepancy',
    label: translateMessage('Admin.Delivery.Request.Rejection.Reason.Discrepancy'),
  },
  {
    value: 'documents',
    label: translateMessage('Admin.Delivery.Request.Rejection.Reason.Documents'),
  },
  {
    value: 'violations',
    label: translateMessage('Admin.Delivery.Request.Rejection.Reason.Violations'),
  },
];
