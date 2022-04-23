export interface UserProfile {
  name: string;
  email: string;
  password: string;
}

export interface UserData {
  name: string;
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserSchema {
    _id: string;
    name: string;
    email: string;
    password: string
}

export const COLLECTION_NAME = 'users';
