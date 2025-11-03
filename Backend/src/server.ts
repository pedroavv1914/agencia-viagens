import 'reflect-metadata';
import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
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
app.use(cors({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Static: serve uploaded images
const uploadsDir = path.resolve(process.cwd(), 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  console.warn('Falha ao garantir pasta uploads:', e);
}
app.use('/uploads', express.static(uploadsDir));

// Swagger
const swaggerDocument = YAML.load(__dirname + '/swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

ensureDatabaseExists()
  .then(() => AppDataSource.initialize())
  .then(() => {
    app.listen(port, () => {
      console.log(`API rodando na porta ${port}`);
      console.log(`Swagger: http://localhost:${port}/docs`);
    });
  })
  .catch((err) => {
    console.error('Erro ao iniciar API', err);
    process.exit(1);
  });