import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

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

  // Tenta credenciais de ambiente (admin/user demo)
  if (role) {
    const isHash = expectedPassword.startsWith('$2');
    const ok = isHash ? await bcrypt.compare(password, expectedPassword) : password === expectedPassword;
    if (!ok) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role });
  }

  // Senão, tenta autenticar usuário do banco
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });
  const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  return res.json({ token, role: user.role });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }
  const userRepo = AppDataSource.getRepository(User);
  const existing = await userRepo.findOne({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email já cadastrado' });
  const passwordHash = await bcrypt.hash(password, 10);
  const created = userRepo.create({ email, passwordHash, role: 'user' });
  const saved = await userRepo.save(created);
  const token = jwt.sign({ email: saved.email, role: saved.role }, JWT_SECRET, { expiresIn: '1d' });
  return res.status(201).json({ token, role: saved.role });
});

export default router;