"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionDB = ConnectionDB;

const express_1 = __importDefault(require("express"));
const colors_1 = __importDefault(require("colors"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const router_1 = __importDefault(require("./router"));
const db_1 = __importDefault(require("./config/db"));
require("dotenv").config(); // Cargar variables de entorno

// Conexión a la base de datos
async function ConnectionDB() {
    try {
        await db_1.default.authenticate();
        db_1.default.sync();
        console.log(colors_1.default.bgMagenta("✅ Conexión exitosa a la Base de Datos"));
    } catch (error) {
        console.log(colors_1.default.bgRed.white("❌ Error al conectar a la Base de Datos"));
    }
}
ConnectionDB();

// Instancia de Express
const server = (0, express_1.default)();

// Configuración de CORS segura
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigin = process.env.FRONTEND_URL;

        if (!origin || origin === allowedOrigin) {
            callback(null, true);
        } else {
            console.log(`❌ CORS bloqueado para origen: ${origin}`);
            callback(new Error("No autorizado por CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// Activar CORS con opciones personalizadas
server.use((0, cors_1.default)(corsOptions));

// Middlewares
server.use(express_1.default.json());
server.use((0, morgan_1.default)("dev"));

// Rutas
server.use("/api/products", router_1.default);
server.get("/api", (req, res) => {
    res.json({ msg: "Desde API" });
});

// Documentación Swagger
server.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));

exports.default = server;
