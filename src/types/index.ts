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

export interface DecodedToken {
 userId: string;
 email: string;
 role: string;
 iat: number;
 exp: number;
}

export type ToastType = 'success' | 'error';

export interface ToastState {
 show: boolean;
 message: string;
 type: ToastType;
}
