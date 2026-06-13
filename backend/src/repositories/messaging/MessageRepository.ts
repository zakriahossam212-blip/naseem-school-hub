import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../BaseRepository';
import { MessageDto } from '@/types';

/**
 * MessageRepository handles all message-related database operations
 */
export class MessageRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Create new message
   */
  async create(data: {
    senderId: string;
    recipientId: string;
    subject: string;
    body: string;
    attachmentUrl?: string;
  }): Promise<MessageDto> {
    try {
      const message = await this.prisma.message.create({
        data: {
          ...data,
          isRead: false,
        },
      });
      return this.mapToDto(message);
    } catch (error) {
      this.handleError(error, 'Failed to create message');
    }
  }

  /**
   * Get message by ID
   */
  async findById(id: string): Promise<MessageDto | null> {
    this.validateId(id, 'Message ID');
    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
        include: {
          sender: true,
          recipient: true,
        },
      });
      return message ? this.mapToDto(message as any) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch message');
    }
  }

  /**
   * Get inbox for a user
   */
  async findInbox(userId: string): Promise<MessageDto[]> {
    this.validateId(userId, 'User ID');
    try {
      const messages = await this.prisma.message.findMany({
        where: { recipientId: userId },
        include: {
          sender: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return messages.map(m => this.mapToDto(m as any));
    } catch (error) {
      this.handleError(error, 'Failed to fetch inbox');
    }
  }

  /**
   * Get sent messages for a user
   */
  async findSent(userId: string): Promise<MessageDto[]> {
    this.validateId(userId, 'User ID');
    try {
      const messages = await this.prisma.message.findMany({
        where: { senderId: userId },
        include: {
          recipient: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return messages.map(m => this.mapToDto(m as any));
    } catch (error) {
      this.handleError(error, 'Failed to fetch sent messages');
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    this.validateId(userId, 'User ID');
    try {
      return await this.prisma.message.count({
        where: {
          recipientId: userId,
          isRead: false,
        },
      });
    } catch (error) {
      this.handleError(error, 'Failed to get unread count');
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(id: string): Promise<MessageDto> {
    this.validateId(id, 'Message ID');
    try {
      const message = await this.prisma.message.update({
        where: { id },
        data: { isRead: true },
      });
      return this.mapToDto(message);
    } catch (error) {
      this.handleError(error, 'Failed to mark message as read');
    }
  }

  /**
   * Mark all messages as read for a user
   */
  async markAllAsRead(userId: string): Promise<number> {
    this.validateId(userId, 'User ID');
    try {
      const result = await this.prisma.message.updateMany({
        where: {
          recipientId: userId,
          isRead: false,
        },
        data: { isRead: true },
      });
      return result.count;
    } catch (error) {
      this.handleError(error, 'Failed to mark all messages as read');
    }
  }

  /**
   * Delete message
   */
  async delete(id: string): Promise<void> {
    this.validateId(id, 'Message ID');
    try {
      await this.prisma.message.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'Failed to delete message');
    }
  }

  /**
   * Get conversation between two users
   */
  async findConversation(userId1: string, userId2: string): Promise<MessageDto[]> {
    this.validateId(userId1, 'User 1 ID');
    this.validateId(userId2, 'User 2 ID');
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: userId1,
              recipientId: userId2,
            },
            {
              senderId: userId2,
              recipientId: userId1,
            },
          ],
        },
        include: {
          sender: true,
          recipient: true,
        },
        orderBy: { createdAt: 'asc' },
      });
      return messages.map(m => this.mapToDto(m as any));
    } catch (error) {
      this.handleError(error, 'Failed to fetch conversation');
    }
  }

  /**
   * Map database Message to MessageDto
   */
  private mapToDto(message: any): MessageDto {
    return {
      id: message.id,
      senderId: message.senderId,
      recipientId: message.recipientId,
      subject: message.subject,
      body: message.body,
      attachmentUrl: message.attachmentUrl || undefined,
      isRead: message.isRead,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
