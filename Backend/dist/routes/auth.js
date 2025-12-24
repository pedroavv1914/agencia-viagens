"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Rate limit específico para login
const loginLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 20 });
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@palazzo.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const USER_EMAIL = process.env.USER_EMAIL || 'user@palazzo.com';
const USER_PASSWORD = process.env.USER_PASSWORD || 'user123';
const MASTER_EMAIL = process.env.MASTER_EMAIL || 'master@palazzo.com';
const MASTER_PASSWORD = process.env.MASTER_PASSWORD || 'master123';
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    let role = null;
    let expectedPassword = '';
    if (email === MASTER_EMAIL) {
        role = 'master';
        expectedPassword = MASTER_PASSWORD;
    }
    else if (email === ADMIN_EMAIL) {
        role = 'admin';
        expectedPassword = ADMIN_PASSWORD;
    }
    else if (email === USER_EMAIL) {
        role = 'user';
        expectedPassword = USER_PASSWORD;
    }
    // Tenta credenciais de ambiente (admin/user demo)
    if (role) {
        const isHash = expectedPassword.startsWith('$2');
        const ok = isHash ? await bcryptjs_1.default.compare(password, expectedPassword) : password === expectedPassword;
        if (!ok) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ email, role }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, role });
    }
    // Senão, tenta autenticar usuário do banco
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const user = await userRepo.findOne({ where: { email } });
    if (!user)
        return res.status(401).json({ message: 'Credenciais inválidas' });
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ message: 'Credenciais inválidas' });
    // Override: MASTER_EMAIL sempre recebe role master, mesmo se existir no banco
    const finalRole = email === MASTER_EMAIL ? 'master' : user.role;
    const token = jsonwebtoken_1.default.sign({ email, role: finalRole }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role: finalRole });
});
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const existing = await userRepo.findOne({ where: { email } });
    if (existing)
        return res.status(409).json({ message: 'Email já cadastrado' });
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const created = userRepo.create({ email, passwordHash, role: 'user' });
    const saved = await userRepo.save(created);
    const token = jsonwebtoken_1.default.sign({ email: saved.email, role: saved.role }, JWT_SECRET, { expiresIn: '1d' });
    return res.status(201).json({ token, role: saved.role });
});
router.get('/me', auth_1.requireAuth, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
    }
    const { email, role } = req.user;
    return res.json({ email, role });
});
// Reemite um token sincronizando a role atual do usuário no banco
router.post('/refresh', auth_1.requireAuth, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado' });
    }
    const { email } = req.user;
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    // Override: MASTER_EMAIL sempre recebe role master
    if (email === MASTER_EMAIL) {
        const token = jsonwebtoken_1.default.sign({ email, role: 'master' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, role: 'master' });
    }
    const user = await userRepo.findOne({ where: { email } });
    // Se o usuário existe no banco, emite token com a role atual
    if (user) {
        const token = jsonwebtoken_1.default.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, role: user.role });
    }
    // Fallback para contas de ambiente
    if (email === MASTER_EMAIL) {
        const token = jsonwebtoken_1.default.sign({ email, role: 'master' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, role: 'master' });
    }
    if (email === ADMIN_EMAIL) {
        const token = jsonwebtoken_1.default.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, role: 'admin' });
    }
    if (email === USER_EMAIL) {
        const token = jsonwebtoken_1.default.sign({ email, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, role: 'user' });
    }
    return res.status(404).json({ message: 'Usuário não encontrado' });
});
exports.default = router;
