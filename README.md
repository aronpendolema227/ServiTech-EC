# ServiTech EC

**Sistema web de gestión de órdenes de servicio técnico** para registrar, consultar y administrar reparaciones de equipos tecnológicos.

ServiTech EC es un proyecto académico **full-stack** con una API REST desarrollada en **Java y Spring Boot**, una interfaz web construida con **React y Vite** y una base de datos **PostgreSQL**. La persistencia se implementa mediante **Spring Data JPA e Hibernate**.

> **Estado del proyecto:** funcionalidades principales implementadas y probadas. El registro, la consulta, la edición y la eliminación de órdenes están disponibles tanto desde el Dashboard como desde el módulo de Órdenes de servicio.

## Funcionalidades

### Gestión de órdenes de servicio

- **Registrar** órdenes con nombre del cliente, equipo, marca, modelo y descripción del problema.
- **Consultar** el detalle de cada orden en un modal, incluida la descripción completa del problema.
- **Editar** los datos de una orden y actualizar su estado de reparación.
- **Eliminar** órdenes mediante un modal de confirmación para evitar eliminaciones accidentales.
- Validar los campos obligatorios, las longitudes permitidas y los estados de las órdenes en el backend.
- Actualizar las tablas y los indicadores después de operaciones exitosas, sin recargar manualmente la página.

Los estados admitidos son `PENDIENTE`, `EN REPARACION` y `FINALIZADO`.

### Dashboard

- Tarjetas con el **total de órdenes** y las cantidades **pendientes**, **en reparación** y **finalizadas**.
- Porcentajes de cada estado respecto del total.
- Tabla con las **cinco órdenes más recientes**.
- Búsqueda y filtro por estado en el listado reciente.
- Acceso a las operaciones de registro, visualización, edición y eliminación mediante botones y modales.

### Módulo «Órdenes de servicio»

- Listado completo de órdenes obtenidas desde PostgreSQL.
- Búsqueda por **ID, cliente, equipo, marca, modelo, problema o estado**, sin distinguir entre mayúsculas y minúsculas ni entre textos con y sin tildes.
- Filtro por estado: todas, pendientes, en reparación o finalizadas.
- Ordenamiento por **ID** y **fecha de ingreso**, ascendente o descendente.
- **Paginación de 10 registros por página**; búsqueda, filtros y ordenamiento funcionan de manera conjunta.
- Operaciones **CRUD** mediante los mismos modales reutilizables del Dashboard.
- Indicadores generales conectados a los registros de la base de datos.

### Interfaz

- Diseño adaptable a diferentes tamaños de pantalla.
- Paleta de colores de ServiTech EC y estilos CSS organizados por componente.
- Iconos de **Lucide React** para navegación, botones y acciones.
- Componentes reutilizables para facilitar el mantenimiento.

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Frontend | React, Vite, JavaScript, CSS, Axios, Lucide React |
| Backend | Java, Spring Boot, Spring Web, Spring Data JPA, Bean Validation |
| Persistencia | Hibernate / JPA |
| Base de datos | PostgreSQL |
| Herramientas | Maven Wrapper, Visual Studio Code, pgAdmin 4, Git y GitHub |

## Arquitectura

```text
Navegador
   │
   ▼
React + Vite (http://localhost:5173)
   │  Solicitudes HTTP / JSON mediante Axios
   ▼
Spring Boot API REST (http://localhost:8082)
   │
   ├── Controller   → Recibe las solicitudes HTTP
   ├── Service      → Ejecuta la lógica de negocio
   └── Repository   → Gestiona el acceso a datos con JPA
                          │
                          ▼
                      PostgreSQL
                    pendolema_vasquez
```

## Estructura del proyecto

```text
ServiTech-EC/
├── frontend/                           # Aplicación React + Vite
│   ├── public/
│   └── src/
│       ├── assets/                     # Recursos de interfaz
│       ├── components/
│       │   ├── dashboard/
│       │   │   └── OrdenesRecientes.jsx
│       │   ├── ordenes/
│       │   │   ├── TablaOrdenes.jsx
│       │   │   ├── OrdenFormulario.jsx
│       │   │   ├── OrdenDetalle.jsx
│       │   │   ├── OrdenEditar.jsx
│       │   │   └── OrdenEliminar.jsx
│       │   ├── Header.jsx
│       │   └── Sidebar.jsx
│       ├── pages/
│       │   ├── DashboardPage.jsx
│       │   └── OrdenesPage.jsx
│       ├── services/
│       │   └── ordenServicioService.js
│       ├── styles/                     # Estilos de páginas y componentes
│       ├── App.jsx
│       └── main.jsx
├── pendolema-vasquez/                  # Backend Spring Boot
│   ├── src/main/
│   │   ├── java/com/servitech/pendolemavasquez/
│   │   │   ├── config/                 # Configuración CORS
│   │   │   ├── controller/             # Endpoints REST
│   │   │   ├── entity/                 # Entidad OrdenServicio
│   │   │   ├── repository/             # Acceso a PostgreSQL
│   │   │   └── service/                # Lógica de negocio
│   │   └── resources/
│   │       └── application.properties
│   ├── pom.xml
│   └── mvnw.cmd
├── .gitignore
└── README.md
```

## Requisitos previos

- **JDK** compatible con la versión de Java configurada en `pendolema-vasquez/pom.xml` (el proyecto se inició con Java 17).
- **Node.js** y **npm** compatibles con la versión de Vite del proyecto.
- **PostgreSQL** en ejecución y un usuario con permisos para acceder a la base de datos.
- **Git** para clonar el repositorio.

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/aronpendolema227/ServiTech-EC.git
cd ServiTech-EC
```

### 2. Crear la base de datos

Desde pgAdmin 4 o una consola SQL conectada a PostgreSQL, crea la base de datos:

```sql
CREATE DATABASE pendolema_vasquez;
```

> En el entorno de desarrollo, la tabla `ordenes_servicio` puede generarse a partir de la entidad JPA, según la configuración de Hibernate en `application.properties`.

### 3. Configurar y ejecutar el backend

Comprueba que `pendolema-vasquez/src/main/resources/application.properties` esté configurado para conectarse a PostgreSQL en `localhost:5432`, usar la base `pendolema_vasquez` y ejecutar la API en el puerto `8082`.

En **PowerShell**, entra en la carpeta del backend y proporciona la contraseña de la base de datos mediante una variable de entorno (sin escribirla directamente en el repositorio):

```powershell
cd pendolema-vasquez
$clave = Read-Host "Contrasena de PostgreSQL" -AsSecureString
$env:DB_PASSWORD = [System.Net.NetworkCredential]::new("", $clave).Password
.\mvnw.cmd spring-boot:run
```

> La configuración del backend debe utilizar `${DB_PASSWORD}` para leer esa variable de entorno.

La API estará disponible en `http://localhost:8082`.

### 4. Instalar y ejecutar el frontend

En **otra terminal**, desde la raíz del repositorio:

```powershell
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

> El backend y el frontend deben ejecutarse simultáneamente. En desarrollo, el frontend consume la API local del puerto `8082` y el backend debe permitir las solicitudes CORS del origen `http://localhost:5173`.

## API REST

**Ruta base:** `http://localhost:8082/api/ordenes-servicio`

| Método | Ruta | Operación |
| --- | --- | --- |
| `GET` | `/api/ordenes-servicio` | Listar todas las órdenes |
| `GET` | `/api/ordenes-servicio/{id}` | Consultar una orden por ID |
| `POST` | `/api/ordenes-servicio` | Registrar una orden |
| `PUT` | `/api/ordenes-servicio/{id}` | Actualizar una orden |
| `DELETE` | `/api/ordenes-servicio/{id}` | Eliminar una orden |

Ejemplo de solicitud para registrar una orden:

```json
{
  "cliente": "María Fernanda López",
  "equipo": "Laptop",
  "marca": "HP",
  "modelo": "Pavilion 15",
  "problema": "El equipo se sobrecalienta y se apaga inesperadamente"
}
```

Para registros nuevos, el backend asigna el estado `PENDIENTE` y la fecha de ingreso cuando esos valores no se proporcionan, de acuerdo con las reglas de la entidad.

## Pruebas y validación

Se han comprobado manualmente:

- Las operaciones REST `GET`, `POST`, `PUT` y `DELETE`, incluidas verificaciones de sus efectos en PostgreSQL con pgAdmin 4.
- El rechazo de datos inválidos mediante la respuesta HTTP `400 Bad Request`.
- Los formularios y modales de **crear, consultar, editar y eliminar** desde las dos páginas principales.
- La actualización de tarjetas y tablas después de crear, modificar o eliminar órdenes.
- La búsqueda, los filtros por estado, el ordenamiento y la paginación del listado general.

### Datos de prueba locales

Para verificar el sistema se cargaron **20 órdenes ficticias** en PostgreSQL, distribuidas entre el **16 y el 20 de octubre de 2026**:

| Estado | Cantidad |
| --- | ---: |
| Pendiente | 5 |
| En reparación | 10 |
| Finalizada | 5 |
| **Total** | **20** |

Se registraron **4 órdenes por día**, durante cinco días. Esto permitió comprobar el Dashboard (cinco órdenes recientes) y el listado general (dos páginas de diez registros).

**Importante:** estos registros se insertaron directamente en una base de datos local y **no forman parte automáticamente del repositorio**. Al clonar el proyecto y crear una base nueva, las órdenes no aparecerán a menos que se carguen datos. Los números de ID tampoco tienen que empezar en 1, ya que PostgreSQL gestiona la secuencia de identificadores.

Para revisar los datos existentes:

```sql
SELECT estado, COUNT(*) AS cantidad
FROM public.ordenes_servicio
GROUP BY estado
ORDER BY estado;

SELECT fecha_ingreso, COUNT(*) AS total_ordenes
FROM public.ordenes_servicio
GROUP BY fecha_ingreso
ORDER BY fecha_ingreso;
```

### Compilación

**Backend**, desde `pendolema-vasquez`:

```powershell
.\mvnw.cmd clean compile
```

**Frontend**, desde `frontend`:

```powershell
npm run build
```

## Seguridad y configuración

- **No subir contraseñas, tokens ni credenciales reales** a GitHub.
- Usar la variable de entorno `DB_PASSWORD` para proporcionar la contraseña de PostgreSQL en desarrollo.
- Excluir del control de versiones los archivos generados (`node_modules/`, `dist/`, `target/`) y configuraciones privadas (`.env` y similares).
- La configuración documentada corresponde a un **entorno de desarrollo local**. Antes de desplegar el sistema públicamente, se deben revisar la autenticación, la autorización, la política CORS, los secretos y la configuración de producción.

## Autor

**Aron Pendolema**  
Proyecto académico de desarrollo de software.
