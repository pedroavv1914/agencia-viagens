import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { TravelPackage } from './entity/TravelPackage';
import { User } from './entity/User';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

function shouldUseSsl(url: string) {
  if (process.env.DB_SSL === 'true') return true;
  if (process.env.DB_SSL === 'false') return false;
  try {
    const parsed = new URL(url);
    const sslmode = parsed.searchParams.get('sslmode');
    const ssl = parsed.searchParams.get('ssl');
    if (sslmode && sslmode !== 'disable') return true;
    if (ssl === 'true' || ssl === '1') return true;
    return false;
  } catch {
    return false;
  }
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(databaseUrl
    ? {
        url: databaseUrl,
        ...(shouldUseSsl(databaseUrl)
          ? {
              ssl: { rejectUnauthorized: false },
              extra: { ssl: { rejectUnauthorized: false } },
            }
          : {}),
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'agencia_viagens',
      }),
  synchronize: true,
  logging: false,
  entities: [TravelPackage, User],
});
