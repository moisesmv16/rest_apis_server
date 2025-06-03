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
    }
    catch (error) {
        console.log(colors_1.default.bgRed.white("Hubo un error al conectar a la Base de Datos"));
    }
}
ConnectionDB();
// Instancia de express
const server = (0, express_1.default)();
// Configuración de CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Si origin es undefined (ej. solicitudes de la misma máquina), permite
        if (!origin || origin === process.env.FRONTEND_URL) {
            callback(null, true);
        }
        else {
            console.log(`Bloqueo de CORS para el origen: ${origin}`);
            callback(new Error("Error de CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // Encabezados permitidos
};
server.use((0, cors_1.default)(corsOptions));
// Leer datos de formularios
server.use(express_1.default.json());
// Logger HTTP
server.use((0, morgan_1.default)("combined"));
// Rutas principales
server.use("/api/products", router_1.default);
server.get("/api", (req, res) => {
    res.json({ msg: "Desde API" });
});
// Documentación con Swagger
server.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
exports.default = server;
//# sourceMappingURL=server.js.map
