import { useState } from "react";
import "../layout/stylePSA.css";

export default function NavigationBar({ recurso, active, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">{recurso?.nombre?.[0] || "M"}</div>

        <div className="header-dropdown">
          <div className="dropbtn" onClick={() => setOpen(!open)}>
            {active === "horas" || active === "cargar" || active === "costos"
              ? "Carga de Horas"
              : "Finanzas"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                marginLeft: "8px",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.2s ease",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          {open && (
            <div className="dropdown-content show">
              <span
                onClick={() => {
                  onNavigate("cargar");
                  setOpen(false);
                }}
              >
                Carga de Horas
              </span>

              <span
                onClick={() => {
                  window.location.href =
                    "https://oswald1511.github.io/front-tribu-f/views/costo-proyecto.html";
                }}
                style={{ fontWeight: "bold", color: "var(--color-header-bg)" }}
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
  );
}
