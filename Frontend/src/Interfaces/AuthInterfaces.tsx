export interface IUser{
    id:number;
    name:string;
    email:string;
    password:string;
    avatar:string|null;
    about:string|null;
    domain:string|null;
    isActive:number;
    isBlacklisted:number;
    short_bio:string|null;
    createdAt:string;
}

export interface ILoginResponse{
    success:boolean;
    message:string;
    statusCode:number;
    data:IUser;
    token:string;
}
export interface IUserInfo{
    success:boolean;
    message:string;
    statusCode:number;
    data:IUser;
}