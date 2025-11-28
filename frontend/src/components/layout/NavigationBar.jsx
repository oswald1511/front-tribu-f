import { useState } from "react";
import "../layout/stylePSA.css";

export default function NavigationBar({
  recurso,
  active,
  onNavigate,
  onCerrarSesion,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <div className="logo">{recurso?.nombre?.[0] || "?"}</div>

          <div className="header-dropdown">
            <div className="dropbtn" onClick={() => setOpen(!open)}>
              {active === "horas" || active === "cargar"
                ? "Carga de Horas"
                : "Finanzas"}
              <i className={`fas fa-chevron-down ${open ? "rotate" : ""}`}></i>
            </div>

            {open && (
              <div className="dropdown-content show">
                <span
                  onClick={() => {
                    onNavigate("horas");
                    setOpen(false);
                  }}
                >
                  Carga de Horas
                </span>

                <span
                  onClick={() => {
                    onNavigate("costos");
                    setOpen(false);
                  }}
                >
                  Finanzas
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="header-right">
          <span className="logo-psa">PSA</span>
        </div>
      </header>
    </>
  );
}
