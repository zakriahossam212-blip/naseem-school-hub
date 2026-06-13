import { MessageService } from '@/services/messaging';
import { mockPrismaClient } from '../mocks/db.mock';

describe('MessageService', () => {
  let messageService: MessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    messageService = new MessageService(mockPrismaClient);
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const messageData = {
        senderId: 'user1',
        recipientId: 'user2',
        subject: 'Test Subject',
        body: 'Test message body',
        attachmentUrl: 'https://example.com/file.pdf',
      };

      const mockMessage = {
        id: 'msg1',
        ...messageData,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.message.create.mockResolvedValue(mockMessage);

      const result = await messageService.sendMessage(messageData);

      expect(result).toEqual(mockMessage);
      expect(mockPrismaClient.message.create).toHaveBeenCalledWith({
        data: messageData,
      });
    });

    it('should throw error when senderId is same as recipientId', async () => {
      const messageData = {
        senderId: 'user1',
        recipientId: 'user1',
        subject: 'Self message',
        body: 'Cannot send to self',
      };

      await expect(messageService.sendMessage(messageData)).rejects.toThrow(
        'Cannot send message to yourself'
      );
    });
  });

  describe('getInbox', () => {
    it('should retrieve inbox messages for a user', async () => {
      const userId = 'user1';
      const mockMessages = [
        {
          id: 'msg1',
          senderId: 'user2',
          recipientId: userId,
          subject: 'Message 1',
          body: 'Body 1',
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'msg2',
          senderId: 'user3',
          recipientId: userId,
          subject: 'Message 2',
          body: 'Body 2',
          isRead: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaClient.message.findMany.mockResolvedValue(mockMessages);

      const result = await messageService.getInbox(userId);

      expect(result).toHaveLength(2);
      expect(mockPrismaClient.message.findMany).toHaveBeenCalledWith({
        where: { recipientId: userId },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array for user with no messages', async () => {
      const userId = 'user1';
      mockPrismaClient.message.findMany.mockResolvedValue([]);

      const result = await messageService.getInbox(userId);

      expect(result).toEqual([]);
    });
  });

  describe('getUnreadCount', () => {
    it('should get unread message count', async () => {
      const userId = 'user1';
      mockPrismaClient.message.count.mockResolvedValue(3);

      const result = await messageService.getUnreadCount(userId);

      expect(result).toBe(3);
      expect(mockPrismaClient.message.count).toHaveBeenCalledWith({
        where: {
          recipientId: userId,
          isRead: false,
        },
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark message as read', async () => {
      const messageId = 'msg1';
      const userId = 'user1';

      mockPrismaClient.message.update.mockResolvedValue({
        id: messageId,
        senderId: 'user2',
        recipientId: userId,
        subject: 'Test',
        body: 'Test body',
        isRead: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await messageService.markAsRead(messageId, userId);

      expect(mockPrismaClient.message.update).toHaveBeenCalledWith({
        where: {
          id: messageId,
          recipientId: userId,
        },
        data: { isRead: true },
      });
    });

    it('should throw error if message not found', async () => {
      const messageId = 'nonexistent';
      const userId = 'user1';

      mockPrismaClient.message.update.mockRejectedValue(
        new Error('Message not found')
      );

      await expect(messageService.markAsRead(messageId, userId)).rejects.toThrow(
        'Message not found'
      );
    });
  });
});
