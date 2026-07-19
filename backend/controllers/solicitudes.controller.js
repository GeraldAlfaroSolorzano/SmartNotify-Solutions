import {
    actualizarEstado,
    actualizarInformacion,
    cancelarSolicitud as cancelarSolicitudModelo,
    confirmarSolucion as confirmarSolucionModelo,
    crearSolicitud,
    obtenerSolicitudPorId,
    obtenerSolicitudes
} from "../models/solicitudes.model.js";

const clientesSse = new Set();

function enviarCambioEstado(solicitud) {
    const evento = {
        mensaje:
            `Solicitud #${solicitud.id} actualizada a ${solicitud.estado}`,
        solicitud: solicitud
    };

    for (const cliente of clientesSse) {
        cliente.write(
            `data: ${JSON.stringify(evento)}\n\n`
        );
    }
}

export function conectarSse(req, res) {
    res.setHeader(
        "Content-Type",
        "text/event-stream"
    );

    res.setHeader(
        "Cache-Control",
        "no-cache"
    );

    res.setHeader(
        "Connection",
        "keep-alive"
    );

    res.flushHeaders();

    clientesSse.add(res);

    req.on("close", function cerrarConexion() {
        clientesSse.delete(res);
        res.end();
    });
}

export async function listarSolicitudes(req, res) {
    try {
        const solicitudes = await obtenerSolicitudes();

        return res.status(200).json({
            success: true,
            data: solicitudes
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible consultar las solicitudes."
        });
    }
}

export async function consultarSolicitud(req, res) {
    try {
        const solicitud = await obtenerSolicitudPorId(
            req.params.id
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: "Solicitud no encontrada."
            });
        }

        return res.status(200).json({
            success: true,
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible consultar la solicitud."
        });
    }
}

export async function registrarSolicitud(req, res) {
    try {
        const solicitud = await crearSolicitud(req.body);

        return res.status(201).json({
            success: true,
            message: "Solicitud registrada correctamente.",
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible registrar la solicitud."
        });
    }
}

export async function actualizarInformacionSolicitud(
    req,
    res
) {
    try {
        const solicitud = await actualizarInformacion(
            req.params.id,
            req.body.informacionAdicional
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: "Solicitud no encontrada."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Informacion actualizada correctamente.",
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible actualizar la informacion."
        });
    }
}

export async function actualizarEstadoSolicitud(req, res) {
    try {
        const solicitud = await actualizarEstado(
            req.params.id,
            req.body.estado
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: "Solicitud no encontrada."
            });
        }

        enviarCambioEstado(solicitud);

        return res.status(200).json({
            success: true,
            message: "Estado actualizado correctamente.",
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible actualizar el estado."
        });
    }
}

export async function cancelarSolicitud(req, res) {
    try {
        const solicitud = await cancelarSolicitudModelo(
            req.params.id
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: "Solicitud no encontrada."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Solicitud cancelada correctamente.",
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible cancelar la solicitud."
        });
    }
}

export async function confirmarSolucion(req, res) {
    try {
        const solicitud = await confirmarSolucionModelo(
            req.params.id
        );

        if (!solicitud) {
            return res.status(404).json({
                success: false,
                message: "Solicitud no encontrada."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Solucion confirmada correctamente.",
            data: solicitud
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "No fue posible confirmar la solucion."
        });
    }
}