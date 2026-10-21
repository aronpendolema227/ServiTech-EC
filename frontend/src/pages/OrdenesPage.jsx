
import { useEffect, useState } from "react";

import {
  ClipboardList,
  Clock3,
  Wrench,
  CircleCheck,
  ListFilter,
  Plus,
} from "lucide-react";

import {
  listarOrdenes,
  crearOrden,
  actualizarOrden,
  eliminarOrden,
} from "../services/ordenServicioService";
import TablaOrdenes from "../components/ordenes/TablaOrdenes";
import OrdenFormulario from "../components/ordenes/OrdenFormulario";
import OrdenDetalle from "../components/ordenes/OrdenDetalle";
import OrdenEditar from "../components/ordenes/OrdenEditar";
import OrdenEliminar from "../components/ordenes/OrdenEliminar";
import "../styles/OrdenesPage.css";

// SERVITECH EC - PAGINA ORDENES DE SERVICIO
function OrdenesPage() {
  // ESTADOS
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  // CONTROL DEL FORMULARIO DE REGISTRO
  const [modalAbierto, setModalAbierto] = useState(false);
  // CONTROL DE VISUALIZACION DE ORDENES
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  // CONTROL DE EDICION DE ORDENES
  const [ordenEnEdicion, setOrdenEnEdicion] = useState(null);
  // CONTROL DE ELIMINACION DE ORDENES
  const [ordenAEliminar, setOrdenAEliminar] = useState(null);

  // CONSULTAR ORDENES DESDE POSTGRESQL
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

  // CREATE - REGISTRAR NUEVA ORDEN
  const guardarNuevaOrden = async (datos) => {

    // 1. Registrar la orden mediante Spring Boot
    const nuevaOrden = await crearOrden(datos);

    // 2. Actualizar los registros sin recargar
    setOrdenes((anteriores) => [
      ...anteriores,
      nuevaOrden,
    ]);

    // 3. Limpiar posibles errores anteriores
    setError("");
  };
  
  // UPDATE - ACTUALIZAR ORDEN DE SERVICIO
  const guardarEdicionOrden = async (id, datos) => {

    // 1. Enviar actualizacion a Spring Boot
    const ordenActualizada = await actualizarOrden(id, datos);

    // 2. Actualizar los registros locales
    setOrdenes((anteriores) =>
      anteriores.map((orden) =>
        Number(orden.id) === Number(id)
          ? ordenActualizada
          : orden
      )
    );

    // 3. Limpiar errores anteriores
    setError("");
  };
  
  //DELETE - ELIMINAR ORDEN DE SERVICIO
  const confirmarEliminarOrden = async (id) => {

    // 1. Eliminar mediante Spring Boot
    await eliminarOrden(id);

    // 2. Actualizar registros locales
    setOrdenes((anteriores) =>
      anteriores.filter(
        (orden) => Number(orden.id) !== Number(id)
      )
    );

    // 3. Limpiar errores anteriores
    setError("");
  };

  // CALCULAR INDICADORES
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

  // CONFIGURACION DE TARJETAS
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

  // INTERFAZ
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

      {/* SECCION DEL LISTADO COMPLETO*/}
      <section className="ordenes-pagina-listado">

        
        {/* ENCABEZADO DEL LISTADO GENERAL */}
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

          {/* BOTON NUEVA ORDEN */}
          <button
            type="button"
            className="ordenes-pagina-btn-nueva"
            onClick={() => setModalAbierto(true)}
          >
            <Plus size={19} strokeWidth={2} />
            <span>Nueva orden</span>
          </button>

        </div>

        {/* TABLA GENERAL DE ORDENES */}
        <TablaOrdenes
          ordenes={ordenes}
          cargando={cargando}
          error={error}
          onVerOrden={setOrdenSeleccionada}
          onEditarOrden={setOrdenEnEdicion}
          onEliminarOrden={setOrdenAEliminar}
        />

      </section>

        {/* FORMULARIO PARA REGISTRAR ORDEN*/}
        {modalAbierto && (
          <OrdenFormulario
            onCerrar={() => setModalAbierto(false)}
            onGuardar={guardarNuevaOrden}
          />
        )}

        
        {/* VISUALIZAR DETALLES DE UNA ORDEN*/}
        {ordenSeleccionada && (
          <OrdenDetalle
            orden={ordenSeleccionada}
            onCerrar={() => setOrdenSeleccionada(null)}
          />
        )}

        
        {/* EDITAR ORDEN DE SERVICIO */}
        {ordenEnEdicion && (
          <OrdenEditar
            orden={ordenEnEdicion}
            onCerrar={() => setOrdenEnEdicion(null)}
            onGuardar={guardarEdicionOrden}
          />
        )}

        
        {/* ELIMINAR ORDEN DE SERVICIO*/}
        {ordenAEliminar && (
          <OrdenEliminar
            orden={ordenAEliminar}
            onCerrar={() => setOrdenAEliminar(null)}
            onConfirmar={confirmarEliminarOrden}
          />
        )}





    </div>
  );
}

export default OrdenesPage;
