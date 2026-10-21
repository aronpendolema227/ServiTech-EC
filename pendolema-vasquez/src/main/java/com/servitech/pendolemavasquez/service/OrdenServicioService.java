
package com.servitech.pendolemavasquez.service;

import com.servitech.pendolemavasquez.entity.OrdenServicio;
import com.servitech.pendolemavasquez.repository.OrdenServicioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
// SERVITECH EC - CAPA DE LOGICA DE NEGOCIO
@Service
public class OrdenServicioService {

    private final OrdenServicioRepository repository;
    // INYECCION DE DEPENDENCIAS
    public OrdenServicioService(
            OrdenServicioRepository repository) {
        this.repository = repository;
    }
    // CREATE - CREAR ORDEN DE SERVICIO
    @Transactional
    public OrdenServicio crear(OrdenServicio orden) {
        orden.setId(null);
        return repository.save(orden);
    }
    // READ - LISTAR TODAS LAS ORDENES
    @Transactional(readOnly = true)
    public List<OrdenServicio> listar() {
        return repository.findAll();
    }
    // READ - BUSCAR UNA ORDEN POR ID
    @Transactional(readOnly = true)
    public OrdenServicio buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Orden de servicio no encontrada"
                        )
                );
    }
    // UPDATE - ACTUALIZAR ORDEN
    @Transactional
    public OrdenServicio actualizar(
            Long id, OrdenServicio datos) {

        OrdenServicio orden = buscarPorId(id);

        orden.setCliente(datos.getCliente());
        orden.setEquipo(datos.getEquipo());
        orden.setMarca(datos.getMarca());
        orden.setModelo(datos.getModelo());
        orden.setProblema(datos.getProblema());
        orden.setEstado(datos.getEstado());
        orden.setFechaIngreso(datos.getFechaIngreso());

        return repository.save(orden);
    }
    // DELETE - ELIMINAR ORDEN
    @Transactional
    public void eliminar(Long id) {

        OrdenServicio orden = buscarPorId(id);

        repository.delete(orden);
    }
}
