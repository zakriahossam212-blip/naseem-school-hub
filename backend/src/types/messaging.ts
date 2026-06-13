/**
 * Messaging Type Definitions
 */

/**
 * Message Data Transfer Object
 */
export interface MessageDto {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  body: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Send Message Request
 */
export interface SendMessageRequest {
  senderId: string;
  recipientId: string;
  subject: string;
  body: string;
  attachmentUrl?: string;
}

/**
 * Message with sender/recipient details
 */
export interface MessageWithDetails extends MessageDto {
  senderName?: string;
  recipientName?: string;
}

/**
 * Inbox summary
 */
export interface InboxSummary {
  totalMessages: number;
  unreadCount: number;
  lastMessageDate?: Date;
}

/**
 * Conversation between two users
 */
export interface Conversation {
  userId1: string;
  userId2: string;
  messages: MessageDto[];
  lastMessage?: MessageDto;
  unreadCount: number;
}

/**
 * Message thread
 */
export interface MessageThread {
  id: string;
  subject: string;
  participantCount: number;
  messageCount: number;
  lastMessage?: MessageDto;
  createdAt: Date;
  updatedAt: Date;
}
