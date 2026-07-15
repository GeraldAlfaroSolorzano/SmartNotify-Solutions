import "dotenv/config";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function probarConexion() {
    let connection;

    try {
        connection = await pool.getConnection();

        console.log("Conexion con MySQL establecida");
    } catch (error) {
        console.error("No fue posible conectar con MySQL");
        console.error(error.message);

        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export default pool;