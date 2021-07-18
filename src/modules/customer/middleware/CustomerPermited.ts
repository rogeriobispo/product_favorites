import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import AppError from '@shared/errors/AppErrors';

export default async function customerPermited(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id: customerId } = req.currentUser;
  const { id } = req.params;
  if (customerId !== id)
    throw new AppError('CustomerId differ of logged customer', 403);

  return next();
}
