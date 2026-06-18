import { RequestType } from 'src/components/RequestManagement/RequestListUtil';

export interface IApproveRejectProps {
    toggleModal: () => void;
    handleRequestApproveOrRejection: (status: RequestType, comment: string | null) => void;
}
