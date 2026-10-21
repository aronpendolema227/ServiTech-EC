
import { useEffect, useState } from "react";

import {
  ClipboardList,
  Clock3,
  Wrench,
  CircleCheck,
  ListFilter,
} from "lucide-react";

import { listarOrdenes } from "../services/ordenServicioService";
import TablaOrdenes from "../components/ordenes/TablaOrdenes";
import "../styles/OrdenesPage.css";

// ==========================================
// SERVITECH EC - PAGINA ORDENES DE SERVICIO
// ==========================================

function OrdenesPage() {

  // ========================================
  // ESTADOS
  // ========================================
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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
          setError(
            "No se pudieron cargar las órdenes de servicio."
          );
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
  // CALCULAR INDICADORES
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

  // ========================================
  // CONFIGURACION DE TARJETAS
  // ========================================
  const tarjetas = [
    {
      titulo: "Todas las órdenes",
      valor: total,
      descripcion: "Registros del sistema",
      icono: ClipboardList,
      color: "total",
    },
    {
      titulo: "Pendientes",
      valor: pendientes,
      descripcion: "Esperando atención",
      icono: Clock3,
      color: "pendientes",
    },
    {
      titulo: "En reparación",
      valor: enReparacion,
      descripcion: "Equipos en proceso",
      icono: Wrench,
      color: "reparacion",
    },
    {
      titulo: "Finalizadas",
      valor: finalizadas,
      descripcion: "Servicios completados",
      icono: CircleCheck,
      color: "finalizadas",
    },
  ];

  // ========================================
  // INTERFAZ
  // ========================================
  return (
    <div className="ordenes-pagina">

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="ordenes-pagina-error" role="alert">
          {error}
        </div>
      )}

      {/* INDICADORES GENERALES */}
      <section
        className="ordenes-pagina-resumen"
        aria-label="Indicadores de órdenes"
      >
        {tarjetas.map((tarjeta) => {
          const Icono = tarjeta.icono;

          return (
            <article
              key={tarjeta.titulo}
              className={`ordenes-pagina-tarjeta ${tarjeta.color}`}
            >
              <div className="ordenes-pagina-tarjeta-superior">
                <span>{tarjeta.titulo}</span>

                <div className="ordenes-pagina-tarjeta-icono">
                  <Icono size={22} strokeWidth={1.8} />
                </div>
              </div>

              <div className="ordenes-pagina-tarjeta-info">
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

      {/* ====================================
          SECCION DEL LISTADO COMPLETO
          ==================================== */}
      <section className="ordenes-pagina-listado">

        <div className="ordenes-pagina-listado-header">
          <div className="ordenes-pagina-listado-icono">
            <ListFilter size={23} strokeWidth={1.8} />
          </div>

          <div>
            <h2>Listado general de órdenes</h2>
            <p>
              Consulta y administración de servicios técnicos
            </p>
          </div>
        </div>

        
        {/* ====================================
            TABLA GENERAL DE ORDENES
            ==================================== */}
        <TablaOrdenes
          ordenes={ordenes}
          cargando={cargando}
          error={error}
        />

      </section>

    </div>
  );
}

export default OrdenesPage;
