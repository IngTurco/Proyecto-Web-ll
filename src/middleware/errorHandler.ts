import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('💥 Unhandled Error:', err);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
};
