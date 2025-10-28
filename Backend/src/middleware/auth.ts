import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type Role = 'admin' | 'user';

declare global {
  namespace Express {
    interface Request {
      user?: { email: string; role: Role };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token ausente' });
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string; role: Role };
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ message: 'Não autenticado' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Sem permissão' });
  next();
}