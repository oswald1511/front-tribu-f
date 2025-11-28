import React, { useState, useEffect } from "react";

export default function LabelFecha({ valorInicial = "", onSelectFecha }) {
  const hoy = new Date().toISOString().split("T")[0];
  const fechaInicial = valorInicial || hoy;

  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaInicial);

  useEffect(() => {
    if (valorInicial) {
      setFechaSeleccionada(valorInicial);
    }
  }, [valorInicial]);

  useEffect(() => {
    if (onSelectFecha) {
      onSelectFecha(fechaSeleccionada);
    }
  }, [fechaSeleccionada]);

  return (
    <div>
      <label>Fecha</label>
      <input
        type="date"
        value={fechaSeleccionada}
        onChange={(e) => setFechaSeleccionada(e.target.value)}
        required
      />
    </div>
  );
}
