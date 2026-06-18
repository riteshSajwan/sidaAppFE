import CustomApproveRejectButton from 'src/common/components/CustomApproveRejectButton/CustomApproveRejectButton';
import { RequestType } from 'src/components/RequestManagement/RequestListUtil';

export const renderRequestRejectionButton = (
  approvalRequestStatus: RequestType | null,
  toggleModal: () => void,
  handleRequestApproveOrRejection: (status: RequestType, comment: string | null) => void,
  canEdit: boolean = true
) => {
  // Only show approve/reject buttons if user has edit permission
  if (!canEdit) {
    return null;
  }

  if (approvalRequestStatus === null) {
    return null;
  }
  
  if (approvalRequestStatus === RequestType.PENDING) {
    return (
      <CustomApproveRejectButton
        toggleModal={toggleModal}
        handleRequestApproveOrRejection={handleRequestApproveOrRejection}
      />
    );
  }
  return null;
};