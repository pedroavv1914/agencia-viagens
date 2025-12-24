import 'reflect-metadata';
import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const hpp = require('hpp');
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { ensureDatabaseExists } from './utils/db';
import authRoutes from './routes/auth';
import packageRoutes from './routes/packages';
import adminUserRoutes from './routes/adminUsers';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();

const app = express();
// Segurança básica de cabeçalhos
app.use(helmet());
// CORS restrito por origem configurável
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, allowedHeaders: ['Content-Type', 'Authorization'], credentials: true }));
// Proteção contra poluição de parâmetros
app.use(hpp());
// Limitar tamanho de JSON recebido
app.use(express.json({ limit: '1mb' }));

// Configuração parametrizável do rate-limit (padrões seguros)
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 min
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 100; // requisições por IP por window
const RATE_LIMIT_WHITELIST = (process.env.RATE_LIMIT_WHITELIST || '') // CSV de IPs que não entram no rate-limit
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Função para extrair IP confiável (leva em conta X-Forwarded-For)
function clientIp(req: any) {
  const xf = (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-forwarded'])) as string | undefined;
  if (xf) return xf.split(',')[0].trim();
  return req.ip || req.connection?.remoteAddress || 'unknown';
}

const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  keyGenerator: (req) => clientIp(req),
  // isenta health e permite whitelist por IP
  skip: (req) => {
    if (req.path === '/health') return true;
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
const uploadsDir = path.resolve(process.cwd(), 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  console.warn('Falha ao garantir pasta uploads:', e);
}
app.use('/uploads', express.static(uploadsDir, { dotfiles: 'deny', etag: true, maxAge: '1d' }));

// Swagger
const swaggerDocument = YAML.load(__dirname + '/swagger.yaml');
const swaggerEnabled = (process.env.SWAGGER_ENABLED ?? (process.env.NODE_ENV !== 'production' ? 'true' : 'false')) === 'true';
if (swaggerEnabled) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
app.use('/auth', authRoutes);
app.use('/packages', packageRoutes);
app.use('/admin/users', adminUserRoutes);

// Normaliza e valida DB_HOST antes da conexão com o DB
(() => {
  const rawHost = process.env.DB_HOST;
  if (!rawHost) {
    console.error('VARIÁVEL AUSENTE: DB_HOST não está definida. Configure as env vars do banco (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME).');
    // não interrompe aqui para permitir que o processo mostre erro detalhado de conexão, mas log já ajuda
  } else {
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
(shouldEnsureDb ? ensureDatabaseExists() : Promise.resolve())
  .then(() => AppDataSource.initialize())
  .then(() => {
    app.listen(port, () => {
      console.log(`API rodando na porta ${port}`);
      if (swaggerEnabled) console.log(`Swagger: http://localhost:${port}/docs`);
    });
  })
  .catch((err) => {
    console.error('Erro ao iniciar API:', err && err.message ? err.message : err);
    if (err && err.code === 'ENOTFOUND') {
      console.error('ENOTFOUND: verifique DB_HOST/DB_PORT e se o hostname está correto (ex: nome.postgres.render.com).');
    }
    process.exit(1);
  });