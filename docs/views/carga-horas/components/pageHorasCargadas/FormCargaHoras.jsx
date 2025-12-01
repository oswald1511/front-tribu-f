import React, { useState } from "react";
import LabelRecurso from "./labelsForm/LabelRecurso";
import LabelProyecto from "./labelsForm/LabelProyecto";
import LabelTarea from "./labelsForm/LabelTarea";
import "../layout/stylePSA.css";
import axios from "axios";

export default function FormCargaHoras({ onFormSubmit, onRecursoChange }) {
  const hoy = new Date().toISOString().split("T")[0];
  const [recurso, setRecurso] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [tarea, setTarea] = useState("");
  const [fecha, setFecha] = useState(hoy);
  const [horas, setHoras] = useState("");
  const [detalle, setDetalle] = useState("");

  const [proyectoSinTareas, setProyectoSinTareas] = useState(false);

  // calcular limites de la semana actual
  function obtenerRangoSemanaActual() {
    const hoyDate = new Date();
    const dia = hoyDate.getDay();

    const lunes = new Date(hoyDate);
    lunes.setDate(hoyDate.getDate() - (dia === 0 ? 6 : dia - 1));

    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    function aISO(d) {
      return d.toISOString().split("T")[0];
    }

    return {
      min: aISO(lunes),
      max: aISO(domingo),
    };
  }

  const rango = obtenerRangoSemanaActual();

  async function sendForm(event) {
    event.preventDefault();

    if (!proyecto || proyecto === "") {
      alert("Debe seleccionar un Proyecto para poder cargar horas.");
      return;
    }

    if (!tarea || tarea === "" || tarea === "no-tareas") {
      alert(
        "Este proyecto no tiene tareas asociadas actualmente. No se pueden cargar horas."
      );
      return;
    }

    try {
      await axios.post("https://backend-carga-horas.onrender.com/api/horas", {
        recursoId: recurso,
        proyectoId: proyecto,
        tareaId: tarea,
        detalle: detalle,
        fecha,
        horas: parseFloat(horas),
      });

      onFormSubmit?.();
      alert("Horas cargadas correctamente");

      setHoras("");
      setFecha(new Date().toISOString().split("T")[0]);
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
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "25px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div className="filter-group">
          <div className="select-wrapper">
            <LabelRecurso
              valorInicial={recurso}
              onSelectRecurso={(id) => {
                setRecurso(id);
                onRecursoChange?.(id);
              }}
            />
          </div>
        </div>
        <div className="filter-group">
          <div className="select-wrapper">
            <LabelProyecto
              valorInicial={proyecto}
              onSelectProyect={setProyecto}
            />
          </div>
        </div>

        <div className="filter-group">
          <div className="select-wrapper">
            <LabelTarea
              proyectoId={proyecto}
              valorInicial={tarea}
              recursoId={recurso}
              onSelectTarea={setTarea}
              onProyectoSinTareasChange={setProyectoSinTareas}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          alignItems: "flex-end",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {/* FECHA */}
        <div className="filter-group">
          <label>Fecha</label>
          <input
            type="date"
            className="input-psa"
            style={{ width: "160px" }}
            value={fecha}
            min={rango.min}
            max={hoy}
            onChange={(e) => {
              const f = e.target.value;
              if (f < rango.min || f > rango.max) return;
              setFecha(f);
            }}
            required
            disabled={proyectoSinTareas}
          />
        </div>

        <div className="filter-group">
          <label>Horas</label>
          <input
            type="number"
            placeholder="8.0"
            step="0.5"
            min="0.5"
            className="input-psa"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            required
            disabled={proyectoSinTareas}
          />
        </div>

        <div className="filter-group">
          <label>Detalle</label>
          <input
            type="text"
            placeholder="Descripción..."
            className="input-psa"
            style={{ width: "250px" }}
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            disabled={proyectoSinTareas}
          />
        </div>

        <button
          id="btn-registrar-horas"
          className="btn-preload"
          type="submit"
          style={{ marginTop: "22px" }}
        >
          <i className="fas fa-plus" /> Registrar Horas
        </button>
      </div>
    </form>
  );
}
