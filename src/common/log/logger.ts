import pino from 'pino';

const defaultLogger = pino({
  level: process.env.LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
  messageKey: 'message',
  nestedKey: 'data',
  base: null,
  formatters: {
    level(label: string) {
      return { level: label };
    },
  },
});

export let logger = defaultLogger;

export const addContext = (context: any): void => {
  logger = defaultLogger.child({
    context: {
      env: process.env.ENV,
      ...context,
    },
  });
};

export const clearContext = (): void => {
  logger = defaultLogger;
};
