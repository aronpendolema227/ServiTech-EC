
import { CalendarDays } from "lucide-react";
import "../styles/Header.css";

// ==========================================
// SERVITECH EC - ENCABEZADO PRINCIPAL
// ==========================================

function Header({ paginaActual }) {

  // Fecha actual en formato español
  const fechaActual = new Intl.DateTimeFormat("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const seccion =
    paginaActual === "dashboard"
      ? "Panel principal"
      : "Órdenes de servicio";

  return (
    <header className="header">

      {/* INFORMACION DE LA SECCION */}
      <div className="header-informacion">
        <span className="header-etiqueta">
          SERVITECH EC
        </span>

        <span className="header-seccion">
          {seccion}
        </span>
      </div>

      {/* FECHA ACTUAL */}
      <div className="header-fecha">
        <CalendarDays size={19} strokeWidth={1.8} />
        <span>{fechaActual}</span>
      </div>

    </header>
  );
}

export default Header;
