export interface APIError {
    errors?: string[]; 
  }
export interface IApiErrorResponse {
    errors: string[],
  }
  
export interface IApiErrorDetailResponse {
  details: string[];
  message?: string;
  code?: string;
  errors?: string[];
}
export const setApiError = (error: IApiErrorResponse) => {
  return error.errors[0]?.split(' | ')[0] || error.errors[0];
};