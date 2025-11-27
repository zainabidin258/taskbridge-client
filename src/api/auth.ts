import api from './axios';
import type { IUser } from '../types/User';

interface SignupData {
  name: string;
  password: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: IUser;
  token: string;
  role: string;
  name: string;
  _id: string;
}

//SignUp
export const signupUser = async (data: SignupData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', data);
  return response.data;
};

//Login
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', data);
  return response.data;
};
