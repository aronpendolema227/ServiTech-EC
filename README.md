# ServiTech EC

**Sistema web de gestión de órdenes de servicio técnico** desarrollado para registrar, consultar y administrar las reparaciones de equipos tecnológicos.

El proyecto implementa una arquitectura cliente-servidor con una **API REST en Java y Spring Boot**, una **interfaz en React** y una **base de datos PostgreSQL**. Utiliza **Spring Data JPA e Hibernate** para la capa de persistencia.

> **Estado del proyecto:** En desarrollo. El CRUD del backend se ha probado mediante solicitudes HTTP; en el frontend ya están integradas la consulta y la creación de órdenes. Las acciones visuales de edición y eliminación están pendientes.

## Funcionalidades

### Implementadas

- Registro de órdenes de servicio con cliente, equipo, marca, modelo y descripción del problema.
- Consulta de todas las órdenes y consulta individual por identificador mediante la API.
- Actualización y eliminación de órdenes mediante endpoints REST.
- Validación de campos obligatorios, límites de caracteres y estados permitidos en el backend.
- Dashboard con indicadores de órdenes totales, pendientes, en reparación y finalizadas.
- Tabla de órdenes recientes con búsqueda y filtro por estado.
- Formulario modal para registrar nuevas órdenes desde React.
- Actualización de las estadísticas y la tabla al crear una orden, sin recargar la página.
- Interfaz adaptable con iconos de Lucide React.

### Próximas mejoras

- Visualización detallada, edición y eliminación de órdenes desde la interfaz web.
- Página completa de administración de órdenes.
- Gráficos de estados e historial de actividad, según el alcance final del proyecto.
- Pruebas integrales y documentación de entrega.

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Frontend | React, Vite, JavaScript, CSS, Axios, Lucide React |
| Backend | Java 17, Spring Boot, Spring Web, Spring Data JPA, Bean Validation |
| Persistencia | Hibernate / JPA |
| Base de datos | PostgreSQL |
| Herramientas | Maven Wrapper, Visual Studio Code, pgAdmin 4, Git y GitHub |

## Arquitectura

```text
Navegador
   │
   ▼
React + Vite (http://localhost:5173)
   │  Solicitudes HTTP / JSON con Axios
   ▼
Spring Boot API REST (http://localhost:8082)
   │
   ├── Controller  → Recibe solicitudes
   ├── Service     → Procesa la lógica de negocio
   └── Repository  → Accede a los datos con Spring Data JPA
                         │
                         ▼
                    PostgreSQL
                  pendolema_vasquez
```

## Estructura del proyecto

```text
ServiTech-EC/
├── frontend/                      # Aplicación React + Vite
│   └── src/
│       ├── assets/                # Recursos estáticos
│       ├── components/            # Componentes reutilizables
│       │   ├── dashboard/         # Tabla de órdenes recientes
│       │   └── ordenes/           # Formulario de órdenes
│       ├── pages/                 # DashboardPage
│       ├── services/              # Cliente Axios de órdenes
│       └── styles/                # Estilos CSS
├── pendolema-vasquez/             # Backend Spring Boot
│   └── src/main/
│       ├── java/com/servitech/pendolemavasquez/
│       │   ├── config/            # Configuración CORS
│       │   ├── controller/        # API REST
│       │   ├── entity/            # Entidad OrdenServicio
│       │   ├── repository/        # Acceso a PostgreSQL
│       │   └── service/           # Lógica de negocio
│       └── resources/
│           └── application.properties
└── README.md
```

## Requisitos previos

- **JDK 17** o una versión compatible con el proyecto.
- **Node.js** y **npm** compatibles con la versión instalada de Vite.
- **PostgreSQL** en ejecución.
- Un usuario de PostgreSQL con permisos sobre la base de datos.

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/aronpendolema227/ServiTech-EC.git
cd ServiTech-EC
```

### 2. Crear la base de datos

Desde pgAdmin 4 o una consola SQL conectada a PostgreSQL, crear una base de datos denominada `pendolema_vasquez`:

```sql
CREATE DATABASE pendolema_vasquez;
```

> La tabla `ordenes_servicio` se genera a partir de la entidad JPA en el entorno de desarrollo, de acuerdo con la configuración de Hibernate.

### 3. Configurar y ejecutar el backend

El backend utiliza la base de datos local en `localhost:5432` y se inicia en el puerto `8082`. Verifica que `pendolema-vasquez/src/main/resources/application.properties` tenga la configuración adecuada para tu entorno.

En **PowerShell**, dentro de la carpeta `pendolema-vasquez`, proporciona la contraseña sin guardarla en el repositorio:

```powershell
$clave = Read-Host "Contrasena de PostgreSQL" -AsSecureString
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new("", $clave).Password
.\mvnw.cmd spring-boot:run
```

La aplicación se ejecutará en `http://localhost:8082`.

### 4. Instalar e iniciar el frontend

En **otra terminal**, desde la carpeta `frontend`:

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en el navegador.

> El backend y el frontend deben ejecutarse simultáneamente. El frontend está configurado para consumir la API local en el puerto `8082` y el backend permite solicitudes CORS desde `http://localhost:5173`.

## API REST

Ruta base: `http://localhost:8082/api/ordenes-servicio`

| Método | Ruta | Operación |
| --- | --- | --- |
| `GET` | `/api/ordenes-servicio` | Listar órdenes |
| `GET` | `/api/ordenes-servicio/{id}` | Consultar orden por ID |
| `POST` | `/api/ordenes-servicio` | Crear orden |
| `PUT` | `/api/ordenes-servicio/{id}` | Actualizar orden |
| `DELETE` | `/api/ordenes-servicio/{id}` | Eliminar orden |

Ejemplo de solicitud para crear una orden:

```json
{
  "cliente": "María Fernanda López",
  "equipo": "Laptop",
  "marca": "HP",
  "modelo": "Pavilion 15",
  "problema": "El equipo se sobrecalienta y se apaga inesperadamente"
}
```

El backend asigna por defecto el estado `PENDIENTE` y la fecha de ingreso cuando se crea la entidad sin esos valores. Los estados admitidos son `PENDIENTE`, `EN REPARACION` y `FINALIZADO`.

## Pruebas y validación

Se han realizado pruebas manuales de operaciones `GET`, `POST`, `PUT` y `DELETE` contra la API, con verificación de registros en PostgreSQL mediante pgAdmin 4. También se comprobó el rechazo de datos incorrectos mediante respuesta HTTP `400 Bad Request`.

Para comprobar la compilación:

```powershell
# Backend: dentro de pendolema-vasquez
.\mvnw.cmd clean compile
```

```bash
# Frontend: dentro de frontend
npm run build
```

## Seguridad y configuración

- **No subir contraseñas ni credenciales** al repositorio.
- La contraseña de PostgreSQL se obtiene mediante la variable de entorno `DB_PASSWORD`.
- Excluir de Git los directorios generados (`node_modules/`, `dist/`, `target/`) y archivos de configuración privada como `.env`.
- La configuración mostrada está destinada al desarrollo local; antes de publicar el sistema se deben revisar CORS, las credenciales y la configuración de producción.

## Autor

**Aron Pendolema**  
Proyecto académico de desarrollo de software.
