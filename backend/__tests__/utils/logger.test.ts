import { logger, LogLevel } from '@/utils/logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    logger.setLogLevel(LogLevel.DEBUG);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  describe('error', () => {
    it('should log error messages', () => {
      const message = 'An error occurred';
      logger.error(message);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      expect(loggedMessage).toContain(message);
      expect(loggedMessage).toContain('ERROR');
    });

    it('should log error with Error object', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should include context in error log', () => {
      const context = { userId: 'user1', service: 'auth' };
      logger.error('Error in auth service', undefined, context);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('user1');
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      const message = 'A warning message';
      logger.warn(message);

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedMessage = consoleWarnSpy.mock.calls[0][0];
      expect(loggedMessage).toContain(message);
      expect(loggedMessage).toContain('WARN');
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      const message = 'Info message';
      logger.info(message);

      expect(consoleLogSpy).toHaveBeenCalled();
      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain(message);
      expect(loggedMessage).toContain('INFO');
    });
  });

  describe('debug', () => {
    it('should log debug messages when level is DEBUG', () => {
      const message = 'Debug message';
      logger.setLogLevel(LogLevel.DEBUG);
      logger.debug(message);

      expect(consoleDebugSpy).toHaveBeenCalled();
      const loggedMessage = consoleDebugSpy.mock.calls[0][0];
      expect(loggedMessage).toContain(message);
    });

    it('should not log debug messages when level is INFO', () => {
      logger.setLogLevel(LogLevel.INFO);
      logger.debug('Debug message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });

  describe('logDbOperation', () => {
    it('should log database operations', () => {
      logger.logDbOperation('SELECT', 'profiles', 25);

      expect(consoleDebugSpy).toHaveBeenCalled();
      const loggedMessage = consoleDebugSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('DB: SELECT on profiles');
    });
  });

  describe('logRequest', () => {
    it('should log HTTP requests', () => {
      logger.logRequest('GET', '/api/courses', 'user123');

      expect(consoleLogSpy).toHaveBeenCalled();
      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('GET /api/courses');
    });
  });

  describe('logResponse', () => {
    it('should log HTTP responses', () => {
      logger.logResponse('GET', '/api/courses', 200, 42);

      expect(consoleLogSpy).toHaveBeenCalled();
      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('GET /api/courses → 200');
    });
  });

  describe('setLogLevel', () => {
    it('should change log level', () => {
      logger.setLogLevel(LogLevel.ERROR);
      logger.info('Info message'); // Should not log

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});
