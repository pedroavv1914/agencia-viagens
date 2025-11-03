import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../data-source';
import { TravelPackage } from '../entity/TravelPackage';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();
const repo = () => AppDataSource.getRepository(TravelPackage);

// Listagem agora privada: requer autenticação
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

// Upload de imagem (JSON base64) - retorna URL pública
router.post('/upload', requireAuth, requireAdmin, async (req, res) => {
  const { filename, data } = req.body as { filename?: string; data?: string };
  if (!filename || !data) {
    return res.status(400).json({ message: 'filename e data são obrigatórios' });
  }

  // Aceita data URL (ex: data:image/png;base64,...) ou base64 puro
  const commaIdx = data.indexOf(',');
  const base64 = commaIdx >= 0 ? data.slice(commaIdx + 1) : data;

  const safeName = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const ext = path.extname(safeName) || '.png';
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  const filePath = path.join(uploadsDir, unique);

  try {
    await fs.promises.writeFile(filePath, Buffer.from(base64, 'base64'));
  } catch (e) {
    return res.status(500).json({ message: 'Falha ao salvar arquivo', error: String(e) });
  }

  const publicUrl = `/uploads/${unique}`;
  return res.status(201).json({ url: publicUrl });
});

export default router;