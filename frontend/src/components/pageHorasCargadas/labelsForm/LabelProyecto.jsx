import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LabelProyecto({ onSelectProyect, valorInicial = "" }) {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] =
    useState(valorInicial);

  useEffect(() => {
    setProyectoSeleccionado(valorInicial || "");
  }, [valorInicial]);

  useEffect(() => {
    axios
      .get("https://backend-carga-horas.onrender.com/api/proyectos")
      .then((resp) => setProyectos(resp.data))
      .catch((err) => console.error("Error obteniendo proyectos:", err));
  }, []);

  function handleProyectoChange(event) {
    const value = event.target.value;
    setProyectoSeleccionado(value);
    onSelectProyect?.(value);
  }

  return (
    <div>
      <label>Proyecto</label>
      <select value={proyectoSeleccionado} onChange={handleProyectoChange}>
        <option value="">Seleccione un proyecto...</option>

        {proyectos.map((proyecto) => (
          <option key={proyecto.id} value={proyecto.id}>
            {proyecto.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
