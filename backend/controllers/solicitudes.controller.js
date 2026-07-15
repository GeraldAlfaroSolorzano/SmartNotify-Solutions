import {
    crearSolicitud,
    obtenerSolicitudPorId,
    obtenerSolicitudes
} from "../models/solicitudes.model.js";

function textoVacio(valor) {
    if (valor === undefined || valor === null) {
        return true;
    }

    if (valor.trim() === "") {
        return true;
    }

    return false;
}

function crearPagina(titulo, contenido) {
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

                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                >
            </head>

            <body class="bg-light">
                <main class="container py-5">
                    ${contenido}
                </main>
            </body>
        </html>
    `;
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
            const contenido = `
                <div class="alert alert-danger">
                    Todos los campos son requeridos.
                </div>

                <a
                    class="btn btn-primary"
                    href="http://localhost:5173"
                >
                    Volver
                </a>
            `;

            return res.status(400).send(
                crearPagina(
                    "Datos incompletos",
                    contenido
                )
            );
        }

        const solicitud = await crearSolicitud(datos);

        const contenido = `
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <h1 class="h3 mb-4">
                        Solicitud registrada
                    </h1>

                    <div class="alert alert-success">
                        La solicitud fue registrada correctamente.
                    </div>

                    <p>
                        <strong>Identificador:</strong>
                        ${solicitud.id}
                    </p>

                    <p>
                        <strong>Cliente:</strong>
                        ${solicitud.nombreCliente}
                    </p>

                    <p>
                        <strong>Correo:</strong>
                        ${solicitud.correo}
                    </p>

                    <p>
                        <strong>Asunto:</strong>
                        ${solicitud.asunto}
                    </p>

                    <p>
                        <strong>Descripcion:</strong>
                        ${solicitud.descripcion}
                    </p>

                    <p>
                        <strong>Estado:</strong>
                        ${solicitud.estado}
                    </p>

                    <a
                        class="btn btn-primary"
                        href="http://localhost:5173"
                    >
                        Volver
                    </a>
                </div>
            </div>
        `;

        return res.status(201).send(
            crearPagina(
                "Solicitud registrada",
                contenido
            )
        );
    } catch (error) {
        console.error(error);

        const contenido = `
            <div class="alert alert-danger">
                No fue posible registrar la solicitud.
            </div>

            <a
                class="btn btn-primary"
                href="http://localhost:5173"
            >
                Volver
            </a>
        `;

        return res.status(500).send(
            crearPagina(
                "Error del servidor",
                contenido
            )
        );
    }
}

export async function consultarSolicitud(req, res) {
    try {
        const id = Number(req.query.id);

        if (!Number.isInteger(id) || id <= 0) {
            const contenido = `
                <div class="alert alert-danger">
                    El identificador no es valido.
                </div>

                <a
                    class="btn btn-primary"
                    href="http://localhost:5173"
                >
                    Volver
                </a>
            `;

            return res.status(400).send(
                crearPagina(
                    "Identificador invalido",
                    contenido
                )
            );
        }

        const solicitud = await obtenerSolicitudPorId(id);

        if (!solicitud) {
            const contenido = `
                <div class="alert alert-warning">
                    La solicitud no fue encontrada.
                </div>

                <a
                    class="btn btn-primary"
                    href="http://localhost:5173"
                >
                    Volver
                </a>
            `;

            return res.status(404).send(
                crearPagina(
                    "Solicitud no encontrada",
                    contenido
                )
            );
        }

        const contenido = `
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <h1 class="h3 mb-4">
                        Informacion de la solicitud
                    </h1>

                    <p>
                        <strong>Identificador:</strong>
                        ${solicitud.id}
                    </p>

                    <p>
                        <strong>Cliente:</strong>
                        ${solicitud.nombreCliente}
                    </p>

                    <p>
                        <strong>Correo:</strong>
                        ${solicitud.correo}
                    </p>

                    <p>
                        <strong>Asunto:</strong>
                        ${solicitud.asunto}
                    </p>

                    <p>
                        <strong>Descripcion:</strong>
                        ${solicitud.descripcion}
                    </p>

                    <p>
                        <strong>Estado:</strong>
                        ${solicitud.estado}
                    </p>

                    <a
                        class="btn btn-primary"
                        href="http://localhost:5173"
                    >
                        Volver
                    </a>
                </div>
            </div>
        `;

        return res.status(200).send(
            crearPagina(
                "Consultar solicitud",
                contenido
            )
        );
    } catch (error) {
        console.error(error);

        const contenido = `
            <div class="alert alert-danger">
                No fue posible consultar la solicitud.
            </div>

            <a
                class="btn btn-primary"
                href="http://localhost:5173"
            >
                Volver
            </a>
        `;

        return res.status(500).send(
            crearPagina(
                "Error del servidor",
                contenido
            )
        );
    }
}

export async function listarSolicitudes(req, res) {
    try {
        const solicitudes = await obtenerSolicitudes();

        let filas = "";

        for (const solicitud of solicitudes) {
            filas += `
                <tr>
                    <td>${solicitud.id}</td>
                    <td>${solicitud.nombreCliente}</td>
                    <td>${solicitud.asunto}</td>
                    <td>${solicitud.estado}</td>
                </tr>
            `;
        }

        if (solicitudes.length === 0) {
            filas = `
                <tr>
                    <td colspan="4" class="text-center">
                        No existen solicitudes registradas.
                    </td>
                </tr>
            `;
        }

        const contenido = `
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <h1 class="h3 mb-4">
                        Solicitudes registradas
                    </h1>

                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Asunto</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>

                            <tbody>
                                ${filas}
                            </tbody>
                        </table>
                    </div>

                    <a
                        class="btn btn-primary"
                        href="http://localhost:5173"
                    >
                        Volver
                    </a>
                </div>
            </div>
        `;

        return res.status(200).send(
            crearPagina(
                "Solicitudes registradas",
                contenido
            )
        );
    } catch (error) {
        console.error(error);

        const contenido = `
            <div class="alert alert-danger">
                No fue posible consultar las solicitudes.
            </div>

            <a
                class="btn btn-primary"
                href="http://localhost:5173"
            >
                Volver
            </a>
        `;

        return res.status(500).send(
            crearPagina(
                "Error del servidor",
                contenido
            )
        );
    }
}