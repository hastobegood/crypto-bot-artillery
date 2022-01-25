import { addContext, clearContext, logger } from '../log/logger.js';

export const handleEvent = async <T>(context: any, handle: () => Promise<T>): Promise<T> => {
  addContext({
    lambdaName: context.functionName,
    lambdaVersion: context.functionVersion,
    awsRequestId: context.awsRequestId,
  });

  try {
    logger.info('Processing event');
    const result = await handle();
    logger.info('Event processed');
    return result;
  } catch (e) {
    logger.child({ err: e }).error('Unable to process event');
    throw e;
  } finally {
    clearContext();
  }
};
