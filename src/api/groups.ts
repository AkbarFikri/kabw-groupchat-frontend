import { api } from './client';
import type { Group } from '@/types';

export const groupsApi = {
  getMyGroups: () => api.get<Group[]>('/groups'),
  join: (groupId: string) => api.post<{ message: string }>(`/groups/${groupId}`),
  leave: (groupId: string) => api.delete<{ message: string }>(`/groups/${groupId}`),
};
