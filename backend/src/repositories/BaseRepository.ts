import { PrismaClient } from '@prisma/client';

/**
 * Base repository class providing common CRUD operations
 * All feature repositories extend this class
 */
export abstract class BaseRepository {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Handle database errors with consistent error messages
   */
  protected handleError(error: unknown, context: string): never {
    if (error instanceof Error) {
      throw new Error(`${context}: ${error.message}`);
    }
    throw new Error(`${context}: Unknown error occurred`);
  }

  /**
   * Validate that an ID exists before operations
   */
  protected validateId(id: string, fieldName: string = 'ID'): void {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error(`${fieldName} is required and must be a non-empty string`);
    }
  }

  /**
   * Check if record exists before deletion/update
   */
  protected async recordExists(
    model: any,
    where: Record<string, any>
  ): Promise<boolean> {
    try {
      const record = await model.findUnique({ where });
      return !!record;
    } catch {
      return false;
    }
  }
}
