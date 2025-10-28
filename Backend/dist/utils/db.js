"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDatabaseExists = ensureDatabaseExists;
const pg_1 = require("pg");
async function ensureDatabaseExists() {
    const dbName = process.env.DB_NAME || 'agencia_viagens';
    const client = new pg_1.Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: 'postgres',
    });
    await client.connect();
    const existsRes = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (existsRes.rowCount === 0) {
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database ${dbName} criado.`);
    }
    await client.end();
}
