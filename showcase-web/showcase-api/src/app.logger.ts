import { LoggerService } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';

import { config } from '../config';

export class AppLogger implements LoggerService {
  private logger: Logger;

  constructor(label?: string) {
    const fileFormat = format.combine(
      format.timestamp(),
      format.align(),
      format.printf((info) => {
        const {
          timestamp, level, message, ...args
        } = info;

        return `${timestamp} [${label}] ${level.toUpperCase()}: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
      }),
    );

    // Separate file and console format - colorized gets ASCII symbols into the file
    const consoleFormat = format.combine(
      format.colorize({
        message: true,
        colors: { info: 'green', error: 'red' },
      }),
      fileFormat,
    );

    this.logger = createLogger({
      level: config.logger.level,
      transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new transports.File({
          level: 'error',
          filename: 'logs/error.log',
          format: fileFormat,
        }),
        new transports.File({
          level: 'info',
          filename: 'logs/combined.log',
          format: fileFormat,
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new transports.Console({
        format: consoleFormat,
      }));
    }
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  log(message: string) {
    this.logger.info(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  silly(message: string) {
    this.logger.silly(message);
  }
}
