"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const data_source_1 = require("../data-source");
const TravelPackage_1 = require("../entity/TravelPackage");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const repo = () => data_source_1.AppDataSource.getRepository(TravelPackage_1.TravelPackage);
// Listagem agora privada: requer autenticação
router.get('/', auth_1.requireAuth, async (req, res) => {
    const { tipo } = req.query;
    const whereOpt = tipo ? { tipo: tipo } : undefined;
    const items = await repo().find({ where: whereOpt });
    return res.json(items);
});
router.post('/', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    const body = req.body;
    const created = repo().create(body);
    const saved = await repo().save(created);
    return res.status(201).json(saved);
});
router.put('/:id', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const body = req.body;
    const existing = await repo().findOne({ where: { id } });
    if (!existing)
        return res.status(404).json({ message: 'Pacote não encontrado' });
    const merged = Object.assign(existing, body);
    const saved = await repo().save(merged);
    return res.json(saved);
});
router.delete('/:id', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const existing = await repo().findOne({ where: { id } });
    if (!existing)
        return res.status(404).json({ message: 'Pacote não encontrado' });
    await repo().remove(existing);
    return res.status(204).send();
});
// Upload de imagem (JSON base64) - retorna URL pública
router.post('/upload', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    const { filename, data } = req.body;
    if (!filename || !data) {
        return res.status(400).json({ message: 'filename e data são obrigatórios' });
    }
    // Aceita data URL (ex: data:image/png;base64,...) ou base64 puro
    const commaIdx = data.indexOf(',');
    const base64 = commaIdx >= 0 ? data.slice(commaIdx + 1) : data;
    const safeName = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const ext = path_1.default.extname(safeName) || '.png';
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const uploadsDir = path_1.default.resolve(process.cwd(), 'uploads');
    const filePath = path_1.default.join(uploadsDir, unique);
    try {
        await fs_1.default.promises.writeFile(filePath, Buffer.from(base64, 'base64'));
    }
    catch (e) {
        return res.status(500).json({ message: 'Falha ao salvar arquivo', error: String(e) });
    }
    const publicUrl = `/uploads/${unique}`;
    return res.status(201).json({ url: publicUrl });
});
exports.default = router;
