export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface MessageSender {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  sender: MessageSender;
}

export interface PaginatedMessages {
  messages: Message[];
  nextCursor?: string;
}

export interface ApiError {
  message: string;
  errors?: string;
}
