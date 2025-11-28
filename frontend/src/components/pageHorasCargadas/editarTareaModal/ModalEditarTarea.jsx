import React, { useState, useEffect } from "react";
import "./ModalEditarTarea.css";

import LabelProyecto from "../labelsForm/LabelProyecto";
import LabelTarea from "../labelsForm/LabelTarea";
import LabelFecha from "../labelsForm/LabelFecha";

export default function ModalEditarTarea({ task, onClose, onSave }) {
  const [project, setProject] = useState("");
  const [tarea, setTarea] = useState("");
  const [day, setDay] = useState("");
  const [hours, setHours] = useState(0);

  useEffect(() => {
    if (task) {
      setProject(task.proyectoId);
      setTarea(task.tareaId);
      setDay(task.fecha);
      setHours(task.horas);
    }
  }, [task]);

  function handleConfirm() {
    onSave({
      id: task.id,
      recursoId: task.recursoId,
      proyectoId: project,
      tareaId: tarea,
      fecha: day,
      horas: Number(hours),
    });
  }

  const puedeConfirmar =
    project !== "" && tarea !== "" && day !== "" && hours > 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Botón cerrar */}
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        {/* Título */}
        <h2 className="modal-title">Editar tarea</h2>

        {/* FORM */}
        <div className="modal-form">
          {/* Proyecto */}
          <div className="form-group">
            <LabelProyecto
              recursoId={task.recursoId}
              valorInicial={project}
              onSelectProyect={setProject}
            />
          </div>

          {/* Tarea */}
          <div className="form-group">
            <LabelTarea
              recursoId={task.recursoId}
              proyectoId={project}
              valorInicial={tarea}
              onSelectTarea={setTarea}
            />
          </div>

          {/* Fecha */}
          <div className="form-group">
            <LabelFecha valorInicial={day} onSelectFecha={setDay} />
          </div>

          {/* Horas */}
          <div className="form-group">
            <label className="modal-label">Horas</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="20"
              className="modal-input"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="modal-buttons">
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={!puedeConfirmar}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
