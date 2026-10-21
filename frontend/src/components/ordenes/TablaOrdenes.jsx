
import { useState } from "react";
import {
  Search,
  Filter,
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import "../../styles/TablaOrdenes.css";

// ==========================================
// SERVITECH EC - TABLA GENERAL DE ORDENES
// ==========================================
const REGISTROS_POR_PAGINA = 10;

function TablaOrdenes({
  ordenes = [],
  cargando = false,
  error = "",
  onVerOrden,
  onEditarOrden,
  onEliminarOrden,
}) {


  
  // ========================================
  // ESTADOS DE BUSQUEDA, FILTROS, ORDENAMIENTO Y ESTADO DE PAGINACION
  // ========================================
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");
  const [ordenamiento, setOrdenamiento] = useState("id-desc");
  const [paginaActual, setPaginaActual] = useState(1);


  // ========================================
  // FORMATEAR FECHA
  // ========================================
  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const partes = String(fecha).split("-");

    if (partes.length !== 3) return fecha;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // ========================================
  // CONFIGURAR ESTADOS
  // ========================================
  const obtenerEstado = (estado) => {
    const estados = {
      PENDIENTE: {
        texto: "Pendiente",
        clase: "pendiente",
      },
      "EN REPARACION": {
        texto: "En reparación",
        clase: "reparacion",
      },
      FINALIZADO: {
        texto: "Finalizada",
        clase: "finalizada",
      },
    };

    return estados[estado] || {
      texto: estado || "Sin estado",
      clase: "desconocido",
    };
  };

  
  // ========================================
  // ORDENAR REGISTROS
  // ========================================
  const ordenesOrdenadas = [...ordenes].sort((a, b) => {

    const idA = Number(a.id);
    const idB = Number(b.id);

    const fechaA = String(a.fechaIngreso ?? "");
    const fechaB = String(b.fechaIngreso ?? "");

    switch (ordenamiento) {

      // ID ASCENDENTE
      case "id-asc":
        return idA - idB;

      // FECHA DESCENDENTE
      case "fecha-desc": {
        const resultado = fechaB.localeCompare(fechaA);
        return resultado || idB - idA;
      }

      // FECHA ASCENDENTE
      case "fecha-asc": {
        const resultado = fechaA.localeCompare(fechaB);
        return resultado || idA - idB;
      }

      // ID DESCENDENTE (PREDETERMINADO)
      case "id-desc":
      default:
        return idB - idA;
    }
  });

  // ========================================
  // NORMALIZAR TEXTO PARA BUSQUEDAS
  // ========================================
  const normalizarTexto = (valor) =>
    String(valor ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // ========================================
  // APLICAR BUSQUEDA Y FILTRO DE ESTADOS
  // ========================================
  const textoBuscado = normalizarTexto(busqueda.trim());

  const ordenesFiltradas = ordenesOrdenadas.filter((orden) => {

    // Filtrar por estado
    const coincideEstado =
      estadoFiltro === "TODOS" ||
      orden.estado === estadoFiltro;

    // Construir texto para buscar
    
    const contenido = [
      orden.id,
      `#${orden.id}`,
      orden.cliente,
      orden.equipo,
      orden.marca,
      orden.modelo,
      orden.problema,
      orden.estado, // Permitir buscar por estado
    ]
      .map(normalizarTexto)
      .join(" ");


    // Comprobar la busqueda
    const coincideBusqueda = contenido.includes(textoBuscado);

    return coincideEstado && coincideBusqueda;
  });
  // ========================================
  // CALCULAR PAGINACION
  // ========================================

  // Cantidad de registros filtrados
  const totalRegistros = ordenesFiltradas.length;

  // Calcular total de páginas (mínimo 1)
  const totalPaginas = Math.max(
    1,
    Math.ceil(totalRegistros / REGISTROS_POR_PAGINA)
  );

  // Evitar mostrar una página que ya no existe
  const paginaVisible = Math.min(paginaActual, totalPaginas);

  // Posición inicial y final
  const indiceInicial =
    (paginaVisible - 1) * REGISTROS_POR_PAGINA;

  const indiceFinal =
    indiceInicial + REGISTROS_POR_PAGINA;

  // Obtener únicamente las órdenes de esta página
  const ordenesPaginadas = ordenesFiltradas.slice(
    indiceInicial,
    indiceFinal
  );

  // Rango de registros mostrados
  const primerRegistro =
    totalRegistros === 0 ? 0 : indiceInicial + 1;

  const ultimoRegistro = Math.min(
    indiceFinal,
    totalRegistros
  );

  // Mostrar como máximo 5 números de página
  const inicioVentana = Math.max(
    1,
    Math.min(paginaVisible - 2, totalPaginas - 4)
  );

  const numerosPagina = Array.from(
    { length: Math.min(totalPaginas, 5) },
    (_, indice) => inicioVentana + indice
  );

  // ========================================
  // INTERFAZ
  // ========================================
  return (
    <div className="tabla-ordenes">
  
      {/* ====================================
          BUSCADOR Y FILTROS
          ==================================== */}
      <div className="tabla-ordenes-filtros">

        {/* BUSCADOR */}
        <div className="tabla-ordenes-busqueda">
          <Search size={19} strokeWidth={1.8} />

          <input
            type="search"
            placeholder="Buscar por ID, cliente, equipo, marca o problema..."
            aria-label="Buscar órdenes de servicio"
            value={busqueda}
            
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}

          />
        </div>

        {/* FILTRO DE ESTADO */}
        <div className="tabla-ordenes-filtro-estado">
          <Filter size={18} strokeWidth={1.8} />

          <select
            aria-label="Filtrar por estado"
            value={estadoFiltro}            
            onChange={(e) => {
              setEstadoFiltro(e.target.value);
              setPaginaActual(1);
            }}

          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN REPARACION">En reparación</option>
            <option value="FINALIZADO">Finalizadas</option>
          </select>
        </div>
        
        {/* ====================================
            ORDENAMIENTO DE REGISTROS
            ==================================== */}
        <div className="tabla-ordenes-filtro-orden">

          <ArrowDownUp size={18} strokeWidth={1.8} />

          <select
            aria-label="Ordenar órdenes de servicio"
            value={ordenamiento}            
            onChange={(e) => {
              setOrdenamiento(e.target.value);
              setPaginaActual(1);
            }}

          >
            <option value="id-desc">
              Más recientes primero
            </option>

            <option value="id-asc">
              Más antiguos primero
            </option>

            <option value="fecha-desc">
              Fecha: más nueva primero
            </option>

            <option value="fecha-asc">
              Fecha: más antigua primero
            </option>
          </select>

        </div>


      </div>


      <div className="tabla-ordenes-contenedor">
        <table aria-label="Listado general de órdenes">

          {/* ENCABEZADOS */}
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Equipo</th>
              <th>Marca / Modelo</th>
              <th>Problema</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          {/* REGISTROS */}
          <tbody>

            {cargando ? (
              <tr>
                <td colSpan={8} className="tabla-ordenes-vacio">
                  Cargando órdenes de servicio...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="tabla-ordenes-vacio">
                  No se pudieron consultar las órdenes.
                </td>
              </tr>
            ) : ordenesFiltradas.length === 0? (
              <tr>
                <td colSpan={8} className="tabla-ordenes-vacio">
                  {ordenesOrdenadas.length === 0
                    ? "No existen órdenes registradas."
                    : "No se encontraron órdenes con los filtros seleccionados."}
                </td>
              </tr>
            ) : (
              
              ordenesPaginadas.map((orden) => {
                const estado = obtenerEstado(orden.estado);

                return (
                  <tr key={orden.id}>

                    <td className="tabla-ordenes-id">
                      #{orden.id}
                    </td>

                    <td className="tabla-ordenes-cliente">
                      {orden.cliente}
                    </td>

                    <td>{orden.equipo}</td>

                    <td>
                      <div className="tabla-ordenes-equipo">
                        <strong>{orden.marca}</strong>
                        <span>{orden.modelo || "Sin modelo"}</span>
                      </div>
                    </td>

                    <td
                      className="tabla-ordenes-problema"
                      title={orden.problema || ""}
                    >
                      {orden.problema}
                    </td>

                    <td>
                      <span
                        className={`tabla-ordenes-estado ${estado.clase}`}
                      >
                        {estado.texto}
                      </span>
                    </td>

                    <td>
                      {formatearFecha(orden.fechaIngreso)}
                    </td>
                    
                    {/* ====================================
                        ACCIONES DE LA ORDEN
                        ==================================== */}
                    <td>
                      <div className="tabla-ordenes-acciones">

                        {/* VISUALIZAR ORDEN */}
                        <button
                          type="button"
                          className="tabla-ordenes-btn-ver"
                          onClick={() => onVerOrden(orden)}
                          aria-label={`Visualizar orden ${orden.id}`}
                          title="Visualizar orden"
                        >
                          <Eye size={19} strokeWidth={1.8} />
                        </button>
                        
                        {/* ====================================
                            EDITAR ORDEN
                            ==================================== */}
                        <button
                          type="button"
                          className="tabla-ordenes-btn-editar"
                          onClick={() => onEditarOrden(orden)}
                          aria-label={`Editar orden ${orden.id}`}
                          title="Editar orden"
                        >
                          <Pencil size={19} strokeWidth={1.8} />
                        </button>

                        
                        {/* ====================================
                            ELIMINAR ORDEN
                            ==================================== */}
                        <button
                          type="button"
                          className="tabla-ordenes-btn-eliminar"
                          onClick={() => onEliminarOrden(orden)}
                          aria-label={`Eliminar orden ${orden.id}`}
                          title="Eliminar orden"
                        >
                          <Trash2 size={19} strokeWidth={1.8} />
                        </button>



                      </div>
                    </td>


                  </tr>
                );
              })
            )}

          </tbody>
        </table>
      </div>

      
      {/* ====================================
          PIE DE TABLA Y PAGINACION
          ==================================== */}
      <div className="tabla-ordenes-footer">

        {/* CANTIDAD DE REGISTROS */}
        <span>
          {cargando || error
            ? "Resultados no disponibles"
            : `Mostrando ${primerRegistro}-${ultimoRegistro} de ${totalRegistros} resultados`}
        </span>

        {/* CONTROLES DE PAGINACION */}
        {!cargando && !error && totalPaginas > 1 && (
          <nav
            className="tabla-ordenes-paginacion"
            aria-label="Paginación de órdenes"
          >

            {/* PAGINA ANTERIOR */}
            <button
              type="button"
              className="tabla-ordenes-btn-pagina"
              onClick={() =>
                setPaginaActual(Math.max(1, paginaVisible - 1))
              }
              disabled={paginaVisible === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft size={18} />
            </button>

            {/* NUMEROS DE PAGINA */}
            {numerosPagina.map((numero) => (
              <button
                key={numero}
                type="button"
                className={`tabla-ordenes-btn-pagina ${
                  paginaVisible === numero ? "activa" : ""
                }`}
                onClick={() => setPaginaActual(numero)}
                aria-label={`Ir a la página ${numero}`}
                aria-current={
                  paginaVisible === numero ? "page" : undefined
                }
              >
                {numero}
              </button>
            ))}

            {/* PAGINA SIGUIENTE */}
            <button
              type="button"
              className="tabla-ordenes-btn-pagina"
              onClick={() =>
                setPaginaActual(
                  Math.min(totalPaginas, paginaVisible + 1)
                )
              }
              disabled={paginaVisible === totalPaginas}
              aria-label="Página siguiente"
            >
              <ChevronRight size={18} />
            </button>

          </nav>
        )}

      </div>


    </div>
  );
}

export default TablaOrdenes;
