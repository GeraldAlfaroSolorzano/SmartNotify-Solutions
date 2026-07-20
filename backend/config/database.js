import "dotenv/config";

import mysql from "mysql2/promise";

const variablesBaseDatos = [
    "DB_HOST",
    "DB_PORT",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME"
];

for (const variable of variablesBaseDatos) {
    if (!process.env[variable]) {
        throw new Error(
            `Falta la variable de entorno ${variable}.`
        );
    }
}

const puertoBaseDatos = Number(process.env.DB_PORT);

if (!Number.isInteger(puertoBaseDatos)) {
    throw new Error("DB_PORT debe ser un numero entero.");
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: puertoBaseDatos,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function probarConexion() {
    let conexion;

    try {
        conexion = await pool.getConnection();

        console.log("Conexion con MySQL establecida");
    } catch (error) {
        console.error("No fue posible conectar con MySQL");
        console.error(error.message);

        throw error;
    } finally {
        if (conexion) {
            conexion.release();
        }
    }
}

export default pool;
