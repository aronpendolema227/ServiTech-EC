
import { useEffect, useRef, useState } from "react";
import { Pencil, X, Save, Info } from "lucide-react";

import "../../styles/OrdenFormulario.css";
import "../../styles/OrdenEditar.css";

// ==========================================
// SERVITECH EC - EDITAR ORDEN DE SERVICIO
// ==========================================

// ==========================================
// CONFIGURACION DE CAMPOS
// ==========================================

const campos = [
  {
    nombre: "cliente",
    etiqueta: "Nombre del cliente",
    placeholder: "Nombre completo",
    maxLength: 100,
    obligatorio: true,
  },
  {
    nombre: "equipo",
    etiqueta: "Tipo de equipo",
    placeholder: "Laptop, PC, impresora...",
    maxLength: 50,
    obligatorio: true,
  },
  {
    nombre: "marca",
    etiqueta: "Marca",
    placeholder: "Marca del equipo",
    maxLength: 50,
    obligatorio: true,
  },
  {
    nombre: "modelo",
    etiqueta: "Modelo",
    placeholder: "Modelo del equipo",
    maxLength: 50,
    obligatorio: false,
  },
];

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

function OrdenEditar({ orden, onCerrar, onGuardar }) {

  // ========================================
  // ESTADOS
  // ========================================

  const [formulario, setFormulario] = useState(() => ({
    cliente: orden.cliente ?? "",
    equipo: orden.equipo ?? "",
    marca: orden.marca ?? "",
    modelo: orden.modelo ?? "",
    problema: orden.problema ?? "",
    estado: orden.estado ?? "PENDIENTE",
  }));

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const clienteRef = useRef(null);

  // ========================================
  // COMPORTAMIENTO DEL MODAL
  // ========================================

  useEffect(() => {
    const elementoAnterior = document.activeElement;
    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    clienteRef.current?.focus();

    const manejarTecla = (evento) => {
      if (evento.key === "Escape" && !guardando) {
        onCerrar();
      }
    };

    document.addEventListener("keydown", manejarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", manejarTecla);
      elementoAnterior?.focus?.();
    };
  }, [onCerrar, guardando]);

  // ========================================
  // ACTUALIZAR CAMPOS
  // ========================================

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

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
  // GUARDAR CAMBIOS
  // ========================================

  const manejarSubmit = async (evento) => {
    evento.preventDefault();

    if (guardando) return;

    setError("");

    const datos = {
      cliente: formulario.cliente.trim(),
      equipo: formulario.equipo.trim(),
      marca: formulario.marca.trim(),
      modelo: formulario.modelo.trim(),
      problema: formulario.problema.trim(),
      estado: formulario.estado,
      fechaIngreso: orden.fechaIngreso,
    };

    // Validar campos obligatorios
    if (
      !datos.cliente ||
      !datos.equipo ||
      !datos.marca ||
      !datos.problema
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    // La fecha original debe conservarse
    if (!datos.fechaIngreso) {
      setError("La orden no tiene una fecha de ingreso válida.");
      return;
    }

    setGuardando(true);

    try {
      // Actualizar mediante la API REST
      await onGuardar(orden.id, datos);

      // Cerrar únicamente si se guardó correctamente
      onCerrar();

    } catch (err) {
      console.error("Error al actualizar la orden:", err);

      const codigo = err.response?.status;

      if (codigo === 400) {
        setError("Revisa los datos ingresados.");
      } else if (codigo === 404) {
        setError("La orden ya no existe en el sistema.");
      } else {
        setError(
          "No se pudieron guardar los cambios. Comprueba la conexión."
        );
      }

    } finally {
      setGuardando(false);
    }
  };

  // ========================================
  // INTERFAZ DEL MODAL
  // ========================================

  return (
    <div className="orden-modal-fondo">

      <section
        className="orden-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editar-orden-titulo"
      >

        {/* ENCABEZADO */}
        <div className="orden-modal-header">

          <div className="orden-modal-titulo">

            <div className="orden-modal-icono">
              <Pencil size={23} />
            </div>

            <div>
              <h2 id="editar-orden-titulo">
                Editar orden #{orden.id}
              </h2>

              <p>
                Actualizar información del servicio técnico
              </p>
            </div>

          </div>

          <button
            type="button"
            className="orden-modal-cerrar"
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar edición"
          >
            <X size={21} />
          </button>

        </div>

        {/* FORMULARIO */}
        <form onSubmit={manejarSubmit}>

          <div className="orden-modal-body">

            {/* MENSAJE DE ERROR */}
            {error && (
              <div className="orden-form-error" role="alert">
                {error}
              </div>
            )}

            {/* DATOS DEL CLIENTE Y EQUIPO */}
            <div className="orden-form-grid">

              {campos.map((campo) => (
                <div className="orden-form-campo" key={campo.nombre}>

                  <label htmlFor={`editar-${campo.nombre}`}>
                    {campo.etiqueta}
                    {campo.obligatorio && " *"}
                  </label>

                  <input
                    ref={
                      campo.nombre === "cliente"
                        ? clienteRef
                        : undefined
                    }
                    id={`editar-${campo.nombre}`}
                    type="text"
                    name={campo.nombre}
                    placeholder={campo.placeholder}
                    value={formulario[campo.nombre]}
                    onChange={manejarCambio}
                    maxLength={campo.maxLength}
                    required={campo.obligatorio}
                    disabled={guardando}
                  />

                </div>
              ))}

            </div>

            {/* ESTADO Y FECHA */}
            <div className="orden-form-grid">

              <div className="orden-form-campo">
                <label htmlFor="editar-estado">
                  Estado de la reparación *
                </label>

                <select
                  id="editar-estado"
                  name="estado"
                  className="orden-editar-select"
                  value={formulario.estado}
                  onChange={manejarCambio}
                  disabled={guardando}
                  required
                >
                  <option value="PENDIENTE">
                    Pendiente
                  </option>

                  <option value="EN REPARACION">
                    En reparación
                  </option>

                  <option value="FINALIZADO">
                    Finalizado
                  </option>
                </select>
              </div>

              <div className="orden-form-campo orden-editar-fecha">
                <label htmlFor="editar-fecha">
                  Fecha de ingreso
                </label>

                <input
                  id="editar-fecha"
                  type="text"
                  value={formatearFecha(orden.fechaIngreso)}
                  readOnly
                />
              </div>

            </div>

            {/* DESCRIPCION DEL PROBLEMA */}
            <div className="orden-form-campo">

              <label htmlFor="editar-problema">
                Descripción del problema *
              </label>

              <textarea
                id="editar-problema"
                name="problema"
                rows={4}
                value={formulario.problema}
                onChange={manejarCambio}
                required
                disabled={guardando}
              />

            </div>

            {/* INFORMACION */}
            <div className="orden-form-info">
              <Info size={18} />

              <p>
                Los cambios se guardarán en PostgreSQL.
                La fecha de ingreso original se conservará.
              </p>
            </div>

          </div>

          {/* BOTONES */}
          <div className="orden-modal-footer">

            <button
              type="button"
              className="orden-btn-cancelar"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="orden-btn-guardar"
              disabled={guardando}
            >
              <Save size={18} />

              {guardando
                ? "Guardando..."
                : "Guardar cambios"}
            </button>

          </div>

        </form>

      </section>
    </div>
  );
}

export default OrdenEditar;
