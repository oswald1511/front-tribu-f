import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LabelTarea({
  proyectoId = "",
  recursoId = "",
  onSelectTarea,
  valorInicial = "",
  onProyectoSinTareasChange,
}) {
  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(valorInicial);

  useEffect(() => {
    setTareaSeleccionada("");
    setTareas([]);
    onProyectoSinTareasChange?.(false);
  }, [proyectoId, recursoId]);

  useEffect(() => {
    if (!proyectoId || !recursoId) return;

    const url = `https://backend-carga-horas.onrender.com/api/tareas/recurso/${recursoId}/proyecto/${proyectoId}`;

    axios
      .get(url)
      .then((resp) => {
        const lista = resp.data || [];
        setTareas(lista);

        const sinTareas = lista.length === 0;
        onProyectoSinTareasChange?.(sinTareas);

        if (!sinTareas && valorInicial) {
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
        disabled={!proyectoId || !recursoId || tareas.length === 0}
        required
      >
        <option value="">
          {!proyectoId
            ? "Seleccione un proyecto primero"
            : !recursoId
            ? "Seleccione un recurso primero"
            : tareas.length === 0
            ? "No tienes tareas asignadas"
            : "Seleccione una tarea..."}
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
