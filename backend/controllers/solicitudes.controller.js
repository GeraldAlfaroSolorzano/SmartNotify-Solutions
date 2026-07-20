import "dotenv/config";

import {
    enviarCorreo,
    generarQR
} from "../config/correo.js";

import {
    actualizarEstado,
    actualizarInformacion,
    cancelarSolicitud as cancelarSolicitudModelo,
    confirmarSolucion as confirmarSolucionModelo,
    crearSolicitud,
    obtenerSolicitudPorId,
    obtenerSolicitudes
} from "../models/solicitudes.model.js";

const estadosPermitidos = [
    "Pendiente",
    "Asignada",
    "En proceso",
    "Finalizada",
    "Cancelada"
];

if (!process.env.BACKEND_URL) {
    throw new Error(
        "Falta la variable de entorno BACKEND_URL."
    );
}

function esTextoValido(valor) {
    if (typeof valor !== "string") {
        return false;
    }

    if (valor.trim() === "") {
        return false;
    }

    return true;
}

function esCorreoValido(correo) {
    if (!esTextoValido(correo)) {
        return false;
    }

    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return patron.test(correo.trim());
}

function esIdValido(id) {
    const numero = Number(id);

    if (!Number.isInteger(numero)) {
        return false;
    }

    if (numero <= 0) {
        return false;
    }

    return true;
}

function validarDatosSolicitud(datos) {
    const errores = [];

    if (!datos || typeof datos !== "object") {
        errores.push("El cuerpo de la solicitud es requerido.");

        return errores;
    }

    if (!esTextoValido(datos.nombreCliente)) {
        errores.push("El nombre del cliente es requerido.");
    }

    if (!esCorreoValido(datos.correo)) {
        errores.push("El correo no tiene un formato valido.");
    }

    if (!esTextoValido(datos.asunto)) {
        errores.push("El asunto es requerido.");
    }

    if (!esTextoValido(datos.descripcion)) {
        errores.push("La descripcion es requerida.");
    }

    return errores;
}

function validarInformacionAdicional(datos) {
    const errores = [];

    if (!datos || typeof datos !== "object") {
        errores.push("El cuerpo de la solicitud es requerido.");

        return errores;
    }

    if (!esTextoValido(datos.informacionAdicional)) {
        errores.push("La informacion adicional es requerida.");
    }

    return errores;
}

function validarEstado(datos) {
    const errores = [];

    if (!datos || typeof datos !== "object") {
        errores.push("El cuerpo de la solicitud es requerido.");

        return errores;
    }

    if (!estadosPermitidos.includes(datos.estado)) {
        errores.push("El estado no es valido.");
    }

    return errores;
}

function crearEnlaces(solicitud) {
    const base = process.env.BACKEND_URL;

    return {
        consultar:
            `${base}/api/solicitudes/${solicitud.id}/vista`,
        confirmar:
            `${base}/api/solicitudes/` +
            `${solicitud.id}/confirmar-correo`,
        cancelar:
            `${base}/api/solicitudes/` +
            `${solicitud.id}/cancelar-correo`,
        formulario:
            `${base}/api/solicitudes/` +
            `${solicitud.id}/formulario`
    };
}

function crearContenidoAdjunto(solicitud) {
    return (
        `Solicitud #${solicitud.id}\n` +
        `Cliente: ${solicitud.nombreCliente}\n` +
        `Correo: ${solicitud.correo}\n` +
        `Asunto: ${solicitud.asunto}\n` +
        `Descripcion: ${solicitud.descripcion}\n` +
        `Informacion adicional: ` +
        `${solicitud.informacionAdicional || ""}\n` +
        `Estado: ${solicitud.estado}\n` +
        `Solucion confirmada: ` +
        `${solicitud.solucionConfirmada}\n` +
        `Fecha: ${solicitud.fechaActualizacion}\n`
    );
}

function crearCorreoHtml(
    solicitud,
    titulo,
    mensajeEstado,
    qrCid
) {
    const enlaces = crearEnlaces(solicitud);

    return `
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                >
                <title>${titulo}</title>
            </head>
            <body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;">
                <div style="max-width:640px;margin:30px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dfe5ec;">
                    <div style="background:#0d6efd;color:#ffffff;padding:24px;">
                        <h1 style="margin:0;font-size:24px;">
                            SmartNotify Solutions
                        </h1>
                    </div>

                    <div style="padding:28px;">
                        <h2 style="margin-top:0;color:#172033;">
                            ${titulo}
                        </h2>

                        <p>Hola ${solicitud.nombreCliente}.</p>
                        <p>${mensajeEstado}</p>

                        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                            <tr>
                                <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Destinatario</strong></td>
                                <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${solicitud.correo}</td>
                            </tr>
                            <tr>
                                <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Solicitud</strong></td>
                                <td style="padding:8px;border-bottom:1px solid #e5e7eb;">#${solicitud.id}</td>
                            </tr>
                            <tr>
                                <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Asunto</strong></td>
                                <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${solicitud.asunto}</td>
                            </tr>
                            <tr>
                                <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Estado</strong></td>
                                <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${solicitud.estado}</td>
                            </tr>
                            <tr>
                                <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Fecha</strong></td>
                                <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${solicitud.fechaActualizacion}</td>
                            </tr>
                        </table>

                        <p>
                            <a href="${enlaces.consultar}">Consultar solicitud</a>
                        </p>
                        <p>
                            <a href="${enlaces.confirmar}">Confirmar solucion</a>
                        </p>
                        <p>
                            <a href="${enlaces.cancelar}">Cancelar solicitud</a>
                        </p>
                        <p>
                            <a href="${enlaces.formulario}">Completar formulario</a>
                        </p>

                        <p><strong>Codigo QR de la solicitud:</strong></p>
                        <img
                            src="cid:${qrCid}"
                            alt="QR Solicitud #${solicitud.id}"
                            width="220"
                        >
                    </div>
                </div>
            </body>
        </html>
    `;
}

async function enviarNotificacion(
    solicitud,
    titulo,
    mensajeEstado
) {
    const enlaces = crearEnlaces(solicitud);
    const qrBuffer = await generarQR(enlaces.consultar);
    const qrCid = `qr-solicitud-${solicitud.id}`;

    const contenidoHtml = crearCorreoHtml(
        solicitud,
        titulo,
        mensajeEstado,
        qrCid
    );

    const adjuntos = [
        {
            filename: `solicitud-${solicitud.id}.txt`,
            content: crearContenidoAdjunto(solicitud)
        },
        {
            filename: `qr-solicitud-${solicitud.id}.png`,
            content: qrBuffer,
            cid: qrCid
        }
    ];

    await enviarCorreo(
        solicitud.correo,
        titulo,
        contenidoHtml,
        adjuntos
    );
}

async function notificarCambioEstado(solicitud) {
    let titulo = "";
    let mensaje = "";

    if (solicitud.estado === "Asignada") {
        titulo = "Solicitud asignada";
        mensaje = "Su solicitud fue asignada a un tecnico.";
    } else if (solicitud.estado === "En proceso") {
        titulo = "Solicitud en proceso";
        mensaje = "El tecnico esta trabajando en su solicitud.";
    } else if (solicitud.estado === "Finalizada") {
        titulo = "Solicitud finalizada";
        mensaje = "La solicitud fue marcada como finalizada.";
    } else if (solicitud.estado === "Cancelada") {
        titulo = "Solicitud cancelada";
        mensaje = "Su solicitud fue cancelada.";
    }

    if (titulo === "") {
        return false;
    }

    await enviarNotificacion(
        solicitud,
        titulo,
        mensaje
    );

    return true;
}

function emitirEstado(req, solicitud) {
    const io = req.app.get("io");

    if (io) {
        io.emit(
            "estado-solicitud",
            solicitud
        );
    }
}

function crearPaginaResultado(titulo, mensaje) {
    return `
        <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                >
                <title>${titulo}</title>
                <style>
                    body {
                        margin: 0;
                        padding: 40px;
                        font-family: Arial, sans-serif;
                        background-color: #f4f7fb;
                    }

                    main {
                        max-width: 650px;
                        margin: 0 auto;
                        padding: 30px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px
                            rgba(0, 0, 0, 0.1);
                    }

                    h1 {
                        color: #0d6efd;
                    }

                    p {
                        line-height: 1.6;
                    }
                </style>
            </head>
            <body>
                <main>
                    <h1>${titulo}</h1>
                    <p>${mensaje}</p>
                </main>
            </body>
        </html>
    `;
}

function responderValidacionJson(res, errores) {
    return res.status(400).json({
        success: false,
        message: "Datos invalidos.",
        error: errores
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
    if (!esIdValido(req.params.id)) {
        return responderValidacionJson(
            res,
            ["El identificador no es valido."]
        );
    }

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
    const errores = validarDatosSolicitud(req.body);

    if (errores.length > 0) {
        return responderValidacionJson(res, errores);
    }

    try {
        const datos = {
            nombreCliente: req.body.nombreCliente.trim(),
            correo: req.body.correo.trim(),
            asunto: req.body.asunto.trim(),
            descripcion: req.body.descripcion.trim()
        };

        const solicitud = await crearSolicitud(datos);
        let correoEnviado = true;
        let mensaje =
            "Solicitud registrada y correo enviado correctamente.";

        try {
            await enviarNotificacion(
                solicitud,
                "Solicitud creada",
                "Su solicitud fue registrada correctamente."
            );
        } catch (errorCorreo) {
            correoEnviado = false;
            mensaje =
                "Solicitud registrada, pero no fue posible enviar el correo.";

            console.error(
                "Error al enviar correo de creacion:",
                errorCorreo.message
            );
        }

        return res.status(201).json({
            success: true,
            message: mensaje,
            correoEnviado: correoEnviado,
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
    if (!esIdValido(req.params.id)) {
        return responderValidacionJson(
            res,
            ["El identificador no es valido."]
        );
    }

    const errores = validarInformacionAdicional(req.body);

    if (errores.length > 0) {
        return responderValidacionJson(res, errores);
    }

    try {
        const solicitud = await actualizarInformacion(
            req.params.id,
            req.body.informacionAdicional.trim()
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
    if (!esIdValido(req.params.id)) {
        return responderValidacionJson(
            res,
            ["El identificador no es valido."]
        );
    }

    const errores = validarEstado(req.body);

    if (errores.length > 0) {
        return responderValidacionJson(res, errores);
    }

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

        emitirEstado(req, solicitud);

        let correoEnviado = false;

        try {
            correoEnviado = await notificarCambioEstado(
                solicitud
            );
        } catch (errorCorreo) {
            console.error(
                "Error al enviar correo de estado:",
                errorCorreo.message
            );
        }

        return res.status(200).json({
            success: true,
            message: "Estado actualizado correctamente.",
            correoEnviado: correoEnviado,
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
    if (!esIdValido(req.params.id)) {
        return responderValidacionJson(
            res,
            ["El identificador no es valido."]
        );
    }

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

        emitirEstado(req, solicitud);

        let correoEnviado = true;

        try {
            await enviarNotificacion(
                solicitud,
                "Solicitud cancelada",
                "Su solicitud fue cancelada."
            );
        } catch (errorCorreo) {
            correoEnviado = false;

            console.error(
                "Error al enviar correo de cancelacion:",
                errorCorreo.message
            );
        }

        return res.status(200).json({
            success: true,
            message: "Solicitud cancelada correctamente.",
            correoEnviado: correoEnviado,
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
    if (!esIdValido(req.params.id)) {
        return responderValidacionJson(
            res,
            ["El identificador no es valido."]
        );
    }

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

export async function mostrarVistaSolicitud(req, res) {
    if (!esIdValido(req.params.id)) {
        return res.status(400).send(
            crearPaginaResultado(
                "Identificador invalido",
                "El identificador de la solicitud no es valido."
            )
        );
    }

    try {
        const solicitud = await obtenerSolicitudPorId(
            req.params.id
        );

        if (!solicitud) {
            return res.status(404).send(
                crearPaginaResultado(
                    "Solicitud no encontrada",
                    "La solicitud indicada no existe."
                )
            );
        }

        return res.status(200).send(`
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >
                    <title>Solicitud #${solicitud.id}</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 40px;
                            font-family: Arial, sans-serif;
                            background-color: #f4f7fb;
                        }

                        main {
                            max-width: 700px;
                            margin: 0 auto;
                            padding: 30px;
                            background-color: #ffffff;
                            border-radius: 10px;
                            box-shadow: 0 4px 15px
                                rgba(0, 0, 0, 0.1);
                        }

                        h1 {
                            color: #0d6efd;
                        }

                        dt {
                            margin-top: 14px;
                            font-weight: bold;
                        }

                        dd {
                            margin-left: 0;
                        }
                    </style>
                </head>
                <body>
                    <main>
                        <h1>Solicitud #${solicitud.id}</h1>
                        <dl>
                            <dt>Cliente</dt>
                            <dd>${solicitud.nombreCliente}</dd>
                            <dt>Correo</dt>
                            <dd>${solicitud.correo}</dd>
                            <dt>Asunto</dt>
                            <dd>${solicitud.asunto}</dd>
                            <dt>Descripcion</dt>
                            <dd>${solicitud.descripcion}</dd>
                            <dt>Informacion adicional</dt>
                            <dd>${solicitud.informacionAdicional || "Sin informacion adicional"}</dd>
                            <dt>Estado</dt>
                            <dd>${solicitud.estado}</dd>
                            <dt>Fecha</dt>
                            <dd>${solicitud.fechaActualizacion}</dd>
                        </dl>
                    </main>
                </body>
            </html>
        `);
    } catch (error) {
        console.error(error);

        return res.status(500).send(
            crearPaginaResultado(
                "Error",
                "No fue posible consultar la solicitud."
            )
        );
    }
}

export async function mostrarFormularioCorreo(req, res) {
    if (!esIdValido(req.params.id)) {
        return res.status(400).send(
            crearPaginaResultado(
                "Identificador invalido",
                "El identificador de la solicitud no es valido."
            )
        );
    }

    try {
        const solicitud = await obtenerSolicitudPorId(
            req.params.id
        );

        if (!solicitud) {
            return res.status(404).send(
                crearPaginaResultado(
                    "Solicitud no encontrada",
                    "La solicitud indicada no existe."
                )
            );
        }

        return res.status(200).send(`
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >
                    <title>Agregar informacion</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 40px;
                            font-family: Arial, sans-serif;
                            background-color: #f4f7fb;
                        }

                        main {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 30px;
                            background-color: #ffffff;
                            border-radius: 10px;
                            box-shadow: 0 4px 15px
                                rgba(0, 0, 0, 0.1);
                        }

                        label {
                            display: block;
                            margin-bottom: 10px;
                            font-weight: bold;
                        }

                        textarea {
                            width: 100%;
                            min-height: 150px;
                            padding: 10px;
                            box-sizing: border-box;
                        }

                        button {
                            margin-top: 15px;
                            padding: 10px 20px;
                            color: #ffffff;
                            background-color: #0d6efd;
                            border: 0;
                            border-radius: 5px;
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body>
                    <main>
                        <h1>Agregar informacion</h1>
                        <p>Solicitud #${solicitud.id}</p>
                        <p>
                            <strong>Asunto:</strong>
                            ${solicitud.asunto}
                        </p>
                        <form
                            action="/api/solicitudes/${solicitud.id}/formulario"
                            method="POST"
                        >
                            <label for="informacionAdicional">
                                Informacion adicional
                            </label>
                            <textarea
                                id="informacionAdicional"
                                name="informacionAdicional"
                                required
                            ></textarea>
                            <button type="submit">
                                Guardar informacion
                            </button>
                        </form>
                    </main>
                </body>
            </html>
        `);
    } catch (error) {
        console.error(error);

        return res.status(500).send(
            crearPaginaResultado(
                "Error",
                "No fue posible mostrar el formulario."
            )
        );
    }
}

export async function procesarFormularioCorreo(req, res) {
    if (!esIdValido(req.params.id)) {
        return res.status(400).send(
            crearPaginaResultado(
                "Identificador invalido",
                "El identificador de la solicitud no es valido."
            )
        );
    }

    const errores = validarInformacionAdicional(req.body);

    if (errores.length > 0) {
        return res.status(400).send(
            crearPaginaResultado(
                "Datos invalidos",
                errores.join(" ")
            )
        );
    }

    try {
        const solicitud = await actualizarInformacion(
            req.params.id,
            req.body.informacionAdicional.trim()
        );

        if (!solicitud) {
            return res.status(404).send(
                crearPaginaResultado(
                    "Solicitud no encontrada",
                    "La solicitud indicada no existe."
                )
            );
        }

        return res.status(200).send(
            crearPaginaResultado(
                "Informacion actualizada",
                "La informacion fue guardada correctamente."
            )
        );
    } catch (error) {
        console.error(error);

        return res.status(500).send(
            crearPaginaResultado(
                "Error",
                "No fue posible actualizar la informacion."
            )
        );
    }
}

export async function cancelarSolicitudCorreo(req, res) {
    if (!esIdValido(req.params.id)) {
        return res.status(400).send(
            crearPaginaResultado(
                "Identificador invalido",
                "El identificador de la solicitud no es valido."
            )
        );
    }

    try {
        const solicitud = await cancelarSolicitudModelo(
            req.params.id
        );

        if (!solicitud) {
            return res.status(404).send(
                crearPaginaResultado(
                    "Solicitud no encontrada",
                    "La solicitud indicada no existe."
                )
            );
        }

        emitirEstado(req, solicitud);

        try {
            await enviarNotificacion(
                solicitud,
                "Solicitud cancelada",
                "Su solicitud fue cancelada."
            );
        } catch (errorCorreo) {
            console.error(
                "Error al enviar correo de cancelacion:",
                errorCorreo.message
            );
        }

        return res.status(200).send(
            crearPaginaResultado(
                "Solicitud cancelada",
                "La solicitud fue cancelada correctamente."
            )
        );
    } catch (error) {
        console.error(error);

        return res.status(500).send(
            crearPaginaResultado(
                "Error",
                "No fue posible cancelar la solicitud."
            )
        );
    }
}

export async function confirmarSolucionCorreo(req, res) {
    if (!esIdValido(req.params.id)) {
        return res.status(400).send(
            crearPaginaResultado(
                "Identificador invalido",
                "El identificador de la solicitud no es valido."
            )
        );
    }

    try {
        const solicitud = await confirmarSolucionModelo(
            req.params.id
        );

        if (!solicitud) {
            return res.status(404).send(
                crearPaginaResultado(
                    "Solicitud no encontrada",
                    "La solicitud indicada no existe."
                )
            );
        }

        return res.status(200).send(
            crearPaginaResultado(
                "Solucion confirmada",
                "La solucion fue confirmada correctamente."
            )
        );
    } catch (error) {
        console.error(error);

        return res.status(500).send(
            crearPaginaResultado(
                "Error",
                "No fue posible confirmar la solucion."
            )
        );
    }
}
