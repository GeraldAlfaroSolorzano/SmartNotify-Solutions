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

            <div className="row justify-content-center">
                <div className="col-lg-8">
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

                    <div className="alert alert-info mt-4">
                        El formulario utiliza POST tradicional. El
                        navegador cambia de pagina y espera la respuesta
                        del servidor.
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;