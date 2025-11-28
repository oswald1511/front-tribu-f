import { useState, useEffect } from "react";
import axios from "axios";
import "../layout/stylePSA.css";

export default function FormFiltroHoras({ onBuscar }) {
  const [recursoId, setRecursoId] = useState("");
  const [proyecto, setProyecto] = useState("Todos");
  const [fechaSemana, setFechaSemana] = useState("");

  const [recursos, setRecursos] = useState([]);
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    axios
      .get("https://backend-carga-horas.onrender.com/api/recursos")
      .then((resp) => setRecursos(resp.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!recursoId) {
      setProyectos([]);
      setProyecto("Todos");
      return;
    }

    axios
      .get(
        `https://backend-carga-horas.onrender.com/api/proyectos/recurso/${recursoId}`
      )
      .then((resp) => setProyectos(resp.data))
      .catch(() => {});
  }, [recursoId]);

  function handleSubmit(e) {
    e.preventDefault();
    if (onBuscar) onBuscar({ recursoId, fechaSemana, proyecto });
  }

  return (
    <form
      className="filters"
      onSubmit={handleSubmit}
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        alignItems: "flex-end",
      }}
    >
      {/* Recurso */}
      <div className="filter-group">
        <label>Recurso</label>
        <div className="select-wrapper">
          <select
            value={recursoId}
            onChange={(e) => setRecursoId(e.target.value)}
            className="input-std"
            style={{ borderRadius: "50px", border: "1px solid #ccc" }}
            required
          >
            <option value="">Seleccione...</option>
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
            onChange={(e) => setProyecto(e.target.value)}
            className="input-std"
            style={{ borderRadius: "50px", border: "1px solid #ccc" }}
          >
            <option value="Todos">Todos</option>
            {proyectos.map((p) => (
              <option key={p.id} value={p.nombre}>
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
          className="input-std"
          style={{
            padding: "10px",
            borderRadius: "50px",
            border: "1px solid #ccc",
          }}
          value={fechaSemana}
          onChange={(e) => setFechaSemana(e.target.value)}
          required
        />
      </div>

      {/* Botón */}
      <button
        className="btn-preload"
        type="submit"
        style={{ marginLeft: "auto" }}
      >
        <i className="fas fa-search" /> Buscar
      </button>
    </form>
  );
}
