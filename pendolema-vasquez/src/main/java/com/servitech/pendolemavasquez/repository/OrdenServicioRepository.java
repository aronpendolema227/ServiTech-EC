
package com.servitech.pendolemavasquez.repository;

import com.servitech.pendolemavasquez.entity.OrdenServicio;
import org.springframework.data.jpa.repository.JpaRepository;

// ==========================================
// SERVITECH EC - CAPA DE PERSISTENCIA
// ==========================================
// Repositorio para gestionar las operaciones
// CRUD de las órdenes de servicio.
// ==========================================

public interface OrdenServicioRepository
        extends JpaRepository<OrdenServicio, Long> {

}
