export type ChangePassword =
    |
    {
        id: number,
        email: string,
        username: string ,
        firstName: string,
        lastName: string ,
        phoneNumber:string,
        country:string ,
        state: string,
        city: string ,
        address: string, 
        pinCode: string, 
        status: string ,
        profileUrl: string,

        role : {
            id : number ,
            name : string
        } 
    } | null

export type NewPassword = {
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string
}