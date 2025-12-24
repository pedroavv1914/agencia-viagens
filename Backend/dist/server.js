"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const hpp = require('hpp');
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("./data-source");
const db_1 = require("./utils/db");
const auth_1 = __importDefault(require("./routes/auth"));
const packages_1 = __importDefault(require("./routes/packages"));
const adminUsers_1 = __importDefault(require("./routes/adminUsers"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Segurança básica de cabeçalhos
app.use((0, helmet_1.default)());
// CORS restrito por origem configurável
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use((0, cors_1.default)({ origin: corsOrigin, allowedHeaders: ['Content-Type', 'Authorization'], credentials: true }));
// Proteção contra poluição de parâmetros
app.use(hpp());
// Limitar tamanho de JSON recebido
app.use(express_1.default.json({ limit: '1mb' }));
// Configuração parametrizável do rate-limit (padrões seguros)
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 min
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 100; // requisições por IP por window
const RATE_LIMIT_WHITELIST = (process.env.RATE_LIMIT_WHITELIST || '') // CSV de IPs que não entram no rate-limit
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
// Função para extrair IP confiável (leva em conta X-Forwarded-For)
function clientIp(req) {
    const xf = (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-forwarded']));
    if (xf)
        return xf.split(',')[0].trim();
    return req.ip || req.connection?.remoteAddress || 'unknown';
}
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
    keyGenerator: (req) => clientIp(req),
    // isenta health e permite whitelist por IP
    skip: (req) => {
        if (req.path === '/health')
            return true;
        const ip = clientIp(req);
        return RATE_LIMIT_WHITELIST.includes(ip);
    },
    handler: (req, res /*, next */) => {
        const ip = clientIp(req);
        const retryAfterSec = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);
        // informa Retry-After e resposta JSON padrão; também loga origem
        res.setHeader('Retry-After', String(retryAfterSec));
        console.warn(`[rate-limit] 429 - ${req.method} ${req.originalUrl} - ip=${ip}`);
        res.status(429).json({ message: 'Too many requests', retryAfter: retryAfterSec });
    },
});
// Rate limit global moderado
app.use(apiLimiter);
// Static: serve uploaded images
const uploadsDir = path_1.default.resolve(process.cwd(), 'uploads');
try {
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
}
catch (e) {
    console.warn('Falha ao garantir pasta uploads:', e);
}
app.use('/uploads', express_1.default.static(uploadsDir, { dotfiles: 'deny', etag: true, maxAge: '1d' }));
// Swagger
const swaggerDocument = yamljs_1.default.load(__dirname + '/swagger.yaml');
const swaggerEnabled = (process.env.SWAGGER_ENABLED ?? (process.env.NODE_ENV !== 'production' ? 'true' : 'false')) === 'true';
if (swaggerEnabled) {
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
}
// Healthcheck e raiz
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});
app.get('/', (_req, res) => {
    res.send('Agencia Viagens API online');
});
// Routes
app.use('/auth', auth_1.default);
app.use('/packages', packages_1.default);
app.use('/admin/users', adminUsers_1.default);
// Normaliza e valida configuração de banco antes da conexão
(() => {
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (databaseUrl)
        return;
    const dbHostAsUrl = process.env.DB_HOST?.trim();
    if (dbHostAsUrl) {
        if (dbHostAsUrl.startsWith('postgres://') || dbHostAsUrl.startsWith('postgresql://'))
            return;
        try {
            const parsed = new URL(dbHostAsUrl);
            if (parsed.protocol === 'postgres:' || parsed.protocol === 'postgresql:')
                return;
        }
        catch { }
    }
    const rawHost = process.env.DB_HOST;
    if (!rawHost) {
        console.error('VARIÁVEL AUSENTE: configure DATABASE_URL (Railway) ou DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME.');
        // não interrompe aqui para permitir que o processo mostre erro detalhado de conexão, mas log já ajuda
    }
    else {
        // Caso comum no Render: recebem apenas o id tipo "dpg-xxxx" — adiciona sufixo se necessário
        const renderIdPattern = /^dpg-[a-z0-9-]+$/i;
        if (renderIdPattern.test(rawHost) && !rawHost.includes('.')) {
            const guessed = `${rawHost}.postgres.render.com`;
            console.warn(`DB_HOST parece incompleto ('${rawHost}'). Ajustando automaticamente para '${guessed}'.`);
            process.env.DB_HOST = guessed;
        }
    }
})();
const port = parseInt(process.env.PORT || '3000', 10);
// Em produção, pula ensureDatabaseExists
const shouldEnsureDb = process.env.NODE_ENV !== 'production';
(shouldEnsureDb ? (0, db_1.ensureDatabaseExists)() : Promise.resolve())
    .then(() => data_source_1.AppDataSource.initialize())
    .then(() => {
    app.listen(port, () => {
        console.log(`API rodando na porta ${port}`);
        if (swaggerEnabled)
            console.log(`Swagger: http://localhost:${port}/docs`);
    });
})
    .catch((err) => {
    console.error('Erro ao iniciar API:', err && err.message ? err.message : err);
    if (err && err.code === 'ENOTFOUND') {
        console.error('ENOTFOUND: verifique DB_HOST/DB_PORT e se o hostname está correto (ex: nome.postgres.render.com).');
    }
    process.exit(1);
});
