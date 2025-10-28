import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { TravelPackage } from './entity/TravelPackage';

dotenv.config();

const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432', 10);
const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';
const database = process.env.DB_NAME || 'agencia_viagens';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  synchronize: true,
  logging: false,
  entities: [TravelPackage],
});