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

  useEffect(() => {
    const cargarProyectos = async () => {
      try {
        const resp = await fetch(
          "https://backend-carga-horas.onrender.com/api/proyectos"
        );
        const json = await resp.json();
        setProyectos(json);
      } catch (e) {
        console.error("Error al cargar proyectos:", e);
      }
    };

    cargarProyectos();
  }, []);

  const buscar = async () => {
    if (!proyecto || !desdeMes || !hastaMes) return;

    setLoading(true);

    try {
      const resp = await fetch(
        `https://backend-carga-horas.onrender.com/api/proyectos/${proyecto}/costos?desde=${desdeMes}&hasta=${hastaMes}`
      );
      const json = await resp.json();
      setData(json);
    } catch (e) {
      console.error("Error:", e);
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
          {/* NAV SWITCH */}
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

          {/* TÍTULO */}
          <h1 className="page-title">Costos por Proyecto</h1>

          <div className="page-content">
            {/* FILTRO CON DISEÑO DE FORMULARIO PSA */}
            <form
              className="filters"
              onSubmit={(e) => {
                e.preventDefault();
                buscar();
              }}
            >
              {/* PROYECTO */}
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

              {/* DESDE */}
              <div className="filter-group">
                <label>Desde</label>
                <input
                  type="month"
                  className="input-std"
                  value={desdeMes}
                  onChange={(e) => setDesdeMes(e.target.value)}
                  required
                />
              </div>

              {/* HASTA */}
              <div className="filter-group">
                <label>Hasta</label>
                <input
                  type="month"
                  className="input-std"
                  value={hastaMes}
                  onChange={(e) => setHastaMes(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-preload">
                Buscar
              </button>
            </form>

            {/* LOADING */}
            {loading && <p style={{ marginTop: "20px" }}>Cargando...</p>}

            {/* TABLA */}
            {data && (
              <div className="tabla-costos-wrapper">
                <table className="tabla-costos">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Rol</th>
                      {data.periodos.map((p) => (
                        <th key={p}>
                          {new Date(p + "-01").toLocaleString("es-AR", {
                            month: "long",
                          })}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {data.costosPorRecurso.map((recurso) => (
                      <tr key={recurso.recursoId}>
                        <td>{recurso.nombreRecurso}</td>
                        <td>{recurso.nombreRol}</td>

                        {data.periodos.map((periodo) => {
                          const costoMes = data.costosPorMes.find(
                            (c) =>
                              c.recursoId?.trim() ===
                                recurso.recursoId?.trim() &&
                              c.mes?.trim() === periodo?.trim()
                          );

                          return (
                            <td key={periodo}>
                              {costoMes ? costoMes.costoRecurso.toFixed(2) : ""}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* TOTAL */}
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
      </div>
    </>
  );
}
