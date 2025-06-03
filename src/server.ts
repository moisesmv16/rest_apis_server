import express from "express";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import swaggerSetup from "./config/swagger";
import router from "./router";
import db from "./config/db";

// Conexión a la base de datos
export async function ConnectionDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.bgMagenta("✅ Conexión exitosa a la Base de Datos"));
  } catch (error) {
    console.log(colors.bgRed.white("❌ Error al conectar a la Base de Datos"));
  }
}

ConnectionDB();

// Instancia de express
const server = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  "https://rest-apis-router.vercel.app",
  "http://localhost:3000", // para pruebas locales
];

// Configuración de CORS
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS bloqueado para origen: ${origin}`);
      callback(new Error("No autorizado por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
server.use(cors(corsOptions));
server.use(express.json());
server.use(morgan("combined"));

// Rutas
server.use("/api/products", router);
server.get("/api", (req, res) => {
  res.json({ msg: "✅ Desde API" });
});

// Documentación Swagger
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup));

// Exportar el servidor para usarlo en index.ts
export default server;
