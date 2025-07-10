import { httpClient } from './http';

// TODO: User authentication and management APIs
export const getCurrentUser = () => 
  httpClient.get('/users/me');

export const login = (credentials: { email: string; password: string }) => 
  httpClient.post('/auth/login', credentials);

export const logout = () => 
  httpClient.post('/auth/logout', {});