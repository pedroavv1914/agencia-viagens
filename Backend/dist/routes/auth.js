"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@palazzo.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const USER_EMAIL = process.env.USER_EMAIL || 'user@palazzo.com';
const USER_PASSWORD = process.env.USER_PASSWORD || 'user123';
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    let role = null;
    let expectedPassword = '';
    if (email === ADMIN_EMAIL) {
        role = 'admin';
        expectedPassword = ADMIN_PASSWORD;
    }
    else if (email === USER_EMAIL) {
        role = 'user';
        expectedPassword = USER_PASSWORD;
    }
    if (!role) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const isHash = expectedPassword.startsWith('$2');
    const ok = isHash ? await bcryptjs_1.default.compare(password, expectedPassword) : password === expectedPassword;
    if (!ok) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = jsonwebtoken_1.default.sign({ email, role }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role });
});
exports.default = router;
