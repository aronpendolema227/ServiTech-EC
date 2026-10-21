
import {
  Wrench,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";

import "../styles/Sidebar.css";

// SERVITECH EC - MENU LATERAL
const opciones = [
  {
    id: "dashboard",
    nombre: "Dashboard",
    icono: LayoutDashboard,
  },
  {
    id: "ordenes",
    nombre: "Órdenes de servicio",
    icono: ClipboardList,
  },
];

function Sidebar({ paginaActual, cambiarPagina }) {
  return (
    <aside className="sidebar">

      {/* LOGOTIPO Y NOMBRE */}
      <div className="sidebar-marca">
        <div className="sidebar-logo">
          <Wrench size={29} strokeWidth={1.8} />
        </div>

        <div className="sidebar-marca-texto">
          <h2>ServiTech EC</h2>
          <p>Gestión de Servicios</p>
        </div>
      </div>

      {/* NAVEGACION */}
      <nav className="sidebar-navegacion" aria-label="Menú principal">
        <span className="sidebar-seccion">PRINCIPAL</span>

        {opciones.map((opcion) => {
          const Icono = opcion.icono;

          return (
            <button
              key={opcion.id}
              type="button"
              className={`sidebar-opcion ${
                paginaActual === opcion.id ? "activo" : ""
              }`}
              onClick={() => cambiarPagina(opcion.id)}
              aria-label={opcion.nombre}
              aria-current={
                paginaActual === opcion.id ? "page" : undefined
              }
            >
              <Icono size={21} strokeWidth={1.8} />
              <span>{opcion.nombre}</span>
            </button>
          );
        })}
      </nav>

      {/* PIE DEL MENU */}
      <div className="sidebar-pie">
        <p>ServiTech EC</p>
        <span>Sistema de gestión técnica</span>
      </div>

    </aside>
  );
}

export default Sidebar;
