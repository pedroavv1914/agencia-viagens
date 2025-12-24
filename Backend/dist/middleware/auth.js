"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
exports.requireMaster = requireMaster;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt';
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: 'Token ausente' });
    const token = authHeader.replace('Bearer ', '');
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ message: 'Token inválido' });
    }
}
function requireAdmin(req, res, next) {
    if (!req.user)
        return res.status(401).json({ message: 'Não autenticado' });
    // Master também tem privilégios administrativos para pacotes
    if (req.user.role !== 'admin' && req.user.role !== 'master') {
        return res.status(403).json({ message: 'Sem permissão' });
    }
    next();
}
function requireMaster(req, res, next) {
    if (!req.user)
        return res.status(401).json({ message: 'Não autenticado' });
    if (req.user.role !== 'master')
        return res.status(403).json({ message: 'Sem permissão (master necessário)' });
    next();
}
