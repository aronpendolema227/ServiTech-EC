
import { useEffect, useRef, useState } from "react";
import { ClipboardPlus, X, Save, Info } from "lucide-react";

import "../../styles/OrdenFormulario.css";

// SERVITECH EC - FORMULARIO DE ORDENES
const datosIniciales = {
  cliente: "",
  equipo: "",
  marca: "",
  modelo: "",
  problema: "",
};

function OrdenFormulario({ onCerrar, onGuardar }) {

  // ESTADOS DEL FORMULARIO
  const [formulario, setFormulario] = useState(datosIniciales);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const clienteRef = useRef(null);

  // COMPORTAMIENTO DEL MODAL
  useEffect(() => {
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
    };
  }, [onCerrar, guardando]);

  // ACTUALIZAR CAMPOS
  const manejarCambio = (evento) => {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  // GUARDAR NUEVA ORDEN
  const manejarSubmit = async (evento) => {
    evento.preventDefault();

    if (guardando) return;

    setError("");
    setGuardando(true);

    try {
      const datos = {
        cliente: formulario.cliente.trim(),
        equipo: formulario.equipo.trim(),
        marca: formulario.marca.trim(),
        modelo: formulario.modelo.trim(),
        problema: formulario.problema.trim(),
      };

      // El backend asigna estado y fecha.
      await onGuardar(datos);

      onCerrar();

    } catch (err) {
      console.error("Error al registrar orden:", err);

      const codigo = err.response?.status;

      setError(
        codigo === 400
          ? "Revisa los datos ingresados. Hay campos incorrectos."
          : "No se pudo registrar la orden. Comprueba la conexión con el servidor."
      );

    } finally {
      setGuardando(false);
    }
  };

  // INTERFAZ DEL FORMULARIO
  return (
    <div className="orden-modal-fondo">

      <section
        className="orden-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="orden-modal-titulo"
      >

        {/* ENCABEZADO */}
        <div className="orden-modal-header">

          <div className="orden-modal-titulo">
            <div className="orden-modal-icono">
              <ClipboardPlus size={24} />
            </div>

            <div>
              <h2 id="orden-modal-titulo">
                Nueva orden de servicio
              </h2>
              <p>Registra un equipo para su reparación</p>
            </div>
          </div>

          <button
            type="button"
            className="orden-modal-cerrar"
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar formulario"
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

            {/* CAMPOS PRINCIPALES */}
            <div className="orden-form-grid">

              <div className="orden-form-campo">
                <label htmlFor="orden-cliente">
                  Nombre del cliente *
                </label>

                <input
                  ref={clienteRef}
                  id="orden-cliente"
                  name="cliente"
                  type="text"
                  placeholder="Nombre completo"
                  value={formulario.cliente}
                  onChange={manejarCambio}
                  maxLength={100}
                  required
                  disabled={guardando}
                />
              </div>

              <div className="orden-form-campo">
                <label htmlFor="orden-equipo">
                  Tipo de equipo *
                </label>

                <input
                  id="orden-equipo"
                  name="equipo"
                  type="text"
                  list="tipos-equipo"
                  placeholder="Laptop, PC, impresora..."
                  value={formulario.equipo}
                  onChange={manejarCambio}
                  maxLength={50}
                  required
                  disabled={guardando}
                />

                <datalist id="tipos-equipo">
                  <option value="Laptop" />
                  <option value="PC de escritorio" />
                  <option value="Impresora" />
                  <option value="Monitor" />
                  <option value="Tablet" />
                </datalist>
              </div>

              <div className="orden-form-campo">
                <label htmlFor="orden-marca">
                  Marca *
                </label>

                <input
                  id="orden-marca"
                  name="marca"
                  type="text"
                  placeholder="Ej. Lenovo"
                  value={formulario.marca}
                  onChange={manejarCambio}
                  maxLength={50}
                  required
                  disabled={guardando}
                />
              </div>

              <div className="orden-form-campo">
                <label htmlFor="orden-modelo">
                  Modelo
                </label>

                <input
                  id="orden-modelo"
                  name="modelo"
                  type="text"
                  placeholder="Ej. IdeaPad 3"
                  value={formulario.modelo}
                  onChange={manejarCambio}
                  maxLength={50}
                  disabled={guardando}
                />
              </div>

            </div>

            {/* DESCRIPCION */}
            <div className="orden-form-campo">
              <label htmlFor="orden-problema">
                Descripción del problema *
              </label>

              <textarea
                id="orden-problema"
                name="problema"
                rows={4}
                placeholder="Describe la falla del equipo..."
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
                La orden se registrará con estado
                <strong> PENDIENTE</strong> y la fecha actual.
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
                : "Guardar orden"}
            </button>

          </div>

        </form>
      </section>
    </div>
  );
}

export default OrdenFormulario;
