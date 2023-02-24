import { isHttpError } from 'http-errors';
import { NextApiResponse } from 'next';

export const catchHttpError = (err: unknown, res: NextApiResponse) => {
  if (isHttpError(err)) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
};
