import { useState } from "react";
import PageCargaHoras from "./components/pageHorasCargadas/PageCargaHoras";
import PageHorasPorRecurso from "./components/pageHorasPorRecurso/PageHorasPorRecurso";
import PageCostosPorProyecto from "./components/pageCostosPorProyecto/PageCostosPorProyecto";

export default function App() {
  const [pantalla, setPantalla] = useState("cargar");

  function navegarA(pag) {
    setPantalla(pag);
  }

  return (
    <>
      {pantalla === "cargar" && (
        <PageCargaHoras onNavigate={navegarA} active={pantalla} />
      )}

      {pantalla === "horas" && (
        <PageHorasPorRecurso onNavigate={navegarA} active={pantalla} />
      )}

      {pantalla === "costos" && (
        <PageCostosPorProyecto onNavigate={navegarA} active={pantalla} />
      )}
    </>
  );
}
