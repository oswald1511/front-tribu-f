import React from "react";
import "./SemanaGridHorasPorRecurso.css";

const COLORES_PROYECTO_FIJOS = [
  "#A3D9FF",
  "#FFB3C6",
  "#B5E8A9",
  "#FDE2A0",
  "#D7C6FF",
  "#FFCFA8",
  "#B8F1F0",
  "#FFDFDF",
];

function colorFijoProyecto(nombre) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = (hash + nombre.charCodeAt(i)) % 9999;
  }
  return COLORES_PROYECTO_FIJOS[hash % COLORES_PROYECTO_FIJOS.length];
}

export default function SemanaGridHorasPorRecurso({
  horas,
  modoProyecto = "Uno",
  onColoresReady,
}) {
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

  function diaSemana(fechaStr) {
    const fecha = parseFecha(fechaStr);
    const jsDay = fecha.getUTCDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }

  React.useEffect(() => {
    if (modoProyecto === "Todos") {
      const coloresProy = {};
      horas.forEach((h) => {
        coloresProy[h.nombreProyecto] = colorFijoProyecto(h.nombreProyecto);
      });
      onColoresReady?.(coloresProy);
    } else {
      const coloresTareas = {};
      horas.forEach((h) => {
        coloresTareas[h.nombreTarea] = colorFijoProyecto(h.nombreTarea);
      });
      onColoresReady?.(coloresTareas);
    }
  }, [horas, modoProyecto]);

  function colorDeBloque(h) {
    if (modoProyecto === "Todos") {
      return colorFijoProyecto(h.nombreProyecto);
    }
    return colorFijoProyecto(h.nombreTarea);
  }

  return (
    <div className="week-grid">
      {dias.map((dia, indexDia) => (
        <div key={dia} className="day-column">
          <div className="day-header">{dia}</div>

          {horas
            .filter((h) => diaSemana(h.fecha) === indexDia)
            .map((h) => (
              <div
                key={h.id}
                className="bloque-hora"
                style={{
                  backgroundColor: colorDeBloque(h),
                  height: `${h.horas * PIXELES_POR_HORA}px`,
                }}
              >
                <p>
                  <strong>{h.horas} horas</strong>
                </p>
                <p>{h.nombreTarea}</p>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
