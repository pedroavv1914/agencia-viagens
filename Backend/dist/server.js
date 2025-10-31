"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
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
app.use((0, cors_1.default)({ origin: '*', allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express_1.default.json());
// Swagger
const swaggerDocument = yamljs_1.default.load(__dirname + '/swagger.yaml');
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Routes
app.use('/auth', auth_1.default);
app.use('/packages', packages_1.default);
app.use('/admin/users', adminUsers_1.default);
const port = parseInt(process.env.PORT || '3000', 10);
(0, db_1.ensureDatabaseExists)()
    .then(() => data_source_1.AppDataSource.initialize())
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
