import React, { useState } from "react";
import LabelRecurso from "./labelsForm/LabelRecurso";
import LabelProyecto from "./labelsForm/LabelProyecto";
import LabelTarea from "./labelsForm/LabelTarea";
import "../layout/stylePSA.css";
import axios from "axios";

export default function FormCargaHoras({ onFormSubmit }) {
  const [recurso, setRecurso] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [tarea, setTarea] = useState("");
  const [fecha, setFecha] = useState("");
  const [horas, setHoras] = useState("");

  async function sendForm(event) {
    event.preventDefault();

    try {
      await axios.post("https://backend-carga-horas.onrender.com/api/horas", {
        recursoId: recurso,
        proyectoId: proyecto,
        tareaId: tarea,
        fecha,
        horas: parseFloat(horas),
      });

      onFormSubmit?.();
      alert("Horas cargadas correctamente");

      setRecurso("");
      setProyecto("");
      setTarea("");
      setFecha("");
      setHoras("");
      event.target.reset();
    } catch (err) {
      console.error("Error:", err);
      alert("Error cargando horas");
    }
  }

  return (
    <form
      className="filters"
      onSubmit={sendForm}
      style={{
        alignItems: "flex-end",
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      {/* PROYECTO */}
      <div className="filter-group">
        <div className="select-wrapper">
          <LabelProyecto
            valorInicial={proyecto}
            onSelectProyect={setProyecto}
          />
        </div>
      </div>

      {/* RECURSO */}
      <div className="filter-group">
        <div className="select-wrapper">
          <LabelRecurso
            valorInicial={recurso}
            onSelectRecurso={(id) => setRecurso(id)}
          />
        </div>
      </div>

      {/* TAREA */}
      <div className="filter-group">
        <div className="select-wrapper">
          <LabelTarea
            recursoId={recurso}
            proyectoId={proyecto}
            valorInicial={tarea}
            onSelectTarea={setTarea}
          />
        </div>
      </div>

      {/* Fecha */}
      <div className="filter-group">
        <label>Fecha</label>
        <input
          type="date"
          className="input-std"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>

      {/* Horas */}
      <div className="filter-group">
        <label>Horas</label>
        <input
          type="number"
          placeholder="8.0"
          step="0.5"
          className="input-std"
          value={horas}
          onChange={(e) => setHoras(e.target.value)}
          required
        />
      </div>

      {/* Botón */}
      <button id="btn-registrar-horas" className="btn-preload" type="submit">
        <i className="fas fa-plus" /> Registrar Horas
      </button>
    </form>
  );
}
