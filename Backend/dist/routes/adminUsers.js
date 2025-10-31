"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const repo = () => data_source_1.AppDataSource.getRepository(User_1.User);
// Lista usuários (somente admin)
router.get('/', auth_1.requireAuth, auth_1.requireAdmin, async (_req, res) => {
    const users = await repo().find({ select: { id: true, email: true, role: true } });
    return res.json(users);
});
// Atualiza role de um usuário (somente admin)
router.patch('/:id/role', auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { role } = req.body;
    if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({ message: 'Role inválido' });
    }
    const user = await repo().findOne({ where: { id } });
    if (!user)
        return res.status(404).json({ message: 'Usuário não encontrado' });
    user.role = role;
    const saved = await repo().save(user);
    return res.json({ id: saved.id, email: saved.email, role: saved.role });
});
exports.default = router;
