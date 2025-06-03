"use strict";
import express from "express";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import router from "./router";
import db from "./config/db";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

// Conexión a la base de datos
export async function ConnectionDB() {
  try {
    await db.authenticate();
    await db.sync();
    console.log(colors.bgMagenta("✅ Conexión exitosa a la Base de Datos"));
  } catch (error) {
    console.error(colors.bgRed.white("❌ Error al conectar a la Base de Datos"), error);
  }
}
ConnectionDB();

const server = express();

// Configuración segura de CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "";

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === FRONTEND_URL) {
      callback(null, true);
    } else {
      console.log(`❌ CORS bloqueado para origen: ${origin}`);
      callback(new Error("No autorizado por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

server.use(cors(corsOptions));

// Middlewares
server.use(express.json());
server.use(morgan("dev"));

// Rutas
server.use("/api/products", router);
server.get("/api", (req, res) => {
  res.json({ msg: "Desde API" });
});

// Documentación Swagger
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default server;
