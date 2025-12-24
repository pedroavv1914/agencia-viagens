"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const TravelPackage_1 = require("./entity/TravelPackage");
const User_1 = require("./entity/User");
dotenv_1.default.config();
function inferDatabaseUrl() {
    const fromDatabaseUrl = process.env.DATABASE_URL?.trim();
    if (fromDatabaseUrl)
        return fromDatabaseUrl;
    const fromDbHost = process.env.DB_HOST?.trim();
    if (!fromDbHost)
        return undefined;
    if (fromDbHost.startsWith('postgres://') || fromDbHost.startsWith('postgresql://'))
        return fromDbHost;
    try {
        const parsed = new URL(fromDbHost);
        if (parsed.protocol === 'postgres:' || parsed.protocol === 'postgresql:')
            return fromDbHost;
        return undefined;
    }
    catch {
        return undefined;
    }
}
const databaseUrl = inferDatabaseUrl();
function shouldUseSsl(url) {
    if (process.env.DB_SSL === 'true')
        return true;
    if (process.env.DB_SSL === 'false')
        return false;
    try {
        const parsed = new URL(url);
        const sslmode = parsed.searchParams.get('sslmode');
        const ssl = parsed.searchParams.get('ssl');
        if (sslmode && sslmode !== 'disable')
            return true;
        if (ssl === 'true' || ssl === '1')
            return true;
        return false;
    }
    catch {
        return false;
    }
}
exports.AppDataSource = new typeorm_1.DataSource({
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
            host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
            port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432', 10),
            username: process.env.DB_USER || process.env.PGUSER || 'postgres',
            password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'postgres',
            database: process.env.DB_NAME || process.env.PGDATABASE || 'agencia_viagens',
        }),
    synchronize: true,
    logging: false,
    entities: [TravelPackage_1.TravelPackage, User_1.User],
});
