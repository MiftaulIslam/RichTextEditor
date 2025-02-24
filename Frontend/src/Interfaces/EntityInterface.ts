/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUser{

        id:string;
        name:string;
        email:string;
        password:string;
        avatar:string|null;
        about:string|null;
        domain:string|null;
        isActive:number|boolean;
        isBlacklisted:number;
        short_bio:string|null;
        createdAt:string;
        articles:IArticle[];
    
}
export interface IUserResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IUser |undefined|any;
  token?: string;
}

  // Interface for the following relationship
  export interface IFollow {
    follower_id: string;
    following_id: string;
    created_at: string;
    User_follows_follower_idToUser?: IUser;
  }
export interface ILike{
id:string;
article_id:string;
user_id:string;
created_at:string;
}

export interface IComment{
id:string;
article_id:string;
author_id:string;
content:string;
created_at:string;
User?:any
parent_id:string|null;
}

  export interface IArticle{
    User?:IUser;
    likes?:ILike[];
    comments?:IComment[];
    author_id:string;
    content:string;
    created_at:string;
    id:string;
    is_published:boolean;
    published_at:string | null;
    short_preview:string | null;
    slug:string|null;
    thumbnail:string|null;
    title:string|null;
    updated_at:string|null;
    views:number;
  }

  export interface IPagination{
    limit:number;
    page:number;
    total:number;
    pages:number;
  }

