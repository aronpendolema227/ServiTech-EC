
package com.servitech.pendolemavasquez.controller;

import com.servitech.pendolemavasquez.entity.OrdenServicio;
import com.servitech.pendolemavasquez.service.OrdenServicioService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// SERVITECH EC - CONTROLADOR REST
// Gestiona las peticiones HTTP para realizar
// las operaciones CRUD de órdenes de servicio.


@RestController
@RequestMapping("/api/ordenes-servicio")
public class OrdenServicioController {
    private final OrdenServicioService service;
    // INYECCION DE DEPENDENCIAS
    public OrdenServicioController(
            OrdenServicioService service) {
        this.service = service;
    }
    // CREATE - REGISTRAR NUEVA ORDEN
    @PostMapping
    public ResponseEntity<OrdenServicio> crear(
            @Valid @RequestBody OrdenServicio orden) {


        OrdenServicio nuevaOrden = service.crear(orden);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevaOrden);
    }
    // READ - CONSULTAR TODAS LAS ORDENES
    @GetMapping
    public ResponseEntity<List<OrdenServicio>> listar() {

        return ResponseEntity.ok(service.listar());
    }
    // READ - CONSULTAR ORDEN POR ID
    @GetMapping("/{id}")
    public ResponseEntity<OrdenServicio> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.buscarPorId(id));
    }
    // UPDATE - ACTUALIZAR ORDEN EXISTENTE
    @PutMapping("/{id}")
    public ResponseEntity<OrdenServicio> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody OrdenServicio datos) {


        return ResponseEntity.ok(
                service.actualizar(id, datos)
        );
    }
    // DELETE - ELIMINAR ORDEN
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id) {

        service.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}
