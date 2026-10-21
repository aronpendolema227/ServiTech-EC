

import OrdenesRecientes from "../components/dashboard/OrdenesRecientes";


import { useEffect, useState } from "react";

import {
  ClipboardList,
  Clock3,
  Wrench,
  CircleCheck,
} from "lucide-react";


import {
  listarOrdenes,
  crearOrden,
} from "../services/ordenServicioService";

import OrdenFormulario from "../components/ordenes/OrdenFormulario";


import "../styles/Dashboard.css";

// ==========================================
// SERVITECH EC - DASHBOARD PRINCIPAL
// ==========================================

function DashboardPage() {

  // ========================================
  // ESTADOS
  // ========================================
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  
  // ========================================
  // CONTROL DEL FORMULARIO MODAL
  // ========================================
  const [modalAbierto, setModalAbierto] = useState(false);


  // ========================================
  // CONSULTAR ORDENES DESDE POSTGRESQL
  // ========================================
  useEffect(() => {
    let activo = true;

    const cargarOrdenes = async () => {
      try {
        const datos = await listarOrdenes();

        if (!Array.isArray(datos)) {
          throw new Error("Respuesta incorrecta de la API");
        }

        if (activo) {
          setOrdenes(datos);
          setError("");
        }

      } catch (err) {
        console.error("Error al cargar órdenes:", err);

        if (activo) {
          setError("No se pudieron cargar las órdenes de servicio.");
        }

      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarOrdenes();

    return () => {
      activo = false;
    };
  }, []);

  
  // ========================================
  // CREATE - REGISTRAR NUEVA ORDEN
  // ========================================
  const guardarNuevaOrden = async (datos) => {

    // Registrar la orden mediante nuestra API
    const nuevaOrden = await crearOrden(datos);

    // Actualizar las órdenes sin recargar la página
    setOrdenes((anteriores) => [
      ...anteriores,
      nuevaOrden,
    ]);

    // Limpiar posibles errores anteriores
    setError("");
  };


  // ========================================
  // CALCULAR ESTADISTICAS
  // ========================================
  const total = ordenes.length;

  const pendientes = ordenes.filter(
    (orden) => orden.estado === "PENDIENTE"
  ).length;

  const enReparacion = ordenes.filter(
    (orden) => orden.estado === "EN REPARACION"
  ).length;

  const finalizadas = ordenes.filter(
    (orden) => orden.estado === "FINALIZADO"
  ).length;

  const porcentaje = (cantidad) =>
    total > 0 ? Math.round((cantidad / total) * 100) : 0;

  // ========================================
  // CONFIGURACION DE TARJETAS
  // ========================================
  const tarjetas = [
    {
      titulo: "Total de órdenes",
      valor: total,
      descripcion: "Órdenes registradas",
      icono: ClipboardList,
      color: "azul",
    },
    {
      titulo: "Pendientes",
      valor: pendientes,
      descripcion: `${porcentaje(pendientes)}% del total`,
      icono: Clock3,
      color: "verde",
    },
    {
      titulo: "En reparación",
      valor: enReparacion,
      descripcion: `${porcentaje(enReparacion)}% del total`,
      icono: Wrench,
      color: "oliva",
    },
    {
      titulo: "Finalizadas",
      valor: finalizadas,
      descripcion: `${porcentaje(finalizadas)}% del total`,
      icono: CircleCheck,
      color: "gris",
    },
  ];

  // ========================================
  // INTERFAZ DEL DASHBOARD
  // ========================================
  return (
    <div className="dashboard">

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="dashboard-error" role="alert">
          {error}
        </div>
      )}

      {/* TARJETAS ESTADISTICAS */}
      <section
        className="dashboard-estadisticas"
        aria-label="Resumen de órdenes de servicio"
      >
        {tarjetas.map((tarjeta) => {
          const Icono = tarjeta.icono;

          return (
            <article
              key={tarjeta.titulo}
              className={`dashboard-tarjeta ${tarjeta.color}`}
            >

              <div className="tarjeta-superior">
                <span>{tarjeta.titulo}</span>

                <div className="tarjeta-icono">
                  <Icono size={25} strokeWidth={1.8} />
                </div>
              </div>

              <div className="tarjeta-inferior">
                <h2>
                  {cargando || error ? "—" : tarjeta.valor}
                </h2>

                <p>
                  {cargando
                    ? "Cargando..."
                    : error
                      ? "Datos no disponibles"
                      : tarjeta.descripcion}
                </p>
              </div>

            </article>
          );
        })}
      </section>

      
      
      {/* ===================================
          ORDENES DE SERVICIO RECIENTES
          =================================== */}
      <OrdenesRecientes
        ordenes={ordenes}
        cargando={cargando}
        error={error}
        onNuevaOrden={() => setModalAbierto(true)}
      />

      {/* ===================================
          FORMULARIO DE NUEVA ORDEN
          =================================== */}
      {modalAbierto && (
        <OrdenFormulario
          onCerrar={() => setModalAbierto(false)}
          onGuardar={guardarNuevaOrden}
        />
      )}



    </div>
  );
}

export default DashboardPage;
