import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { MessageDto, SendMessageRequest } from "@/types/index";

export class MessageService {
  /**
   * Send message from user to user
   */
  async sendMessage(
    fromUserId: string,
    data: SendMessageRequest
  ): Promise<MessageDto> {
    const recipient = await db.profile.findUnique({
      where: { userId: data.toUserId },
    });

    if (!recipient) {
      throw errors.notFound("Recipient not found");
    }

    const message = await db.message.create({
      data: {
        fromUserId,
        toUserId: data.toUserId,
        subject: data.subject,
        body: data.body,
      },
    });

    return this.mapMessageToDto(message);
  }

  /**
   * Get user's inbox messages
   */
  async getInbox(userId: string): Promise<MessageDto[]> {
    const messages = await db.message.findMany({
      where: { toUserId: userId },
      orderBy: { createdAt: "desc" },
    });

    return messages.map((m) => this.mapMessageToDto(m));
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return db.message.count({
      where: { toUserId: userId, isRead: false },
    });
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string, userId: string): Promise<void> {
    const message = await db.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw errors.notFound("Message not found");
    }

    if (message.toUserId !== userId) {
      throw errors.forbidden("You can only mark your own messages as read");
    }

    await db.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  private mapMessageToDto(message: any): MessageDto {
    return {
      id: message.id,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      subject: message.subject,
      body: message.body,
      isRead: message.isRead,
      createdAt: message.createdAt.toISOString(),
    };
  }
}

export const messageService = new MessageService();
