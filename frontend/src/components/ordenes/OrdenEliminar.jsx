
import { useEffect, useRef, useState } from "react";

import {
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

import "../../styles/OrdenEliminar.css";

// SERVITECH EC - ELIMINAR ORDEN
function OrdenEliminar({ orden, onCerrar, onConfirmar }) {

  
  // ESTADOS
  
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  const cancelarRef = useRef(null);
  
  // COMPORTAMIENTO DEL MODAL
  useEffect(() => {
    const elementoAnterior = document.activeElement;
    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    cancelarRef.current?.focus();

    const manejarTecla = (evento) => {

      // Cerrar con Escape
      if (evento.key === "Escape" && !eliminando) {
        onCerrar();
      }

      // Mantener el foco dentro del modal
      if (evento.key === "Tab") {
        const botones = Array.from(
          document.querySelectorAll(
            ".eliminar-modal button:not(:disabled)"
          )
        );

        if (botones.length === 0) return;

        const primero = botones[0];
        const ultimo = botones[botones.length - 1];

        if (evento.shiftKey &&
            document.activeElement === primero) {
          evento.preventDefault();
          ultimo.focus();

        } else if (
          !evento.shiftKey &&
          document.activeElement === ultimo
        ) {
          evento.preventDefault();
          primero.focus();
        }
      }
    };

    document.addEventListener("keydown", manejarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", manejarTecla);
      elementoAnterior?.focus?.();
    };

  }, [onCerrar, eliminando]);

  // CONFIRMAR ELIMINACION
  const manejarEliminar = async () => {

    if (eliminando) return;

    setError("");
    setEliminando(true);

    try {

      // La eliminación será ejecutada
      // desde DashboardPage mediante la API.
      await onConfirmar(orden.id);

      // Cerrar únicamente si fue exitosa
      onCerrar();

    } catch (err) {

      console.error("Error al eliminar orden:", err);

      const codigo = err.response?.status;

      if (codigo === 404) {
        setError("La orden ya no existe en el sistema.");

      } else {
        setError(
          "No se pudo eliminar la orden. " +
          "Comprueba la conexión con el servidor."
        );
      }

    } finally {
      setEliminando(false);
    }
  };

  // INTERFAZ
  return (
    <div className="eliminar-modal-fondo">

      <section
        className="eliminar-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="eliminar-modal-titulo"
        aria-describedby="eliminar-modal-descripcion"
      >

        {/* ENCABEZADO */}
        <div className="eliminar-modal-header">

          <div className="eliminar-modal-titulo">

            <div className="eliminar-modal-icono">
              <Trash2 size={23} />
            </div>

            <div>
              <h2 id="eliminar-modal-titulo">
                Eliminar orden de servicio
              </h2>

              <p>Confirmar eliminación permanente</p>
            </div>

          </div>

          <button
            type="button"
            className="eliminar-modal-cerrar"
            onClick={onCerrar}
            disabled={eliminando}
            aria-label="Cerrar confirmación"
          >
            <X size={21} />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="eliminar-modal-body">

          <p id="eliminar-modal-descripcion">
            ¿Estás seguro de que deseas eliminar
            esta orden de servicio?
          </p>

          {/* INFORMACION DE LA ORDEN */}
          <div className="eliminar-orden-info">

            <div>
              <span>Orden</span>
              <strong>#{orden.id}</strong>
            </div>

            <div>
              <span>Cliente</span>
              <strong>{orden.cliente}</strong>
            </div>

            <div>
              <span>Equipo</span>
              <strong>
                {orden.equipo} - {orden.marca}
              </strong>
            </div>

          </div>

          {/* ADVERTENCIA */}
          <div className="eliminar-advertencia">

            <AlertTriangle size={19} />

            <p>
              Esta acción eliminará permanentemente
              el registro de PostgreSQL y no se podrá
              deshacer desde el sistema.
            </p>

          </div>

          {/* MENSAJE DE ERROR */}
          {error && (
            <div className="eliminar-error" role="alert">
              {error}
            </div>
          )}

        </div>

        {/* BOTONES */}
        <div className="eliminar-modal-footer">

          <button
            ref={cancelarRef}
            type="button"
            className="eliminar-btn-cancelar"
            onClick={onCerrar}
            disabled={eliminando}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="eliminar-btn-confirmar"
            onClick={manejarEliminar}
            disabled={eliminando}
          >
            <Trash2 size={18} />

            {eliminando
              ? "Eliminando..."
              : "Eliminar orden"}
          </button>

        </div>

      </section>
    </div>
  );
}

export default OrdenEliminar;
