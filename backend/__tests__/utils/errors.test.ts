import { AppError, errors } from '@/utils/errors';

describe('Error Handling', () => {
  describe('AppError', () => {
    it('should create an AppError instance', () => {
      const error = new AppError(400, 'Bad Request', 'BAD_REQUEST');

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad Request');
      expect(error.code).toBe('BAD_REQUEST');
    });

    it('should convert to JSON format', () => {
      const error = new AppError(400, 'Bad Request', 'BAD_REQUEST');
      const json = error.toJSON();

      expect(json.success).toBe(false);
      expect(json.error).toBe('Bad Request');
      expect(json.code).toBe('BAD_REQUEST');
      expect(json.statusCode).toBe(400);
      expect(json.timestamp).toBeDefined();
    });

    it('should include details in JSON when provided', () => {
      const details = { field: 'email', reason: 'invalid format' };
      const error = new AppError(400, 'Validation failed', 'BAD_REQUEST', details);
      const json = error.toJSON();

      expect(json.details).toEqual(details);
    });
  });

  describe('error constructors', () => {
    it('should create bad request error', () => {
      const error = errors.badRequest('Email is invalid');

      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('BAD_REQUEST');
      expect(error.message).toBe('Email is invalid');
    });

    it('should create unauthorized error', () => {
      const error = errors.unauthorized('User not authenticated');

      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('should create forbidden error', () => {
      const error = errors.forbidden('Access denied');

      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });

    it('should create not found error', () => {
      const error = errors.notFound('Course not found');

      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });

    it('should create conflict error', () => {
      const error = errors.conflict('Email already registered');

      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });

    it('should create unprocessable error', () => {
      const details = { field: 'grade', error: 'Must be between 0-100' };
      const error = errors.unprocessable('Invalid data', details);

      expect(error.statusCode).toBe(422);
      expect(error.code).toBe('UNPROCESSABLE_ENTITY');
      expect(error.details).toEqual(details);
    });

    it('should create internal error', () => {
      const error = errors.internalError('Database connection failed');

      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
    });

    it('should create database error', () => {
      const error = errors.databaseError('Query failed');

      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('DATABASE_ERROR');
    });

    it('should create authentication error', () => {
      const error = errors.authenticationError('Invalid credentials');

      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });
  });

  describe('error default messages', () => {
    it('should have default message for unauthorized', () => {
      const error = errors.unauthorized();

      expect(error.message).toBe('Unauthorized');
    });

    it('should have default message for forbidden', () => {
      const error = errors.forbidden();

      expect(error.message).toBe('Forbidden');
    });

    it('should have default message for not found', () => {
      const error = errors.notFound();

      expect(error.message).toBe('Not found');
    });

    it('should have default message for conflict', () => {
      const error = errors.conflict();

      expect(error.message).toBe('Resource already exists');
    });

    it('should have default message for internal error', () => {
      const error = errors.internalError();

      expect(error.message).toBe('Internal server error');
    });
  });
});
