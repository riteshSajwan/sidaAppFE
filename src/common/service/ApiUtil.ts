const buildQueryParam = (
  field: string,
  value: string | null | undefined | boolean
): string => {
  return value ? `${field}=${value}` : '';
};

interface IAPIError {
  errors?: string[];
}

export {
  IAPIError,
  buildQueryParam
}
