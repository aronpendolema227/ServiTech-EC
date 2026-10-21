
package com.servitech.pendolemavasquez.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// SERVITECH EC - CONFIGURACION CORS
// Permite la comunicacion entre React
// y nuestra API REST de Spring Boot.
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")

                // Frontend React
                .allowedOrigins("http://localhost:5173")

                // Metodos HTTP permitidos
                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )

                // Encabezados permitidos
                .allowedHeaders("*");
    }
}
