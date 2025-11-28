import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import NavigationBar from "../layout/NavigationBar";
import FormFiltroHoras from "./FormFiltroHoras";
import SemanaGridHorasPorRecurso from "./SemanaGridHorasPorRecurso";
import "../layout/stylePSA.css";

export default function PageHorasPorRecurso({
  recursoInfo,
  onCerrarSesion,
  onNavigate,
}) {
  const [horas, setHoras] = useState([]);
  const [ultimaBusqueda, setUltimaBusqueda] = useState(null);
  const [fechaActual, setFechaActual] = useState("");

  function obtenerRangoSemana(fecha) {
    const start = dayjs(fecha).startOf("week").add(1, "day"); // lunes
    const end = start.add(6, "day"); // domingo
    return { start, end };
  }

  async function buscarHoras({ recursoId, fechaSemana, proyecto }) {
    if (!fechaSemana) return;

    setUltimaBusqueda({ recursoId, fechaSemana, proyecto });
    setFechaActual(fechaSemana);

    const { start } = obtenerRangoSemana(fechaSemana);

    try {
      const resp = await axios.get(
        `https://backend-carga-horas.onrender.com/api/horas/recurso/${recursoId}/semana?fecha=${start.format(
          "YYYY-MM-DD"
        )}`
      );

      let data = resp.data;

      if (proyecto && proyecto !== "Todos") {
        data = data.filter((h) => h.nombreProyecto === proyecto);
      }

      setHoras(data);
    } catch (err) {
      console.error("Error al obtener horas:", err);
    }
  }

  function cambiarSemana(dias) {
    if (!fechaActual || !ultimaBusqueda) return;

    const nuevaFecha = dayjs(fechaActual).add(dias, "day").format("YYYY-MM-DD");
    setFechaActual(nuevaFecha);

    buscarHoras({
      recursoId: ultimaBusqueda.recursoId,
      fechaSemana: nuevaFecha,
      proyecto: ultimaBusqueda.proyecto,
    });
  }

  const mostrarTitulo = fechaActual !== "";
  const { start, end } = mostrarTitulo
    ? obtenerRangoSemana(fechaActual)
    : { start: null, end: null };

  const total = horas.reduce((acc, h) => acc + h.horas, 0);

  return (
    <>
      <div className="app-container">
        <NavigationBar
          recurso={recursoInfo}
          onCerrarSesion={onCerrarSesion}
          onNavigate={onNavigate}
          active="horas"
        />

        <main className="main-content">
          {/* Barra de switches igual a la página de carga */}
          <div className="sub-nav-container">
            <nav className="nav-switch">
              <span
                className="nav-switch-item"
                onClick={() => onNavigate("costos")}
              >
                Costo por proyecto
              </span>

              <span className="nav-switch-item active">Horas por recurso</span>

              <span
                className="nav-switch-item"
                onClick={() => onNavigate("cargar")}
              >
                Cargar horas
              </span>
            </nav>
          </div>

          {/* Título */}
          <h1 className="page-title">Horas por Recurso</h1>

          {/* Contenido principal */}
          <div className="page-content">
            <FormFiltroHoras onBuscar={buscarHoras} />

            {mostrarTitulo && (
              <div
                style={{
                  marginTop: "25px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                <button
                  onClick={() => cambiarSemana(-7)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                >
                  ⬅
                </button>

                <span>
                  Semana del {start.format("DD/MM")} al {end.format("DD/MM")}
                </span>

                <button
                  onClick={() => cambiarSemana(7)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                >
                  ➡
                </button>
              </div>
            )}

            <div className="page-content">
              <SemanaGridHorasPorRecurso horas={horas} />

              <div className="mt-4 font-semibold">
                Total de horas trabajadas: {total}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
