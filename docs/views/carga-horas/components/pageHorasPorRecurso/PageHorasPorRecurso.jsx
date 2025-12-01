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
  const [colores, setColores] = useState({});

  function obtenerRangoSemana(fecha) {
    const start = dayjs(fecha).startOf("week").add(1, "day");
    const end = start.add(6, "day");
    return { start, end };
  }

  async function buscarHoras({ recursoId, fechaSemana, proyecto }) {
    if (!fechaSemana) return;

    setUltimaBusqueda({ recursoId, fechaSemana, proyecto });
    setFechaActual(fechaSemana);

    const { start } = obtenerRangoSemana(fechaSemana);

    const queryProyecto =
      proyecto && proyecto !== "Todos" ? `&proyectoId=${proyecto}` : "";

    try {
      const resp = await axios.get(
        `https://backend-carga-horas.onrender.com/api/horas/recurso/${recursoId}/semana?fecha=${start.format(
          "YYYY-MM-DD"
        )}${queryProyecto}`
      );

      setHoras(resp.data);
    } catch {
      setHoras([]);
    }
  }

  function cambiarSemana(dias) {
    if (!fechaActual || !ultimaBusqueda) return;

    const nuevaFecha = dayjs(fechaActual).add(dias, "day").format("YYYY-MM-DD");

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

  const resumenProyectos = horas.reduce((acc, h) => {
    if (!acc[h.nombreProyecto]) {
      acc[h.nombreProyecto] = { horas: 0 };
    }
    acc[h.nombreProyecto].horas += h.horas;
    return acc;
  }, {});

  return (
    <div className="app-container">
      <NavigationBar
        recurso={recursoInfo}
        onCerrarSesion={onCerrarSesion}
        onNavigate={onNavigate}
        active="horas"
      />

      <main className="main-content">
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

        <h1 className="page-title">Horas por Recurso</h1>

        <div className="page-content">
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              marginBottom: "30px",
              width: "100%",
            }}
          >
            <FormFiltroHoras onBuscar={buscarHoras} />
          </div>

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

          <SemanaGridHorasPorRecurso
            horas={horas}
            modoProyecto={
              ultimaBusqueda?.proyecto === "Todos" ? "Todos" : "Uno"
            }
            onColoresReady={setColores}
          />

          <div className="mt-4 font-semibold">
            Total de horas trabajadas: {total}
          </div>
          {ultimaBusqueda?.proyecto === "Todos" && (
            <div
              style={{
                marginTop: "30px",
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                border: "1px solid #eee",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  marginBottom: "15px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Resumen por Proyecto
              </h2>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 10px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        color: "#555",
                      }}
                    >
                      Color
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        color: "#555",
                      }}
                    >
                      Proyecto
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        color: "#555",
                      }}
                    >
                      Horas
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Object.keys(resumenProyectos).map((proy) => (
                    <tr
                      key={proy}
                      style={{
                        background: "#fafafa",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "4px",
                            background: colores[proy],
                          }}
                        />
                      </td>

                      <td style={{ padding: "12px", fontWeight: "500" }}>
                        {proy}
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          fontWeight: "600",
                          textAlign: "right",
                        }}
                      >
                        {resumenProyectos[proy].horas} h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
