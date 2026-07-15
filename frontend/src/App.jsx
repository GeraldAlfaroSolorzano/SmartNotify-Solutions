function App() {
    return (
        <main className="container py-5">
            <header className="text-center mb-5">
                <h1>SmartNotify Solutions</h1>

                <p className="lead">
                    Sistema de solicitudes de soporte tecnico
                </p>

                <span className="badge text-bg-primary">
                    Etapa 1: HTTP tradicional
                </span>
            </header>

            <div className="row g-4">
                <div className="col-lg-7">
                    <section className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4">
                                Registrar solicitud
                            </h2>

                            <form
                                action="http://localhost:3000/api/solicitudes"
                                method="POST"
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
                                        required
                                        type="text"
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
                                        required
                                        type="email"
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
                                        required
                                        type="text"
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
                                        required
                                        rows="5"
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
                    <section className="card shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4">
                                Consultar solicitud
                            </h2>

                            <form
                                action="http://localhost:3000/api/solicitudes/consulta"
                                method="GET"
                            >
                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="id"
                                    >
                                        Identificador
                                    </label>

                                    <input
                                        className="form-control"
                                        id="id"
                                        min="1"
                                        name="id"
                                        required
                                        type="number"
                                    />
                                </div>

                                <button
                                    className="btn btn-outline-primary"
                                    type="submit"
                                >
                                    Consultar solicitud
                                </button>
                            </form>
                        </div>
                    </section>

                    <section className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-3">
                                Todas las solicitudes
                            </h2>

                            <a
                                className="btn btn-outline-secondary"
                                href="http://localhost:3000/api/solicitudes"
                            >
                                Ver solicitudes
                            </a>
                        </div>
                    </section>
                </div>
            </div>

            <div className="alert alert-info mt-4">
                Los formularios utilizan GET y POST tradicionales. El
                navegador recarga la pagina para mostrar la respuesta.
            </div>
        </main>
    );
}

export default App;