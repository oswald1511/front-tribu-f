import React, { useEffect, useState } from "react";
import axios from "axios";
import SemanaGrid from "./SemanaGrid";

export default function HorasCargadas({ recursoId, recargar }) {
  const [horas, setHoras] = useState([]);

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];

    axios
      .get(
        `https://backend-carga-horas.onrender.com/api/horas/recurso/${recursoId}/semana`,
        { params: { fecha: hoy } }
      )
      .then((response) => setHoras(response.data))
      .catch((error) => console.error("Error fetching hours:", error));
  }, [recursoId, recargar]);

  function handleDelete(idEliminado) {
    setHoras((prev) => prev.filter((h) => h.id !== idEliminado));
  }

  function handleUpdate(updatedHour) {
    setHoras((prev) =>
      prev.map((h) => (h.id === updatedHour.id ? updatedHour : h))
    );
  }

  return (
    <div className="grid-container">
      <SemanaGrid
        horas={horas}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
