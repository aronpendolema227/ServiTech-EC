
import { useState } from "react";

import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import "../../styles/OrdenesRecientes.css";

// SERVITECH EC - ORDENES RECIENTES

function OrdenesRecientes({
  ordenes = [],
  cargando = false,
  error = "",
  onNuevaOrden,
  onVerOrden,
  onEditarOrden,
  onEliminarOrden,
}) {

  // ESTADOS DE BUSQUEDA Y FILTROS
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");

  // FORMATEAR FECHA
  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const partes = fecha.split("-");

    if (partes.length !== 3) return fecha;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // FILTRAR Y ORDENAR REGISTROS
  const ordenesFiltradas = ordenes
    .filter((orden) => {
      const texto = [
        orden.id,
        orden.cliente,
        orden.equipo,
        orden.marca,
        orden.modelo,
        orden.problema,
      ]
        .filter((valor) => valor != null)
        .join(" ")
        .toLocaleLowerCase("es-EC");

      const coincideBusqueda = texto.includes(
        busqueda.trim().toLocaleLowerCase("es-EC")
      );

      const coincideEstado =
        estadoFiltro === "TODOS" ||
        orden.estado === estadoFiltro;

      return coincideBusqueda && coincideEstado;
    })
    .sort((a, b) => Number(b.id) - Number(a.id));

  // Mostrar solamente los primeros cinco resultados
  const ordenesVisibles = ordenesFiltradas.slice(0, 5);

  // ETIQUETAS DE ESTADO
  const obtenerEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "Pendiente";

      case "EN REPARACION":
        return "En reparación";

      case "FINALIZADO":
        return "Finalizada";

      default:
        return estado || "Sin estado";
    }
  };

  // INTERFAZ
  return (
    <section className="ordenes-recientes">

      {/* ENCABEZADO */}
      <div className="ordenes-recientes-header">
        <div className="ordenes-recientes-titulo">
          
          <div className="ordenes-recientes-icono">
            <ClipboardList size={23} />
          </div>

          <div>
            <h2>Órdenes de servicio recientes</h2>
            <p>Últimas órdenes registradas en el sistema</p>
          </div>

          {/* BOTON NUEVA ORDEN */}
          <button
            type="button"
            className="ordenes-recientes-btn-nueva"
            onClick={onNuevaOrden}
          >
            <Plus size={19} strokeWidth={2} />
            <span>Nueva orden</span>
          </button>
        </div>
      </div>

      {/* BUSQUEDA Y FILTROS */}
      <div className="ordenes-recientes-filtros">

        <div className="ordenes-recientes-busqueda">
          <Search size={19} />

          <input
            type="search"
            placeholder="Buscar cliente, equipo o problema..."
            aria-label="Buscar órdenes recientes"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="ordenes-recientes-select">
          <Filter size={18} />

          <select
            aria-label="Filtrar órdenes por estado"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN REPARACION">En reparación</option>
            <option value="FINALIZADO">Finalizadas</option>
          </select>
        </div>

      </div>

      {/* TABLA DE ORDENES */}
      <div className="ordenes-recientes-tabla-contenedor">
        <table className="ordenes-recientes-tabla">

          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Equipo</th>
              <th>Problema</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {cargando || error ? (
              <tr>
                <td colSpan="7" className="ordenes-recientes-vacio">
                  {cargando
                    ? "Cargando órdenes..."
                    : "No se pudieron consultar las órdenes."}
                </td>
              </tr>
            ) : ordenesVisibles.length === 0 ? (
              <tr>
                <td colSpan="6" className="ordenes-recientes-vacio">
                  No se encontraron órdenes de servicio.
                </td>
              </tr>
            ) : (
              ordenesVisibles.map((orden) => (
                <tr key={orden.id}>

                  <td>#{orden.id}</td>

                  <td className="ordenes-cliente">
                    {orden.cliente}
                  </td>

                  <td>
                    {orden.equipo} - {orden.marca}
                  </td>

                  <td className="ordenes-problema">
                    {orden.problema}
                  </td>

                  <td>
                    <span
                      className={`ordenes-estado ${
                        orden.estado === "PENDIENTE"
                          ? "pendiente"
                          : orden.estado === "EN REPARACION"
                            ? "reparacion"
                            : orden.estado === "FINALIZADO"
                              ? "finalizada"
                              : "desconocido"
                      }`}
                    >
                      {obtenerEstado(orden.estado)}
                    </span>
                  </td>

                  <td>{formatearFecha(orden.fechaIngreso)}</td>

                  
                  {/*ACCIONES DE LA ORDEN*/}
                  <td>
                    <div className="ordenes-recientes-acciones">
                      <button
                        type="button"
                        className="ordenes-btn-ver"
                        onClick={() => onVerOrden(orden)}
                        aria-label={`Visualizar orden ${orden.id}`}
                        title="Visualizar orden"
                      >
                        <Eye size={19} strokeWidth={1.8} />
                      </button>
                      
                      {/* EDITAR ORDEN */}
                      <button
                        type="button"
                        className="ordenes-btn-editar"
                        onClick={() => onEditarOrden(orden)}
                        aria-label={`Editar orden ${orden.id}`}
                        title="Editar orden"
                      >
                        <Pencil size={19} strokeWidth={1.8} />
                      </button>
                      
                      {/* ELIMINAR ORDEN*/}
                      <button
                        type="button"
                        className="ordenes-btn-eliminar"
                        onClick={() => onEliminarOrden(orden)}
                        aria-label={`Eliminar orden ${orden.id}`}
                        title="Eliminar orden"
                      >
                        <Trash2 size={19} strokeWidth={1.8} />
                      </button>

                    </div>
                  </td>


                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* PIE DE TABLA */}
      <div className="ordenes-recientes-footer">
        <span>
          {cargando || error
            ? "Resultados no disponibles"
            : `Mostrando ${ordenesVisibles.length} de ${ordenesFiltradas.length} órdenes`}
        </span>
      </div>

    </section>
  );
}

export default OrdenesRecientes;
