import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/solicitudes";

const formularioInicial = {
  nombreCliente: "",
  correo: "",
  asunto: "",
  descripcion: "",
};

function App() {
  const [formulario, setFormulario] = useState(formularioInicial);

  const [solicitudes, setSolicitudes] = useState([]);
  const [consultaId, setConsultaId] = useState("");
  const [solicitudConsultada, setSolicitudConsultada] = useState(null);

  const [informacionId, setInformacionId] = useState("");
  const [informacionAdicional, setInformacionAdicional] = useState("");

  const [estadoId, setEstadoId] = useState("");
  const [estado, setEstado] = useState("Pendiente");

  const [mensaje, setMensaje] = useState("");

  const cargarSolicitudes = useCallback(async function obtenerDatos() {
    try {
      const response = await fetch(API_URL);
      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.message);
      }

      setSolicitudes(function actualizarDatos(solicitudesActuales) {
        const datosActuales = JSON.stringify(solicitudesActuales);

        const datosNuevos = JSON.stringify(resultado.data);

        if (datosActuales !== datosNuevos) {
          return resultado.data;
        }

        return solicitudesActuales;
      });
    } catch (error) {
      setMensaje(error.message);
    }
  }, []);
  useEffect(
    function iniciarPolling() {
      cargarSolicitudes();

      const intervalo = setInterval(function consultarSolicitudes() {
        cargarSolicitudes();
      }, 10000);

      return function detenerPolling() {
        clearInterval(intervalo);
      };
    },
    [cargarSolicitudes],
  );

  function actualizarFormulario(event) {
    const nombre = event.target.name;
    const valor = event.target.value;

    setFormulario({
      ...formulario,
      [nombre]: valor,
    });
  }

  async function registrarSolicitud(event) {
    event.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.message);
      }

      setMensaje(resultado.message);
      setFormulario(formularioInicial);

      await cargarSolicitudes();
    } catch (error) {
      setMensaje(error.message);
    }
  }

  async function consultarSolicitud(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/${consultaId}`);

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.message);
      }

      setSolicitudConsultada(resultado.data);
      setMensaje("");
    } catch (error) {
      setSolicitudConsultada(null);
      setMensaje(error.message);
    }
  }

  async function guardarInformacion(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/${informacionId}/informacion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          informacionAdicional: informacionAdicional,
        }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.message);
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
      const response = await fetch(`${API_URL}/${estadoId}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: estado,
        }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.message);
      }

      setMensaje(resultado.message);
      setEstadoId("");

      await cargarSolicitudes();
    } catch (error) {
      setMensaje(error.message);
    }
  }

  async function cancelarSolicitud(id) {
    try {
      const response = await fetch(`${API_URL}/${id}/cancelar`, {
        method: "PUT",
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.message);
      }

      setMensaje(resultado.message);

      await cargarSolicitudes();
    } catch (error) {
      setMensaje(error.message);
    }
  }

  async function confirmarSolucion(id) {
    try {
      const response = await fetch(`${API_URL}/${id}/confirmar`, {
        method: "PUT",
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.message);
      }

      setMensaje(resultado.message);

      await cargarSolicitudes();
    } catch (error) {
      setMensaje(error.message);
    }
  }

  function mostrarMensaje() {
    if (mensaje === "") {
      return null;
    }

    return <div className="alert alert-info">{mensaje}</div>;
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
          <h3 className="h5">Solicitud #{solicitudConsultada.id}</h3>

          <p>
            <strong>Cliente:</strong> {solicitudConsultada.nombreCliente}
          </p>

          <p>
            <strong>Correo:</strong> {solicitudConsultada.correo}
          </p>

          <p>
            <strong>Asunto:</strong> {solicitudConsultada.asunto}
          </p>

          <p>
            <strong>Descripcion:</strong> {solicitudConsultada.descripcion}
          </p>

          <p>
            <strong>Informacion adicional:</strong>{" "}
            {solicitudConsultada.informacionAdicional}
          </p>

          <p>
            <strong>Estado:</strong> {solicitudConsultada.estado}
          </p>

          <p>
            <strong>Solucion confirmada:</strong>{" "}
            {mostrarConfirmacion(solicitudConsultada.solucionConfirmada)}
          </p>
        </div>
      </div>
    );
  }

  function mostrarSolicitudes() {
    if (solicitudes.length === 0) {
      return (
        <tr>
          <td className="text-center" colSpan="7">
            No existen solicitudes registradas.
          </td>
        </tr>
      );
    }

    return solicitudes.map(function crearFila(solicitud) {
      return (
        <tr key={solicitud.id}>
          <td>{solicitud.id}</td>
          <td>{solicitud.nombreCliente}</td>
          <td>{solicitud.asunto}</td>
          <td>{solicitud.estado}</td>

          <td>{mostrarConfirmacion(solicitud.solucionConfirmada)}</td>

          <td>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={function cancelar() {
                cancelarSolicitud(solicitud.id);
              }}
              type="button"
            >
              Cancelar
            </button>
          </td>

          <td>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={function confirmar() {
                confirmarSolucion(solicitud.id);
              }}
              type="button"
            >
              Confirmar solucion
            </button>
          </td>
        </tr>
      );
    });
  }

  return (
    <main className="container py-5">
      <header className="text-center mb-5">
        <h1>SmartNotify Solutions</h1>

        <p className="lead">Sistema de solicitudes de soporte tecnico</p>

        <span className="badge text-bg-warning">
          Etapa 3: Polling cada 10 segundos
        </span>
      </header>

      {mostrarMensaje()}

      <div className="row g-4">
        <div className="col-lg-7">
          <section className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 mb-4">Registrar solicitud</h2>

              <form onSubmit={registrarSolicitud}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="nombreCliente">
                    Nombre del cliente
                  </label>

                  <input
                    className="form-control"
                    id="nombreCliente"
                    name="nombreCliente"
                    onChange={actualizarFormulario}
                    required
                    type="text"
                    value={formulario.nombreCliente}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="correo">
                    Correo electronico
                  </label>

                  <input
                    className="form-control"
                    id="correo"
                    name="correo"
                    onChange={actualizarFormulario}
                    required
                    type="email"
                    value={formulario.correo}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="asunto">
                    Asunto
                  </label>

                  <input
                    className="form-control"
                    id="asunto"
                    name="asunto"
                    onChange={actualizarFormulario}
                    required
                    type="text"
                    value={formulario.asunto}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="descripcion">
                    Descripcion
                  </label>

                  <textarea
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    onChange={actualizarFormulario}
                    required
                    rows="5"
                    value={formulario.descripcion}
                  />
                </div>

                <button className="btn btn-primary" type="submit">
                  Registrar solicitud
                </button>
              </form>
            </div>
          </section>
        </div>

        <div className="col-lg-5">
          <section className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="h4 mb-4">Consultar solicitud</h2>

              <form onSubmit={consultarSolicitud}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="consultaId">
                    Identificador
                  </label>

                  <input
                    className="form-control"
                    id="consultaId"
                    min="1"
                    onChange={function cambiarId(event) {
                      setConsultaId(event.target.value);
                    }}
                    required
                    type="number"
                    value={consultaId}
                  />
                </div>

                <button className="btn btn-outline-primary" type="submit">
                  Consultar
                </button>
              </form>

              {mostrarSolicitudConsultada()}
            </div>
          </section>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <section className="card shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h4 mb-4">Agregar informacion</h2>

              <form onSubmit={guardarInformacion}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="informacionId">
                    Identificador
                  </label>

                  <input
                    className="form-control"
                    id="informacionId"
                    min="1"
                    onChange={function cambiarId(event) {
                      setInformacionId(event.target.value);
                    }}
                    required
                    type="number"
                    value={informacionId}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="informacionAdicional">
                    Informacion adicional
                  </label>

                  <textarea
                    className="form-control"
                    id="informacionAdicional"
                    onChange={function cambiarTexto(event) {
                      setInformacionAdicional(event.target.value);
                    }}
                    required
                    rows="4"
                    value={informacionAdicional}
                  />
                </div>

                <button className="btn btn-outline-secondary" type="submit">
                  Guardar informacion
                </button>
              </form>
            </div>
          </section>
        </div>

        <div className="col-lg-6">
          <section className="card shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h4 mb-4">Actualizar estado</h2>

              <form onSubmit={guardarEstado}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="estadoId">
                    Identificador
                  </label>

                  <input
                    className="form-control"
                    id="estadoId"
                    min="1"
                    onChange={function cambiarId(event) {
                      setEstadoId(event.target.value);
                    }}
                    required
                    type="number"
                    value={estadoId}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="estado">
                    Nuevo estado
                  </label>

                  <select
                    className="form-select"
                    id="estado"
                    onChange={function cambiarEstado(event) {
                      setEstado(event.target.value);
                    }}
                    value={estado}
                  >
                    <option value="Pendiente">Pendiente</option>

                    <option value="Asignada">Asignada</option>

                    <option value="En proceso">En proceso</option>

                    <option value="Finalizada">Finalizada</option>

                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>

                <button className="btn btn-outline-warning" type="submit">
                  Actualizar estado
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>

      <section className="card shadow-sm mt-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between">
            <h2 className="h4">Solicitudes registradas</h2>

            <button
              className="btn btn-outline-primary"
              onClick={cargarSolicitudes}
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

              <tbody>{mostrarSolicitudes()}</tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="alert alert-info mt-4">
        La lista se consulta automaticamente cada 10 segundos mediante polling.
      </div>
    </main>
  );
}

export default App;
