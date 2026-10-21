
import axios from "axios";

// SERVITECH EC - SERVICIO DE ORDENES
// Conexion del frontend React con
// la API REST desarrollada en Spring Boot.

// Configuracion principal de Axios
const api = axios.create({
  baseURL: "http://localhost:8082/api/ordenes-servicio",
  headers: {
    "Content-Type": "application/json",
  },
});

// CREATE - REGISTRAR ORDEN
export const crearOrden = async (orden) => {
  const respuesta = await api.post("", orden);
  return respuesta.data;
};

// READ - CONSULTAR TODAS LAS ORDENES
export const listarOrdenes = async () => {
  const respuesta = await api.get("");
  return respuesta.data;
};

// READ - BUSCAR ORDEN POR ID
export const buscarOrdenPorId = async (id) => {
  const respuesta = await api.get(`/${id}`);
  return respuesta.data;
};

// UPDATE - ACTUALIZAR ORDEN
export const actualizarOrden = async (id, orden) => {
  const respuesta = await api.put(`/${id}`, orden);
  return respuesta.data;
};

// DELETE - ELIMINAR ORDEN
export const eliminarOrden = async (id) => {
  await api.delete(`/${id}`);
};
