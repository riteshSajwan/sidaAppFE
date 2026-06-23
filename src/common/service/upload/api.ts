import { AUTH_BASE_URL } from "src/constants";
import restService from "../restService/restService";
import { IUploadFormState, uploadFormResponse } from "src/components/Upload/Upload/UploadContainerUtils";

export const uploadMapWithDetails = (data: IUploadFormState): Promise<uploadFormResponse> => {
  return restService
    .generateHeaders({
      'Content-type': 'application/json; charset=UTF-8',
    })
    .then((headers) =>
      restService.fetch(`${AUTH_BASE_URL}/upload-form`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }),
    );
};