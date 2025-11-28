import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SemanaGrid.css";
import ModalEditarTarea from "./editarTareaModal/ModalEditarTarea";

export default function SemanaGrid({ horas, onDelete, onUpdate }) {
  const [tareaEditando, setTareaEditando] = useState(null);

  const dias = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const PIXELES_POR_HORA = 60;

  function parseFecha(f) {
    const [y, m, d] = f.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  const horasSemana = horas;

  const [colores, setColores] = useState(() => {
    return JSON.parse(localStorage.getItem("taskColors") || "{}");
  });

  useEffect(() => {
    const nuevos = { ...colores };
    let cambio = false;

    horasSemana.forEach((h) => {
      if (!nuevos[h.nombreTarea]) {
        nuevos[h.nombreTarea] = generarColor();
        cambio = true;
      }
    });

    if (cambio) {
      setColores(nuevos);
      localStorage.setItem("taskColors", JSON.stringify(nuevos));
    }
  }, [horasSemana]);

  function generarColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  }

  function diaSemana(fechaStr) {
    const fecha = parseFecha(fechaStr);
    const jsDay = fecha.getUTCDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }

  function editarHora(hora) {
    setTareaEditando(hora);
  }

  async function eliminarHora(id) {
    try {
      await axios.delete(
        `https://backend-carga-horas.onrender.com/api/horas/${id}`
      );
      onDelete?.(id);
    } catch (err) {
      console.error("Error eliminando hora:", err);
    }
  }

  async function guardarCambios(horaEditada) {
    try {
      const resp = await axios.put(
        `https://backend-carga-horas.onrender.com/api/horas/${horaEditada.id}`,
        horaEditada
      );

      const actualizada = resp.data;

      onUpdate(actualizada);
      setTareaEditando(null);
    } catch (err) {
      console.error("Error actualizando hora:", err);
    }
  }

  return (
    <div className="week-grid">
      {dias.map((dia, indexDia) => (
        <div key={dia} className="day-column">
          <div className="day-header">{dia}</div>

          {horasSemana
            .filter((h) => diaSemana(h.fecha) === indexDia)
            .map((h) => (
              <div
                key={h.id}
                className="bloque-hora"
                style={{
                  backgroundColor: colores[h.nombreTarea],
                  height: `${h.horas * PIXELES_POR_HORA}px`,
                }}
              >
                <p>
                  <strong>{h.horas} horas</strong>
                </p>
                <p>{h.nombreTarea}</p>

                <div className="acciones">
                  <button className="link-btn" onClick={() => editarHora(h)}>
                    editar
                  </button>
                  <button
                    className="link-btn"
                    onClick={() => eliminarHora(h.id)}
                  >
                    eliminar
                  </button>
                </div>
              </div>
            ))}
        </div>
      ))}

      {tareaEditando && (
        <ModalEditarTarea
          task={tareaEditando}
          onClose={() => setTareaEditando(null)}
          onSave={guardarCambios}
        />
      )}
    </div>
  );
}
