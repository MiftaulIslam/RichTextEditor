
import { IArticle,IPagination,  IFollow, IUser } from "./EntityInterface";

  
  
  // Interface for the response
  export interface IProfileResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: IUser & {
      follows_follows_following_idToUser: IFollow[];
    };
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


export interface IArticleResponse{
  data:{articles:IArticle[];pagination?:IPagination};
  message:string;
  statusCode:number;
  success:boolean;

}