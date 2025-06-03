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

// Conectar a la base de datos
async function ConnectionDB() {
    try {
        await db_1.default.authenticate();
        db_1.default.sync();
        console.log(colors_1.default.bgMagenta("Conexión exitosa a la Base de Datos"));
    } catch (error) {
        console.log(colors_1.default.bgRed.white("Hubo un error al conectar a la Base de Datos"));
    }
}
ConnectionDB();

// Instancia de express
const server = (0, express_1.default)();

// 🌐 Configuración de CORS
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            "https://rest-apis-router.vercel.app", // ✅ Tu frontend en producción
            "http://localhost:3000" // ⚙️ Opción para desarrollo local si lo necesitas
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`❌ Bloqueo de CORS para el origen: ${origin}`);
            callback(new Error("Error de CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

server.use((0, cors_1.default)(corsOptions));

// Middleware para manejar errores de CORS
server.use((err, req, res, next) => {
    if (err instanceof Error && err.message === "Error de CORS") {
        return res.status(403).json({ error: "Acceso denegado por política de CORS" });
    }
    next();
});

// Middleware para leer JSON
server.use(express_1.default.json());

// Logger de peticiones HTTP
server.use((0, morgan_1.default)("combined"));

// Rutas principales
server.use("/api/products", router_1.default);

server.get("/api", (req, res) => {
    res.json({ msg: "Desde API" });
});

// Documentación Swagger
server.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));

// Exportar servidor
exports.default = server;
