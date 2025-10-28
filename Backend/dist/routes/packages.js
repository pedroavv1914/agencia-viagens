"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const TravelPackage_1 = require("../entity/TravelPackage");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const repo = () => data_source_1.AppDataSource.getRepository(TravelPackage_1.TravelPackage);
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
exports.default = router;
