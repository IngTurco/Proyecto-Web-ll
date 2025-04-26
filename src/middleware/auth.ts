import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cambiame';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ ok: false, error: 'No token' });
    return;
  }

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      uid: string;
      email: string;
      iat?: number;
      exp?: number;
    };

    console.log('🔍 Token payload:', payload);
    // Asignamos exactamente lo que firmamos en login:
    req.user = { id: payload.uid, email: payload.email };
    return next();
  } catch (err) {
    res.status(401).json({ ok: false, error: 'Token inválido' });
    return;
  }
};