export type UserRole = 'user' | 'admin' | 'moderator';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
