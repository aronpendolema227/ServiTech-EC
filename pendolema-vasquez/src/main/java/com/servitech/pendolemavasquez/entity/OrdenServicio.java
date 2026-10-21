
package com.servitech.pendolemavasquez.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;


@Entity
@Table(name = "ordenes_servicio")
public class OrdenServicio {

    
    // =====================================
    // IDENTIFICADOR
    // =====================================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================
    // DATOS DEL CLIENTE Y EQUIPO
    // =====================================
    @NotBlank(message = "El nombre del cliente es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    @Column(nullable = false, length = 100)
    private String cliente;

    @NotBlank(message = "El tipo de equipo es obligatorio")
    @Size(max = 50, message = "El equipo no puede superar 50 caracteres")
    @Column(nullable = false, length = 50)
    private String equipo;

    @NotBlank(message = "La marca es obligatoria")
    @Size(max = 50, message = "La marca no puede superar 50 caracteres")
    @Column(nullable = false, length = 50)
    private String marca;

    @Size(max = 50, message = "El modelo no puede superar 50 caracteres")
    @Column(length = 50)
    private String modelo;

    // =====================================
    // INFORMACION DEL SERVICIO TECNICO
    // =====================================
    @NotBlank(message = "La descripcion del problema es obligatoria")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String problema;

    @NotBlank(message = "El estado es obligatorio")
    @Pattern(
        regexp = "PENDIENTE|EN REPARACION|FINALIZADO",
        message = "El estado debe ser PENDIENTE, EN REPARACION o FINALIZADO"
    )
    @Column(nullable = false, length = 30)
    private String estado = "PENDIENTE";

    @NotNull(message = "La fecha de ingreso es obligatoria")
    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso = LocalDate.now();


    // =====================================
    // CONSTRUCTOR VACIO PARA JPA
    // =====================================
    public OrdenServicio() {
    }

    // =====================================
    // GETTERS Y SETTERS
    // =====================================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getEquipo() {
        return equipo;
    }

    public void setEquipo(String equipo) {
        this.equipo = equipo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getProblema() {
        return problema;
    }

    public void setProblema(String problema) {
        this.problema = problema;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }
}
