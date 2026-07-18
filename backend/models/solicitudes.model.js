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
    datos.nombreCliente,
    datos.correo,
    datos.asunto,
    datos.descripcion,
  ];

  const [resultado] = await pool.execute(consulta, valores);

  return obtenerSolicitudPorId(resultado.insertId);
}

export async function obtenerSolicitudes() {
  const consulta = `
        SELECT
            id,
            nombreCliente,
            correo,
            asunto,
            descripcion,
            informacionAdicional,
            estado,
            solucionConfirmada,
            fechaCreacion,
            fechaActualizacion
        FROM solicitudes
        ORDER BY fechaCreacion DESC
    `;

  const [solicitudes] = await pool.query(consulta);

  return solicitudes;
}

export async function obtenerSolicitudPorId(id) {
  const consulta = `
        SELECT
            id,
            nombreCliente,
            correo,
            asunto,
            descripcion,
            informacionAdicional,
            estado,
            solucionConfirmada,
            fechaCreacion,
            fechaActualizacion
        FROM solicitudes
        WHERE id = ?
    `;

  const [solicitudes] = await pool.execute(consulta, [id]);

  if (solicitudes.length === 0) {
    return null;
  }

  return solicitudes[0];
}

export async function actualizarInformacion(id, informacionAdicional) {
  const consulta = `
        UPDATE solicitudes
        SET informacionAdicional = ?
        WHERE id = ?
    `;

  await pool.execute(consulta, [informacionAdicional, id]);

  return obtenerSolicitudPorId(id);
}

export async function actualizarEstado(id, estado) {
  const consulta = `
        UPDATE solicitudes
        SET estado = ?
        WHERE id = ?
    `;

  await pool.execute(consulta, [estado, id]);

  return obtenerSolicitudPorId(id);
}

export async function cancelarSolicitud(id) {
  const consulta = `
        UPDATE solicitudes
        SET estado = 'Cancelada'
        WHERE id = ?
    `;

  await pool.execute(consulta, [id]);

  return obtenerSolicitudPorId(id);
}

export async function confirmarSolucion(id) {
  const consulta = `
        UPDATE solicitudes
        SET solucionConfirmada = TRUE
        WHERE id = ?
    `;

  await pool.execute(consulta, [id]);

  return obtenerSolicitudPorId(id);
}
