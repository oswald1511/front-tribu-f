import React, { useState } from "react";
import CargaHoras from "./CargaHoras";
import HorasCargadas from "./HorasCargadas";
import NavigationBar from "../layout/NavigationBar";
import "../layout/stylePSA.css";

export default function PageCargaHoras({
  recursoId,
  recurso: recursoInfo,
  onCerrarSesion,
  onNavigate,
}) {
  const [recargar, setRecargar] = useState(false);

  const handleFormSubmit = () => {
    setRecargar((prev) => !prev);
  };

  return (
    <>
      <div className="app-container">
        <NavigationBar
          recurso={recursoInfo}
          onCerrarSesion={onCerrarSesion}
          onNavigate={onNavigate}
          active="cargar"
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

              <span
                className="nav-switch-item"
                onClick={() => onNavigate("horas")}
              >
                Horas por recurso
              </span>

              <span
                className="nav-switch-item active"
                onClick={() => onNavigate("cargar")}
              >
                Cargar horas
              </span>
            </nav>
          </div>

          <h1 className="page-title">Carga de horas</h1>

          <div className="page-content">
            <CargaHoras recursoId={recursoId} onFormSubmit={handleFormSubmit} />
          </div>
        </main>
      </div>
    </>
  );
}
