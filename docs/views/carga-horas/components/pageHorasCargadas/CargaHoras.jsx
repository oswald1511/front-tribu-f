import React, { useState, useEffect } from "react";
import FormCargaHoras from "./FormCargaHoras";
import SemanaGrid from "./SemanaGrid";
import axios from "axios";

export default function CargaHoras() {
  const [recursoSeleccionado, setRecursoSeleccionado] = useState("");
  const [horasSemana, setHorasSemana] = useState([]);

  useEffect(() => {
    if (!recursoSeleccionado) {
      setHorasSemana([]);
      return;
    }

    const hoy = new Date().toISOString().split("T")[0];

    axios
      .get(
        `https://backend-carga-horas.onrender.com/api/horas/recurso/${recursoSeleccionado}/semana`,
        { params: { fecha: hoy } }
      )
      .then((res) => {
        setHorasSemana(res.data);
      })
      .catch((err) => console.error("Error cargando horas semanales:", err));
  }, [recursoSeleccionado]);

  async function refreshSemana() {
    if (!recursoSeleccionado) return;
    const hoy = new Date().toISOString().split("T")[0];

    const res = await axios.get(
      `https://backend-carga-horas.onrender.com/api/horas/recurso/${recursoSeleccionado}/semana`,
      { params: { fecha: hoy } }
    );

    setHorasSemana(res.data);
  }

  return (
    <div className="carga-horas-container">
      <FormCargaHoras
        onRecursoChange={setRecursoSeleccionado}
        onFormSubmit={refreshSemana}
      />

      <h3 style={{ marginTop: "35px" }}>Horas del recurso</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "15px",
          marginBottom: "25px",
        }}
      >
        {(() => {
          const colores = JSON.parse(
            localStorage.getItem("projectColors") || "{}"
          );

          return Object.keys(colores).map((key) => {
            const nombreProyecto = key.replace("PROY_", "");
            const color = colores[key];

            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  border: "1px solid #eee",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    background: color,
                    borderRadius: "4px",
                  }}
                />

                <span style={{ fontSize: "15px", color: "#333" }}>
                  {nombreProyecto}
                </span>
              </div>
            );
          });
        })()}
      </div>

      <SemanaGrid
        horas={horasSemana}
        onDelete={refreshSemana}
        onUpdate={refreshSemana}
      />
    </div>
  );
}
