import React from "react";
import FormCargaHoras from "./FormCargaHoras";
import "./FormCargaHoras.css";

export default function CargaHoras({ recursoId, onFormSubmit }) {
  return (
    <div className="carga-horas-container">
      <div className="titlespace"></div>

      <FormCargaHoras recursoId={recursoId} onFormSubmit={onFormSubmit} />
    </div>
  );
}
