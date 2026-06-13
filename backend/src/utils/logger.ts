/**
 * Logger utility for structured logging across the application
 * Supports multiple log levels with timestamps and context
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

interface LogContext {
  userId?: string;
  requestId?: string;
  service?: string;
  [key: string]: any;
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;

  constructor(logLevel?: string) {
    if (logLevel) {
      this.logLevel = logLevel as LogLevel;
    }
  }

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  /**
   * Check if log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const errorDetails = error
      ? { error: error.message, stack: error.stack }
      : {};
    const fullContext = { ...context, ...errorDetails };

    console.error(this.formatMessage(LogLevel.ERROR, message, fullContext));
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.log(this.formatMessage(LogLevel.INFO, message, context));
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
  }

  /**
   * Log database operations
   */
  logDbOperation(
    operation: string,
    model: string,
    duration: number,
    context?: LogContext
  ): void {
    this.debug(`DB: ${operation} on ${model}`, {
      ...context,
      duration: `${duration}ms`,
    });
  }

  /**
   * Log API request
   */
  logRequest(
    method: string,
    path: string,
    userId?: string,
    context?: LogContext
  ): void {
    this.info(`${method} ${path}`, {
      ...context,
      userId,
    });
  }

  /**
   * Log API response
   */
  logResponse(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    this.info(`${method} ${path} → ${statusCode}`, {
      ...context,
      duration: `${duration}ms`,
    });
  }

  /**
   * Set log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

// Export singleton instance
export const logger = new Logger(process.env.LOG_LEVEL || 'INFO');
