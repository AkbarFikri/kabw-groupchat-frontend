import { api } from './client';
import type { User } from '@/types';

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ message: string }>('/auths/login', { username, password }),

  logout: () => api.delete<{ message: string }>('/auths/logout'),

  register: (username: string, password: string) =>
    api.post<User>('/auths/register', { username, password }),
};
