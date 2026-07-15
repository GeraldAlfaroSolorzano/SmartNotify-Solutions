import pool from "../config/database.js";

export async function crearSolicitud(datos) {
    const consulta = `
        INSERT INTO solicitudes (
            nombreCliente,
            correo,
            asunto,
            descripcion
        )
        VALUES (?, ?, ?, ?)
    `;

    const valores = [
        datos.nombreCliente.trim(),
        datos.correo.trim(),
        datos.asunto.trim(),
        datos.descripcion.trim()
    ];

    const [resultado] = await pool.execute(
        consulta,
        valores
    );

    return obtenerSolicitudPorId(resultado.insertId);
}

export async function obtenerSolicitudPorId(id) {
    const consulta = `
        SELECT
            id,
            nombreCliente,
            correo,
            asunto,
            descripcion,
            estado,
            fechaCreacion,
            fechaActualizacion
        FROM solicitudes
        WHERE id = ?
    `;

    const [solicitudes] = await pool.execute(
        consulta,
        [id]
    );

    if (solicitudes.length === 0) {
        return null;
    }

    return solicitudes[0];
}

export async function obtenerSolicitudes() {
    const consulta = `
        SELECT
            id,
            nombreCliente,
            correo,
            asunto,
            descripcion,
            estado,
            fechaCreacion,
            fechaActualizacion
        FROM solicitudes
        ORDER BY fechaCreacion DESC
    `;

    const [solicitudes] = await pool.query(consulta);

    return solicitudes;
}