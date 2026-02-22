import { api } from './client';
import type { Message, PaginatedMessages } from '@/types';

export const messagesApi = {
  send: (groupId: string, content: string) =>
    api.post<Message>(`/messages/${groupId}`, { content }),

  getMessages: (groupId: string, cursor?: string, take?: number) => {
    const params = new URLSearchParams();
    if (cursor) params.set('cursor', cursor);
    if (take) params.set('take', String(take));
    const qs = params.toString();
    return api.get<PaginatedMessages>(`/messages/${groupId}${qs ? `?${qs}` : ''}`);
  },
};
