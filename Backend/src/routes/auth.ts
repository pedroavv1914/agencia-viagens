import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Rate limit específico para login
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@palazzo.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const USER_EMAIL = process.env.USER_EMAIL || 'user@palazzo.com';
const USER_PASSWORD = process.env.USER_PASSWORD || 'user123';
const MASTER_EMAIL = process.env.MASTER_EMAIL || 'master@palazzo.com';
const MASTER_PASSWORD = process.env.MASTER_PASSWORD || 'master123';

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  let role: 'admin' | 'user' | 'master' | null = null;
  let expectedPassword = '';

  if (email === MASTER_EMAIL) {
    role = 'master';
    expectedPassword = MASTER_PASSWORD;
  } else if (email === ADMIN_EMAIL) {
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
  // Override: MASTER_EMAIL sempre recebe role master, mesmo se existir no banco
  const finalRole: 'admin' | 'user' | 'master' = email === MASTER_EMAIL ? 'master' : user.role;
  const token = jwt.sign({ email, role: finalRole }, JWT_SECRET, { expiresIn: '1d' });
  return res.json({ token, role: finalRole });
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

router.get('/me', requireAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  
  const { email, role } = req.user;
  return res.json({ email, role });
});

// Reemite um token sincronizando a role atual do usuário no banco
router.post('/refresh', requireAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  const { email } = req.user;
  const userRepo = AppDataSource.getRepository(User);
  // Override: MASTER_EMAIL sempre recebe role master
  if (email === MASTER_EMAIL) {
    const token = jwt.sign({ email, role: 'master' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role: 'master' });
  }
  const user = await userRepo.findOne({ where: { email } });

  // Se o usuário existe no banco, emite token com a role atual
  if (user) {
    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role: user.role });
  }

  // Fallback para contas de ambiente
  if (email === MASTER_EMAIL) {
    const token = jwt.sign({ email, role: 'master' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role: 'master' });
  }
  if (email === ADMIN_EMAIL) {
    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role: 'admin' });
  }
  if (email === USER_EMAIL) {
    const token = jwt.sign({ email, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role: 'user' });
  }

  return res.status(404).json({ message: 'Usuário não encontrado' });
});

export default router;