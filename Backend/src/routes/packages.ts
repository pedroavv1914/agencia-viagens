import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { TravelPackage } from '../entity/TravelPackage';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();
const repo = () => AppDataSource.getRepository(TravelPackage);

router.get('/', requireAuth, async (req, res) => {
  const { tipo } = req.query as { tipo?: string };
  const whereOpt = tipo ? { tipo: tipo as any } : undefined;
  const items = await repo().find({ where: whereOpt });
  return res.json(items);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const body = req.body as Partial<TravelPackage>;
  const created = repo().create(body);
  const saved = await repo().save(created);
  return res.status(201).json(saved);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = req.body as Partial<TravelPackage>;
  const existing = await repo().findOne({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Pacote não encontrado' });
  const merged = Object.assign(existing, body);
  const saved = await repo().save(merged);
  return res.json(saved);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = await repo().findOne({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Pacote não encontrado' });
  await repo().remove(existing);
  return res.status(204).send();
});

export default router;