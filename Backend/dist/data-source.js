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
dotenv_1.default.config();
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '5432', 10);
const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'postgres';
const database = process.env.DB_NAME || 'agencia_viagens';
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    synchronize: true,
    logging: false,
    entities: [TravelPackage_1.TravelPackage],
});
