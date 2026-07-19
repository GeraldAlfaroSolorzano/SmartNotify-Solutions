import {
    useCallback,
    useEffect,
    useState
} from "react";

import { io } from "socket.io-client";

const API_URL =
    "http://localhost:3000/api/solicitudes";

const socket = io(
    "http://localhost:3000",
    {
        autoConnect: false
    }
);

const formularioInicial = {
    nombreCliente: "",
    correo: "",
    asunto: "",
    descripcion: ""
};

function App() {
    const [formulario, setFormulario] = useState(
        formularioInicial
    );

    const [solicitudes, setSolicitudes] =
        useState([]);

    const [consultaId, setConsultaId] =
        useState("");

    const [
        solicitudConsultada,
        setSolicitudConsultada
    ] = useState(null);

    const [informacionId, setInformacionId] =
        useState("");

    const [
        informacionAdicional,
        setInformacionAdicional
    ] = useState("");

    const [estadoId, setEstadoId] =
        useState("");

    const [estado, setEstado] =
        useState("Pendiente");

    const [mensaje, setMensaje] =
        useState("");

    const [rolChat, setRolChat] =
        useState("Cliente");

    const [textoChat, setTextoChat] =
        useState("");

    const [mensajesChat, setMensajesChat] =
        useState([]);

    const [
        tecnicoEscribiendo,
        setTecnicoEscribiendo
    ] = useState(false);

    const cargarSolicitudes = useCallback(
        async function obtenerDatos() {
            try {
                const response = await fetch(
                    API_URL
                );

                const resultado =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        resultado.message
                    );
                }

                setSolicitudes(
                    resultado.data
                );
            } catch (error) {
                setMensaje(error.message);
            }
        },
        []
    );

    useEffect(
        function iniciarWebSocket() {
            cargarSolicitudes();

            function recibirEstado(
                solicitudActualizada
            ) {
                setSolicitudes(
                    function actualizarSolicitudes(
                        solicitudesActuales
                    ) {
                        return solicitudesActuales.map(
                            function actualizarSolicitud(
                                solicitud
                            ) {
                                if (
                                    solicitud.id ===
                                    solicitudActualizada.id
                                ) {
                                    return solicitudActualizada;
                                }

                                return solicitud;
                            }
                        );
                    }
                );

                setSolicitudConsultada(
                    function actualizarConsulta(
                        solicitudActual
                    ) {
                        if (!solicitudActual) {
                            return solicitudActual;
                        }

                        if (
                            solicitudActual.id ===
                            solicitudActualizada.id
                        ) {
                            return solicitudActualizada;
                        }

                        return solicitudActual;
                    }
                );

                setMensaje(
                    `Solicitud #${solicitudActualizada.id} actualizada`
                );
            }

            function recibirMensaje(
                mensajeNuevo
            ) {
                setMensajesChat(
                    function agregarMensaje(
                        mensajesActuales
                    ) {
                        return [
                            ...mensajesActuales,
                            mensajeNuevo
                        ];
                    }
                );
            }

            function recibirEstadoEscritura(
                estadoEscritura
            ) {
                setTecnicoEscribiendo(
                    estadoEscritura
                );
            }

            socket.on(
                "estado-solicitud",
                recibirEstado
            );

            socket.on(
                "mensaje-chat",
                recibirMensaje
            );

            socket.on(
                "tecnico-escribiendo",
                recibirEstadoEscritura
            );

            socket.connect();

            return function cerrarWebSocket() {
                socket.off(
                    "estado-solicitud",
                    recibirEstado
                );

                socket.off(
                    "mensaje-chat",
                    recibirMensaje
                );

                socket.off(
                    "tecnico-escribiendo",
                    recibirEstadoEscritura
                );

                socket.disconnect();
            };
        },
        [cargarSolicitudes]
    );

    function actualizarFormulario(event) {
        const nombre = event.target.name;
        const valor = event.target.value;

        setFormulario({
            ...formulario,
            [nombre]: valor
        });
    }

    async function registrarSolicitud(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(
                        formulario
                    )
                }
            );

            const resultado =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    resultado.message
                );
            }

            setMensaje(resultado.message);

            setFormulario(
                formularioInicial
            );

            await cargarSolicitudes();
        } catch (error) {
            setMensaje(error.message);
        }
    }

    async function consultarSolicitud(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/${consultaId}`
            );

            const resultado =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    resultado.message
                );
            }

            setSolicitudConsultada(
                resultado.data
            );

            setMensaje("");
        } catch (error) {
            setSolicitudConsultada(null);
            setMensaje(error.message);
        }
    }

    async function guardarInformacion(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/${informacionId}/informacion`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        informacionAdicional:
                            informacionAdicional
                    })
                }
            );

            const resultado =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    resultado.message
                );
            }

            setMensaje(resultado.message);
            setInformacionId("");
            setInformacionAdicional("");

            await cargarSolicitudes();
        } catch (error) {
            setMensaje(error.message);
        }
    }

    async function guardarEstado(event) {
        event.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/${estadoId}/estado`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        estado: estado
                    })
                }
            );

            const resultado =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    resultado.message
                );
            }

            setMensaje(resultado.message);
            setEstadoId("");
        } catch (error) {
            setMensaje(error.message);
        }
    }

    async function cancelarSolicitud(id) {
        try {
            const response = await fetch(
                `${API_URL}/${id}/cancelar`,
                {
                    method: "PUT"
                }
            );

            const resultado =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    resultado.message
                );
            }

            setMensaje(resultado.message);
        } catch (error) {
            setMensaje(error.message);
        }
    }

    async function confirmarSolucion(id) {
        try {
            const response = await fetch(
                `${API_URL}/${id}/confirmar`,
                {
                    method: "PUT"
                }
            );

            const resultado =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    resultado.message
                );
            }

            setMensaje(resultado.message);

            await cargarSolicitudes();
        } catch (error) {
            setMensaje(error.message);
        }
    }

    function actualizarTextoChat(event) {
        const texto = event.target.value;

        setTextoChat(texto);

        if (rolChat === "Tecnico") {
            let escribiendo = true;

            if (texto === "") {
                escribiendo = false;
            }

            socket.emit(
                "tecnico-escribiendo",
                escribiendo
            );
        }
    }

    function cambiarRolChat(event) {
        setRolChat(event.target.value);

        socket.emit(
            "tecnico-escribiendo",
            false
        );
    }

    function enviarMensajeChat(event) {
        event.preventDefault();

        const mensajeNuevo = {
            remitente: rolChat,
            texto: textoChat
        };

        socket.emit(
            "mensaje-chat",
            mensajeNuevo
        );

        setTextoChat("");

        if (rolChat === "Tecnico") {
            socket.emit(
                "tecnico-escribiendo",
                false
            );
        }
    }

    function mostrarIndicadorEscritura() {
        if (!tecnicoEscribiendo) {
            return null;
        }

        return (
            <p className="text-primary chat-escribiendo">
                Tecnico escribiendo...
            </p>
        );
    }

    function mostrarMensajesChat() {
        if (mensajesChat.length === 0) {
            return (
                <p className="text-muted text-center mb-0">
                    No existen mensajes.
                </p>
            );
        }

        return mensajesChat.map(
            function mostrarMensajeChat(
                mensajeActual,
                indice
            ) {
                let claseMensaje =
                    "chat-mensaje chat-mensaje-cliente";

                if (
                    mensajeActual.remitente ===
                    "Tecnico"
                ) {
                    claseMensaje =
                        "chat-mensaje chat-mensaje-tecnico";
                }

                return (
                    <div
                        className={claseMensaje}
                        key={indice}
                    >
                        <strong>
                            {mensajeActual.remitente}
                        </strong>

                        <p className="mb-0">
                            {mensajeActual.texto}
                        </p>
                    </div>
                );
            }
        );
    }

    function mostrarChat() {
        return (
            <section className="card shadow-sm mt-4">
                <div className="card-body p-4">
                    <h2 className="h4 mb-1">
                        Chat en tiempo real
                    </h2>

                    <p className="text-muted mb-4">
                        Comunicacion entre cliente y tecnico
                    </p>

                    <div className="row g-4">
                        <div className="col-lg-4">
                            <form
                                onSubmit={
                                    enviarMensajeChat
                                }
                            >
                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="rolChat"
                                    >
                                        Participante
                                    </label>

                                    <select
                                        className="form-select"
                                        id="rolChat"
                                        onChange={
                                            cambiarRolChat
                                        }
                                        value={rolChat}
                                    >
                                        <option value="Cliente">
                                            Cliente
                                        </option>

                                        <option value="Tecnico">
                                            Tecnico
                                        </option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="textoChat"
                                    >
                                        Mensaje
                                    </label>

                                    <textarea
                                        className="form-control"
                                        id="textoChat"
                                        onChange={
                                            actualizarTextoChat
                                        }
                                        rows="5"
                                        value={textoChat}
                                    />
                                </div>

                                <button
                                    className="btn btn-primary w-100"
                                    type="submit"
                                >
                                    Enviar mensaje
                                </button>
                            </form>
                        </div>

                        <div className="col-lg-8">
                            <div className="chat-contenedor">
                                {
                                    mostrarIndicadorEscritura()
                                }

                                <div className="chat-lista">
                                    {
                                        mostrarMensajesChat()
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    function mostrarMensaje() {
        if (mensaje === "") {
            return null;
        }

        return (
            <div className="alert alert-info">
                {mensaje}
            </div>
        );
    }

    function mostrarConfirmacion(valor) {
        if (valor === true || valor === 1) {
            return "Si";
        }

        return "No";
    }

    function mostrarSolicitudConsultada() {
        if (!solicitudConsultada) {
            return null;
        }

        return (
            <div className="card mt-3">
                <div className="card-body">
                    <h3 className="h5">
                        Solicitud #{solicitudConsultada.id}
                    </h3>

                    <p>
                        <strong>Cliente:</strong>{" "}
                        {
                            solicitudConsultada
                                .nombreCliente
                        }
                    </p>

                    <p>
                        <strong>Correo:</strong>{" "}
                        {solicitudConsultada.correo}
                    </p>

                    <p>
                        <strong>Asunto:</strong>{" "}
                        {solicitudConsultada.asunto}
                    </p>

                    <p>
                        <strong>Descripcion:</strong>{" "}
                        {
                            solicitudConsultada
                                .descripcion
                        }
                    </p>

                    <p>
                        <strong>
                            Informacion adicional:
                        </strong>{" "}
                        {
                            solicitudConsultada
                                .informacionAdicional
                        }
                    </p>

                    <p>
                        <strong>Estado:</strong>{" "}
                        {solicitudConsultada.estado}
                    </p>

                    <p>
                        <strong>
                            Solucion confirmada:
                        </strong>{" "}
                        {
                            mostrarConfirmacion(
                                solicitudConsultada
                                    .solucionConfirmada
                            )
                        }
                    </p>
                </div>
            </div>
        );
    }

    function mostrarSolicitudes() {
        if (solicitudes.length === 0) {
            return (
                <tr>
                    <td
                        className="text-center"
                        colSpan="7"
                    >
                        No existen solicitudes registradas.
                    </td>
                </tr>
            );
        }

        return solicitudes.map(
            function crearFila(solicitud) {
                return (
                    <tr key={solicitud.id}>
                        <td>{solicitud.id}</td>

                        <td>
                            {solicitud.nombreCliente}
                        </td>

                        <td>{solicitud.asunto}</td>

                        <td>{solicitud.estado}</td>

                        <td>
                            {
                                mostrarConfirmacion(
                                    solicitud
                                        .solucionConfirmada
                                )
                            }
                        </td>

                        <td>
                            <button
                                className={
                                    "btn btn-sm " +
                                    "btn-outline-danger"
                                }
                                onClick={
                                    function cancelar() {
                                        cancelarSolicitud(
                                            solicitud.id
                                        );
                                    }
                                }
                                type="button"
                            >
                                Cancelar
                            </button>
                        </td>

                        <td>
                            <button
                                className={
                                    "btn btn-sm " +
                                    "btn-outline-success"
                                }
                                onClick={
                                    function confirmar() {
                                        confirmarSolucion(
                                            solicitud.id
                                        );
                                    }
                                }
                                type="button"
                            >
                                Confirmar solucion
                            </button>
                        </td>
                    </tr>
                );
            }
        );
    }

    return (
        <main className="container py-5">
            <header className="text-center mb-5">
                <h1>
                    SmartNotify Solutions
                </h1>

                <p className="lead">
                    Sistema de solicitudes de soporte tecnico
                </p>

                <span className="badge text-bg-primary">
                    Etapa 6: WebSockets
                </span>
            </header>

            {mostrarMensaje()}

            <div className="row g-4">
                <div className="col-lg-7">
                    <section className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4">
                                Registrar solicitud
                            </h2>

                            <form
                                onSubmit={
                                    registrarSolicitud
                                }
                            >
                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="nombreCliente"
                                    >
                                        Nombre del cliente
                                    </label>

                                    <input
                                        className="form-control"
                                        id="nombreCliente"
                                        name="nombreCliente"
                                        onChange={
                                            actualizarFormulario
                                        }
                                        type="text"
                                        value={
                                            formulario
                                                .nombreCliente
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="correo"
                                    >
                                        Correo electronico
                                    </label>

                                    <input
                                        className="form-control"
                                        id="correo"
                                        name="correo"
                                        onChange={
                                            actualizarFormulario
                                        }
                                        type="email"
                                        value={
                                            formulario.correo
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="asunto"
                                    >
                                        Asunto
                                    </label>

                                    <input
                                        className="form-control"
                                        id="asunto"
                                        name="asunto"
                                        onChange={
                                            actualizarFormulario
                                        }
                                        type="text"
                                        value={
                                            formulario.asunto
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="descripcion"
                                    >
                                        Descripcion
                                    </label>

                                    <textarea
                                        className="form-control"
                                        id="descripcion"
                                        name="descripcion"
                                        onChange={
                                            actualizarFormulario
                                        }
                                        rows="5"
                                        value={
                                            formulario.descripcion
                                        }
                                    />
                                </div>

                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Registrar solicitud
                                </button>
                            </form>
                        </div>
                    </section>
                </div>

                <div className="col-lg-5">
                    <section className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4">
                                Consultar solicitud
                            </h2>

                            <form
                                onSubmit={
                                    consultarSolicitud
                                }
                            >
                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="consultaId"
                                    >
                                        Identificador
                                    </label>

                                    <input
                                        className="form-control"
                                        id="consultaId"
                                        onChange={
                                            function cambiarId(
                                                event
                                            ) {
                                                setConsultaId(
                                                    event.target
                                                        .value
                                                );
                                            }
                                        }
                                        type="number"
                                        value={consultaId}
                                    />
                                </div>

                                <button
                                    className={
                                        "btn " +
                                        "btn-outline-primary"
                                    }
                                    type="submit"
                                >
                                    Consultar
                                </button>
                            </form>

                            {
                                mostrarSolicitudConsultada()
                            }
                        </div>
                    </section>
                </div>
            </div>

            <div className="row g-4 mt-1">
                <div className="col-lg-6">
                    <section className="card shadow-sm h-100">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4">
                                Agregar informacion
                            </h2>

                            <form
                                onSubmit={
                                    guardarInformacion
                                }
                            >
                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="informacionId"
                                    >
                                        Identificador
                                    </label>

                                    <input
                                        className="form-control"
                                        id="informacionId"
                                        onChange={
                                            function cambiarId(
                                                event
                                            ) {
                                                setInformacionId(
                                                    event.target
                                                        .value
                                                );
                                            }
                                        }
                                        type="number"
                                        value={
                                            informacionId
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor={
                                            "informacionAdicional"
                                        }
                                    >
                                        Informacion adicional
                                    </label>

                                    <textarea
                                        className="form-control"
                                        id={
                                            "informacionAdicional"
                                        }
                                        onChange={
                                            function cambiarTexto(
                                                event
                                            ) {
                                                setInformacionAdicional(
                                                    event.target
                                                        .value
                                                );
                                            }
                                        }
                                        rows="4"
                                        value={
                                            informacionAdicional
                                        }
                                    />
                                </div>

                                <button
                                    className={
                                        "btn " +
                                        "btn-outline-secondary"
                                    }
                                    type="submit"
                                >
                                    Guardar informacion
                                </button>
                            </form>
                        </div>
                    </section>
                </div>

                <div className="col-lg-6">
                    <section className="card shadow-sm h-100">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4">
                                Actualizar estado
                            </h2>

                            <form
                                onSubmit={
                                    guardarEstado
                                }
                            >
                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="estadoId"
                                    >
                                        Identificador
                                    </label>

                                    <input
                                        className="form-control"
                                        id="estadoId"
                                        onChange={
                                            function cambiarId(
                                                event
                                            ) {
                                                setEstadoId(
                                                    event.target
                                                        .value
                                                );
                                            }
                                        }
                                        type="number"
                                        value={estadoId}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="estado"
                                    >
                                        Nuevo estado
                                    </label>

                                    <select
                                        className="form-select"
                                        id="estado"
                                        onChange={
                                            function cambiarEstado(
                                                event
                                            ) {
                                                setEstado(
                                                    event.target
                                                        .value
                                                );
                                            }
                                        }
                                        value={estado}
                                    >
                                        <option value="Pendiente">
                                            Pendiente
                                        </option>

                                        <option value="Asignada">
                                            Asignada
                                        </option>

                                        <option value="En proceso">
                                            En proceso
                                        </option>

                                        <option value="Finalizada">
                                            Finalizada
                                        </option>

                                        <option value="Cancelada">
                                            Cancelada
                                        </option>
                                    </select>
                                </div>

                                <button
                                    className={
                                        "btn " +
                                        "btn-outline-warning"
                                    }
                                    type="submit"
                                >
                                    Actualizar estado
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>

            {mostrarChat()}

            <section className="card shadow-sm mt-4">
                <div className="card-body p-4">
                    <div
                        className={
                            "d-flex " +
                            "justify-content-between " +
                            "align-items-center"
                        }
                    >
                        <h2 className="h4 mb-0">
                            Solicitudes registradas
                        </h2>

                        <button
                            className={
                                "btn " +
                                "btn-outline-primary"
                            }
                            onClick={
                                cargarSolicitudes
                            }
                            type="button"
                        >
                            Actualizar lista
                        </button>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Asunto</th>
                                    <th>Estado</th>
                                    <th>Confirmada</th>
                                    <th>Cancelar</th>
                                    <th>Confirmar</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    mostrarSolicitudes()
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <div className="alert alert-info mt-4">
                El chat, el indicador de escritura y los
                cambios de estado se comunican en tiempo
                real mediante WebSockets.
            </div>
        </main>
    );
}

export default App;