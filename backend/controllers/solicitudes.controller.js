import {
  actualizarEstado,
  actualizarInformacion,
  cancelarSolicitud as cancelarSolicitudModelo,
  confirmarSolucion as confirmarSolucionModelo,
  crearSolicitud,
  obtenerSolicitudPorId,
  obtenerSolicitudes,
} from "../models/solicitudes.model.js";

const estadosValidos = ["Pendiente", "Asignada", "En proceso", "Finalizada"];

function textoVacio(valor) {
  if (valor === undefined || valor === null) {
    return true;
  }

  if (valor.trim() === "") {
    return true;
  }

  return false;
}

function idValido(id) {
  const numeroId = Number(id);

  if (!Number.isInteger(numeroId)) {
    return false;
  }

  if (numeroId <= 0) {
    return false;
  }

  return true;
}

export async function listarSolicitudes(req, res) {
  try {
    const solicitudes = await obtenerSolicitudes();

    return res.status(200).json({
      success: true,
      message: "Solicitudes obtenidas correctamente.",
      data: solicitudes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "No fue posible consultar las solicitudes.",
    });
  }
}

export async function consultarSolicitud(req, res) {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "El identificador no es valido.",
      });
    }

    const solicitud = await obtenerSolicitudPorId(req.params.id);

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Solicitud obtenida correctamente.",
      data: solicitud,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "No fue posible consultar la solicitud.",
    });
  }
}

export async function registrarSolicitud(req, res) {
  try {
    const datos = req.body;

    if (
      textoVacio(datos.nombreCliente) ||
      textoVacio(datos.correo) ||
      textoVacio(datos.asunto) ||
      textoVacio(datos.descripcion)
    ) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos.",
      });
    }

    const solicitud = await crearSolicitud(datos);

    return res.status(201).json({
      success: true,
      message: "Solicitud registrada correctamente.",
      data: solicitud,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "No fue posible registrar la solicitud.",
    });
  }
}

export async function actualizarInformacionSolicitud(req, res) {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "El identificador no es valido.",
      });
    }

    if (textoVacio(req.body.informacionAdicional)) {
      return res.status(400).json({
        success: false,
        message: "La informacion adicional es requerida.",
      });
    }

    const solicitudActual = await obtenerSolicitudPorId(req.params.id);

    if (!solicitudActual) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada.",
      });
    }

    const solicitud = await actualizarInformacion(
      req.params.id,
      req.body.informacionAdicional,
    );

    return res.status(200).json({
      success: true,
      message: "Informacion actualizada correctamente.",
      data: solicitud,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "No fue posible actualizar la informacion.",
    });
  }
}

export async function actualizarEstadoSolicitud(req, res) {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "El identificador no es valido.",
      });
    }

    if (!estadosValidos.includes(req.body.estado)) {
      return res.status(400).json({
        success: false,
        message: "El estado no es valido.",
      });
    }

    const solicitudActual = await obtenerSolicitudPorId(req.params.id);

    if (!solicitudActual) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada.",
      });
    }

    const solicitud = await actualizarEstado(req.params.id, req.body.estado);

    return res.status(200).json({
      success: true,
      message: "Estado actualizado correctamente.",
      data: solicitud,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "No fue posible actualizar el estado.",
    });
  }
}

export async function cancelarSolicitud(req, res) {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "El identificador no es valido.",
      });
    }

    const solicitudActual = await obtenerSolicitudPorId(req.params.id);

    if (!solicitudActual) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada.",
      });
    }

    const solicitud = await cancelarSolicitudModelo(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Solicitud cancelada correctamente.",
      data: solicitud,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "No fue posible cancelar la solicitud.",
    });
  }
}

export async function confirmarSolucion(req, res) {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "El identificador no es valido.",
      });
    }

    const solicitudActual = await obtenerSolicitudPorId(req.params.id);

    if (!solicitudActual) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada.",
      });
    }

    if (solicitudActual.estado !== "Finalizada") {
      return res.status(400).json({
        success: false,
        message: "La solicitud debe estar finalizada.",
      });
    }

    const solicitud = await confirmarSolucionModelo(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Solucion confirmada correctamente.",
      data: solicitud,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "No fue posible confirmar la solucion.",
    });
  }
}
