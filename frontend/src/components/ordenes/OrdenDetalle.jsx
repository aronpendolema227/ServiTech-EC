
import { useEffect, useRef } from "react";
import {
  ClipboardList,
  X,
} from "lucide-react";

import "../../styles/OrdenDetalle.css";

// ==========================================
// SERVITECH EC - DETALLES DE UNA ORDEN
// ==========================================

function OrdenDetalle({ orden, onCerrar }) {
  const botonCerrarRef = useRef(null);

  // ========================================
  // COMPORTAMIENTO DEL MODAL
  // ========================================
  useEffect(() => {
    const elementoAnterior = document.activeElement;
    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    botonCerrarRef.current?.focus();

    const manejarTeclado = (evento) => {
      if (evento.key === "Escape") {
        onCerrar();
      }

      if (evento.key === "Tab") {
        evento.preventDefault();
        botonCerrarRef.current?.focus();
      }
    };

    document.addEventListener("keydown", manejarTeclado);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", manejarTeclado);
      elementoAnterior?.focus?.();
    };
  }, [onCerrar]);

  if (!orden) return null;

  // ========================================
  // FORMATEAR FECHA
  // ========================================
  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const partes = fecha.split("-");

    if (partes.length !== 3) return fecha;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // ========================================
  // MOSTRAR ESTADO
  // ========================================
  const estados = {
    PENDIENTE: "Pendiente",
    "EN REPARACION": "En reparación",
    FINALIZADO: "Finalizada",
  };

  const estadoTexto = estados[orden.estado] || orden.estado;

  const estadoClase =
    orden.estado === "PENDIENTE"
      ? "pendiente"
      : orden.estado === "EN REPARACION"
        ? "reparacion"
        : orden.estado === "FINALIZADO"
          ? "finalizada"
          : "desconocido";

  // ========================================
  // INTERFAZ
  // ========================================
  return (
    <div className="detalle-modal-fondo">

      <section
        className="detalle-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-modal-titulo"
      >

        {/* ENCABEZADO */}
        <div className="detalle-modal-header">

          <div className="detalle-modal-titulo">
            <div className="detalle-modal-icono">
              <ClipboardList size={24} />
            </div>

            <div>
              <h2 id="detalle-modal-titulo">
                Detalles de la orden #{orden.id}
              </h2>
              <p>Información del servicio técnico</p>
            </div>
          </div>

          <button
            ref={botonCerrarRef}
            type="button"
            className="detalle-modal-cerrar"
            onClick={onCerrar}
            aria-label="Cerrar detalles"
          >
            <X size={21} />
          </button>
        </div>

        {/* INFORMACION DE LA ORDEN */}
        <div className="detalle-modal-body">

          <div className="detalle-grid">

            <div className="detalle-campo">
              <span>Cliente</span>
              <strong>{orden.cliente}</strong>
            </div>

            <div className="detalle-campo">
              <span>Equipo</span>
              <strong>{orden.equipo}</strong>
            </div>

            <div className="detalle-campo">
              <span>Marca</span>
              <strong>{orden.marca}</strong>
            </div>

            <div className="detalle-campo">
              <span>Modelo</span>
              <strong>{orden.modelo || "No especificado"}</strong>
            </div>

            <div className="detalle-campo">
              <span>Fecha de ingreso</span>
              <strong>{formatearFecha(orden.fechaIngreso)}</strong>
            </div>

            <div className="detalle-campo">
              <span>Estado</span>
              <div>
                <span className={`detalle-estado ${estadoClase}`}>
                  {estadoTexto}
                </span>
              </div>
            </div>

          </div>

          {/* DESCRIPCION COMPLETA */}
          <div className="detalle-problema">
            <h3>Descripción del problema</h3>
            <p>{orden.problema}</p>
          </div>

        </div>

        {/* PIE DEL MODAL */}
        <div className="detalle-modal-footer">
          <button
            type="button"
            className="detalle-btn-cerrar"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </div>

      </section>
    </div>
  );
}

export default OrdenDetalle;
