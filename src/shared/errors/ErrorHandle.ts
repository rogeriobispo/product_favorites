import { Request, Response, NextFunction } from 'express';

import AppError from './AppErrors';

const ErrorHandler = function ErrorHandler(
  err: Error,
  req: Request,
  response: Response,
  _: NextFunction,
): Response {
  if (err instanceof AppError)
    return response.status(err.statusCode).json({
      message: err.message,
    });

  if (err instanceof SyntaxError && 'body' in err) {
    return response.status(422).json({
      message: 'Body parse failed',
    });
  }

  return response.status(500).json({
    message: 'Internal Server Error',
  });
};

export default ErrorHandler;
