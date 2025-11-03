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
// Rate limit global moderado
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(globalLimiter);

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
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
app.get('/', (_req, res) => {
  res.send('Agencia Viagens API online');
});

// Routes
app.use('/auth', authRoutes);
app.use('/packages', packageRoutes);
app.use('/admin/users', adminUserRoutes);

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
    console.error('Erro ao iniciar API', err);
    process.exit(1);
  });