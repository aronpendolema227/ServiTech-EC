
import { useState } from "react";

// ==========================================
// COMPONENTES PRINCIPALES
// ==========================================
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// ==========================================
// PAGINAS
// ==========================================
import DashboardPage from "./pages/DashboardPage";

import OrdenesPage from "./pages/OrdenesPage";


// ==========================================
// ESTILOS
// ==========================================
import "./styles/Layout.css";

// ==========================================
// SERVITECH EC - COMPONENTE PRINCIPAL
// ==========================================

function App() {

  // ========================================
  // CONTROL DE NAVEGACION
  // ========================================
  const [paginaActual, setPaginaActual] = useState("dashboard");

  const esDashboard = paginaActual === "dashboard";

  return (
    <div className="app-contenedor">

      {/* ====================================
          MENU LATERAL
          ==================================== */}
      <Sidebar
        paginaActual={paginaActual}
        cambiarPagina={setPaginaActual}
      />

      {/* ====================================
          AREA PRINCIPAL
          ==================================== */}
      <div className="app-area">

        {/* ENCABEZADO SUPERIOR */}
        <Header paginaActual={paginaActual} />

        {/* CONTENIDO DE LA PAGINA */}
        <main className="app-contenido">

          {/* TITULO Y DESCRIPCION */}
          <div className="pagina-encabezado">
            <h1>
              {esDashboard
                ? "Dashboard"
                : "Órdenes de servicio"}
            </h1>

            <p>
              {esDashboard
                ? "Resumen general de las órdenes de servicio"
                : "Administración de reparaciones y equipos"}
            </p>
          </div>

          {/* ==================================
              NAVEGACION ENTRE PAGINAS
              ================================== */}

          {esDashboard ? (

            // DASHBOARD PRINCIPAL
            <DashboardPage />

          ) : (

            
            <OrdenesPage />


          )}

        </main>
      </div>

    </div>
  );
}

export default App;
