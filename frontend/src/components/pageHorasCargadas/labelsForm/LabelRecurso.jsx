import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LabelRecurso({ onSelectResource, valorInicial = "" }) {
  const [recursos, setRecursos] = useState([]);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState(valorInicial);

  useEffect(() => {
    axios
      .get("https://backend-carga-horas.onrender.com/api/recursos")
      .then((res) => setRecursos(res.data))
      .catch((err) => console.error("Error al cargar recursos:", err));
  }, []);

  function handleRecursoChange(event) {
    const value = event.target.value;
    setRecursoSeleccionado(value);
    onSelectResource?.(value);
  }

  return (
    <div>
      <label>Recurso</label>
      <select
        value={recursoSeleccionado}
        onChange={handleRecursoChange}
        required
      >
        <option value="">Seleccione un recurso...</option>

        {recursos.map((r) => (
          <option key={r.id} value={r.id}>
            {r.nombre} {r.apellido}
          </option>
        ))}
      </select>
    </div>
  );
}
