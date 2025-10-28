import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@palazzo.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const USER_EMAIL = process.env.USER_EMAIL || 'user@palazzo.com';
const USER_PASSWORD = process.env.USER_PASSWORD || 'user123';

router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  let role: 'admin' | 'user' | null = null;
  let expectedPassword = '';

  if (email === ADMIN_EMAIL) {
    role = 'admin';
    expectedPassword = ADMIN_PASSWORD;
  } else if (email === USER_EMAIL) {
    role = 'user';
    expectedPassword = USER_PASSWORD;
  }

  if (!role) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const isHash = expectedPassword.startsWith('$2');
  const ok = isHash ? await bcrypt.compare(password, expectedPassword) : password === expectedPassword;
  if (!ok) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '1d' });
  return res.json({ token, role });
});

export default router;