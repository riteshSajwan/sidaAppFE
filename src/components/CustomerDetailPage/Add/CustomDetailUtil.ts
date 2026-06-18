
interface ICustomer {
    id: number,
    activeStatus: string,
    createdAt: string;
    profileUrl: string,
    email: string,
    phoneNumber: string,
    firstName: string,
    isBlocked: boolean,
    blockedReason: string,
    userSubscription: IUserSubscription,
}

interface ICustomerStatusRequest {
    id: string;
    isBlocked: boolean;
    blockedReason: string;
}
interface IUserSubscription {
    createdAt: string;
    id: string;
    subscriptionPlan: string;
    updatedAt: string;
    userId: string;
    validFrom: string;
    validTo: string;
}


function generateIntialCustomerngData(): ICustomer {
    return {
        id: 0,
        firstName: '',
        phoneNumber: '',
        email: '',
        createdAt: '',
        profileUrl: '',
        activeStatus: '',
        isBlocked: false,
        blockedReason: '',
        userSubscription: {
            createdAt: '',
            id: '',
            subscriptionPlan: '',
            updatedAt: '',
            userId: '',
            validFrom: '',
            validTo: '',
        },
    };
}

async function getInitialOnDataCustomer(
    customerDataResponse: ICustomer
) {
    const { id, firstName, phoneNumber, email, createdAt, profileUrl, activeStatus, isBlocked, blockedReason, userSubscription } = customerDataResponse;
    const data = {
        id: id,
        firstName: firstName,
        phoneNumber: phoneNumber,
        email: email,
        createdAt: createdAt,
        profileUrl: profileUrl,
        activeStatus: activeStatus,
        isBlocked: isBlocked,
        blockedReason: blockedReason,
        userSubscription: userSubscription
    }
    return data
}

const BLOCK_REASON_CHARACTER_LIMIT = 255;

export {
    ICustomer,
    ICustomerStatusRequest,
    generateIntialCustomerngData,
    getInitialOnDataCustomer,
    BLOCK_REASON_CHARACTER_LIMIT
};
