import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();
const repo = () => AppDataSource.getRepository(User);

// Lista usuários (somente admin)
router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  const users = await repo().find({ select: { id: true, email: true, role: true } });
  return res.json(users);
});

// Atualiza role de um usuário (somente admin)
router.patch('/:id/role', requireAuth, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { role } = req.body as { role?: 'admin' | 'user' };
  if (role !== 'admin' && role !== 'user') {
    return res.status(400).json({ message: 'Role inválido' });
  }
  const user = await repo().findOne({ where: { id } });
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  user.role = role;
  const saved = await repo().save(user);
  return res.json({ id: saved.id, email: saved.email, role: saved.role });
});

export default router;