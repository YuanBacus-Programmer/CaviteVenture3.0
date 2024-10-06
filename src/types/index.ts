// types/index.ts
export interface IUser {
 _id: string;
 firstName: string;
 lastName: string;
 email: string;
 role: string;
 profilePicture?: string;
 isVerified: boolean;
 createdAt?: Date;
 updatedAt?: Date;
}
