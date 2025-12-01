import NavigationBar from "../layout/NavigationBar";
import { useState, useEffect } from "react";
import "./PageCostosPorProyecto.css";
import "../layout/stylePSA.css";

export default function PageCostosPorProyecto({
  recursoInfo,
  onCerrarSesion,
  onNavigate,
}) {
  const [proyectos, setProyectos] = useState([]);
  const [proyecto, setProyecto] = useState("");

  const [desdeMes, setDesdeMes] = useState("");
  const [hastaMes, setHastaMes] = useState("");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showNoTareasModal, setShowNoTareasModal] = useState(false);
  const [proyectoSinTareas, setProyectoSinTareas] = useState(false);

  useEffect(() => {
    fetch("https://backend-carga-horas.onrender.com/api/proyectos")
      .then((r) => r.json())
      .then(setProyectos)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!proyecto) {
      setProyectoSinTareas(false);
      return;
    }

    fetch(
      `https://backend-carga-horas.onrender.com/api/tareas/proyecto/${proyecto}`
    )
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text();
          setProyectoSinTareas(true);
          setShowNoTareasModal(true);
          return;
        }

        const tareas = await r.json();
        if (tareas.length === 0) {
          setProyectoSinTareas(true);
          setShowNoTareasModal(true);
        } else {
          setProyectoSinTareas(false);
        }
      })
      .catch(() => {
        setProyectoSinTareas(true);
        setShowNoTareasModal(true);
      });
  }, [proyecto]);

  const buscar = async () => {
    if (proyectoSinTareas) return;
    if (!proyecto || !desdeMes || !hastaMes) return;

    setLoading(true);
    setData(null);

    try {
      const resp = await fetch(
        `https://backend-carga-horas.onrender.com/api/proyectos/${proyecto}/costos?desde=${desdeMes}&hasta=${hastaMes}`
      );

      if (!resp.ok) {
        const mensaje = await resp.text();
        setErrorMsg(mensaje);
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      const json = await resp.json();
      setData(json);
    } catch (e) {
      setErrorMsg(e.message);
      setShowErrorModal(true);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="app-container">
        <NavigationBar
          recurso={recursoInfo}
          onCerrarSesion={onCerrarSesion}
          onNavigate={onNavigate}
          active="costos"
        />

        <main className="main-content">
          <div className="sub-nav-container">
            <nav className="nav-switch">
              <span
                className="nav-switch-item active"
                onClick={() => onNavigate("costos")}
              >
                Costo por proyecto
              </span>
              <span
                className="nav-switch-item"
                onClick={() => onNavigate("horas")}
              >
                Horas por recurso
              </span>
              <span
                className="nav-switch-item"
                onClick={() => onNavigate("cargar")}
              >
                Cargar horas
              </span>
            </nav>
          </div>

          <h1 className="page-title">Costos por Proyecto</h1>

          <div className="page-content">
            {/* FORMULARIO */}
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                marginBottom: "30px",
                width: "100%",
              }}
            >
              <form
                className="filters"
                onSubmit={(e) => {
                  e.preventDefault();
                  buscar();
                }}
              >
                {/* selector proyecto */}
                <div className="filter-group">
                  <label>Proyecto</label>
                  <div className="select-wrapper">
                    <select
                      value={proyecto}
                      onChange={(e) => setProyecto(e.target.value)}
                      required
                    >
                      <option value="">Seleccionar…</option>
                      {proyectos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* desde */}
                <div className="filter-group">
                  <label>Desde</label>
                  <input
                    type="month"
                    className="input-psa"
                    value={desdeMes}
                    onChange={(e) => setDesdeMes(e.target.value)}
                    required
                    disabled={proyectoSinTareas}
                  />
                </div>

                {/* hasta */}
                <div className="filter-group">
                  <label>Hasta</label>
                  <input
                    type="month"
                    className="input-psa"
                    value={hastaMes}
                    onChange={(e) => setHastaMes(e.target.value)}
                    required
                    disabled={proyectoSinTareas}
                  />
                </div>

                {/* botón */}
                <button
                  type="submit"
                  className="btn-preload"
                  disabled={proyectoSinTareas}
                >
                  Buscar
                </button>
              </form>
            </div>

            {loading && <p style={{ marginTop: "20px" }}>Cargando...</p>}

            {/* TABLA */}
            {data && (
              <div
                className="tabla-costos-wrapper"
                key={`${proyecto}-${desdeMes}-${hastaMes}`}
              >
                <table className="tabla-costos">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Rol</th>
                      {data.periodos.map((p) => {
                        const [year, month] = p.split("-").map(Number);
                        const fecha = new Date(year, month - 1, 1);

                        return (
                          <th key={p}>
                            {fecha.toLocaleString("es-AR", { month: "long" })}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {data.costosPorRecurso.map((recurso) => (
                      <tr key={recurso.recursoId}>
                        <td>{recurso.nombreRecurso}</td>
                        <td>
                          {recurso.nombreRol}
                          {recurso.experiencia ? ` ${recurso.experiencia}` : ""}
                        </td>

                        {data.periodos.map((periodo) => {
                          const costoMes = data.costosPorMes.find(
                            (c) =>
                              c.recursoId?.trim() ===
                                recurso.recursoId?.trim() &&
                              c.mes?.trim() === periodo?.trim()
                          );

                          return (
                            <td key={periodo}>
                              {costoMes
                                ? `${
                                    costoMes.horasTrabajadas
                                  } h — ${costoMes.costoRecurso.toFixed(2)}`
                                : ""}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    <tr className="fila-total">
                      <td colSpan={2} className="total-label">
                        Total
                      </td>

                      {data.periodos.map((periodo) => (
                        <td key={periodo}>
                          {data.costoTotalPorMes?.[periodo] != null
                            ? data.costoTotalPorMes[periodo].toFixed(2)
                            : ""}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* MODAL ERROR COSTO */}
        {showErrorModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Error</h2>
              <p>{errorMsg}</p>
              <button
                className="btn-preload"
                onClick={() => setShowErrorModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* MODAL PROYECTO SIN TAREAS */}
        {showNoTareasModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Sin tareas</h2>
              <p>Este proyecto no tiene tareas asociadas.</p>
              <button
                className="btn-preload"
                onClick={() => setShowNoTareasModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
