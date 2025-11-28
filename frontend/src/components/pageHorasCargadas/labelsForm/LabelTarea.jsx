import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LabelTarea({
  recursoId = "",
  proyectoId = "",
  onSelectTarea,
  valorInicial = "",
}) {
  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(valorInicial);

  // Cuando cambia el proyecto o el recurso → resetear tarea
  useEffect(() => {
    setTareaSeleccionada("");
    setTareas([]);
  }, [proyectoId, recursoId]);

  // Cargar tareas
  useEffect(() => {
    if (!proyectoId) return; // si no hay proyecto, no hago nada

    const url = recursoId
      ? `https://backend-carga-horas.onrender.com/api/tareas/recurso/${recursoId}/proyecto/${proyectoId}`
      : `https://backend-carga-horas.onrender.com/api/tareas/proyecto/${proyectoId}`;

    axios
      .get(url)
      .then((resp) => {
        setTareas(resp.data);

        // Si editar → cargar valor inicial SOLO UNA VEZ
        if (valorInicial) {
          setTareaSeleccionada(valorInicial);
        }
      })
      .catch((err) => {
        console.error("Error al obtener tareas:", err);
      });
  }, [proyectoId, recursoId]);

  function handleTareaChange(event) {
    const value = event.target.value;
    setTareaSeleccionada(value);
    onSelectTarea?.(value);
  }

  return (
    <div>
      <label>Tarea</label>
      <select
        value={tareaSeleccionada}
        onChange={handleTareaChange}
        disabled={!proyectoId}
        required
      >
        <option value="">
          {tareas.length > 0
            ? "Seleccione una tarea..."
            : "Seleccione un proyecto primero"}
        </option>

        {tareas.map((tarea) => (
          <option key={tarea.id} value={tarea.id}>
            {tarea.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
