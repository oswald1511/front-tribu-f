import { useState, useEffect } from "react";
import axios from "axios";
import "../layout/stylePSA.css";

export default function FormFiltroHoras({ onBuscar }) {
  const [recursoId, setRecursoId] = useState("");
  const [proyecto, setProyecto] = useState("Todos");
  const [fechaSemana, setFechaSemana] = useState("");

  const [recursos, setRecursos] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    axios
      .get("https://backend-carga-horas.onrender.com/api/recursos")
      .then((resp) => setRecursos(resp.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get("https://backend-carga-horas.onrender.com/api/proyectos")
      .then((resp) => setProyectos(resp.data))
      .catch(() => {});
  }, []);

  async function handleProyectoChange(e) {
    const nuevoProyecto = e.target.value;
    setProyecto(nuevoProyecto);

    if (nuevoProyecto === "Todos") return;

    if (!recursoId) return;

    try {
      const url = `https://backend-carga-horas.onrender.com/api/tareas/recurso/${recursoId}/proyecto/${nuevoProyecto}`;
      const resp = await axios.get(url);

      if (!resp.data || resp.data.length === 0) {
        setErrorMsg("Este recurso no tiene tareas asignadas en este proyecto.");
        setShowErrorModal(true);

        // resetear a "Todos"
        setProyecto("Todos");
        return;
      }
    } catch (err) {
      setErrorMsg(
        "No se pudieron obtener las tareas del recurso para este proyecto."
      );
      setShowErrorModal(true);
      setProyecto("Todos");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onBuscar?.({ recursoId, fechaSemana, proyecto });
  }

  return (
    <>
      <form className="filters" onSubmit={handleSubmit}>
        {/* Recurso */}
        <div className="filter-group">
          <label>Recurso</label>
          <div className="select-wrapper">
            <select
              value={recursoId}
              onChange={(e) => setRecursoId(e.target.value)}
              className="input-psa"
              required
            >
              <option value="">Seleccione…</option>
              {recursos.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre} {r.apellido}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Proyecto */}
        <div className="filter-group">
          <label>Proyecto</label>
          <div className="select-wrapper">
            <select
              value={proyecto}
              onChange={handleProyectoChange}
              className="input-psa"
            >
              <option value="Todos">Todos</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Semana */}
        <div className="filter-group">
          <label>Semana</label>
          <input
            type="date"
            className="input-psa"
            value={fechaSemana}
            onChange={(e) => setFechaSemana(e.target.value)}
            required
          />
        </div>

        {/* Botón */}
        <button className="btn-preload" type="submit">
          <i className="fas fa-search" /> Buscar
        </button>
      </form>

      {/* Modal de error */}
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
    </>
  );
}
