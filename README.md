# ARLA - Café Ludoteca Management App

Aplicación web para la gestión de un café ludoteca llamado ARLA, construida con el stack PERN (PostgreSQL, Express, React, Node.js).

## Arquitectura

- **Backend**: API REST con Node.js, Express y TypeScript. Usa Prisma como ORM para PostgreSQL.
- **Frontend**: React 19 con Vite, TypeScript y Tailwind CSS. Estética neumorfista.
- **Base de Datos**: PostgreSQL con modelos para Usuarios, Mesas, Juegos, Ventas y Reservas.

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL
- Docker (opcional para la base de datos)

### Backend
1. Navega a `backend/`
2. Instala dependencias: `npm install`
3. Configura `.env` con `DATABASE_URL` y `JWT_SECRET`
4. Ejecuta migraciones: `npm run prisma:migrate`
5. Genera cliente Prisma: `npm run prisma:generate`
6. Inicia el servidor: `npm run dev`

### Frontend
1. Navega a `frontend/`
2. Instala dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`

### Base de Datos con Docker
Ejecuta `docker-compose up` en la raíz del proyecto para iniciar PostgreSQL.

## Estructura del Proyecto

```
ARLA/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── types/
│   ├── TEST/
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Modelos de Datos

- **User**: Roles (Admin, Staff, Cliente), credenciales, historial de visitas. Perfil extendido: nombres, apellidos, celular, y cumpleaños (DD/MM).
- **Table**: Capacidad, ubicación (Terraza/Salón), estado (Disponible, Ocupado, Reservado).
- **Game (Ludoteca)**: Catálogo de juegos con múltiples categorías por juego, dificultad basada en catálogo (Fácil, Medio, Difícil), duración, stock y rango de jugadores.
- **MenuItem (Gastronomía)**: Platos y bebidas con categorías, precios y disponibilidad.
- **Promotion (Marketing)**: Título, descuento, fecha de expiración y estado activo.
- **Sale**: Registro de ventas vinculadas a mesas.
- **Reservation**: Reservas con fecha, hora, número de personas y prepago opcional.

## API Endpoints

### Autenticación y Perfil
- `POST /api/auth/register` - Registro de usuario (Validación Zod para cumpleaños DD/MM)
- `POST /api/auth/login` - Inicio de sesión (Retorna JWT)
- `GET /api/auth/profile` - Ver perfil (Protegido por JWT)

### Gestión Administrativa (Protegido Admin/SuperAdmin)
- `CRUD /api/admin/games` - Catálogo de juegos
- `CRUD /api/admin/menu` - Carta gastronómica
- `CRUD /api/admin/promotions` - Gestión de promociones

### Reservas
- `POST /api/reservations` - Crear reserva
- `GET /api/reservations` - Listar todas (Admin) o por usuario
- `PUT/DELETE /api/reservations/:id` - Gestión de reservas

## Seguridad y Validación

- **Validation**: Middleware basado en **Zod** asegura que los formatos de entrada sean correctos (ej: cumpleaños DD/MM).
- **Security Headers**: **Helmet** configura headers HTTP seguros.
- **Autenticación**: **JWT** para sesiones seguras y middleware de autorización por roles.
- **Logging**: **Morgan** para registro de transacciones y tráfico.

## Tests

Navega a la carpeta `backend/` y ejecuta `npm run test`. Los tests utilizan Jest y mocks para simular la base de datos.

## Agentes Personalizados
Consulta `AGENTS.md` para definiciones de agentes especializados en diferentes aspectos del proyecto.

## Correcciones Recientes
- Corregida referencia circular en `backend/src/services/reservationService.ts` que impedía la compilación.
- Corregida configuración de Jest en `backend/jest.config.js` y movida carpeta `TEST` al directorio del backend para correcta ejecución de pruebas unitarias.
- Implementado mocking de Prisma en las pruebas de reservas para permitir ejecución sin base de datos activa.
- Actualizados scripts de build y dependencias en backend y frontend.
- Corregidos errores de importación en `frontend/src/App.tsx` (logos no definidos).
- Actualizada la identidad visual: se cambió el subtítulo de "Café & Ludoteca" a "CAFÉ Y JUEGOS DE MESA" en toda la aplicación.
- Rediseñada la vista de Login: ahora incluye el logo oficial `logo_arla.jpg` y mantiene el botón de acceso directo al Registro debajo del formulario para una mejor experiencia de usuario (UX). Se ha retirado de la navegación principal para un diseño más limpio.
- Implementados módulos de gestión administrativa: Panel central con pestañas para el Registro de Juegos (Ludoteca), Gestión de Carta (Gastronomía) y Lanzamiento de Promociones (Marketing). Ahora con soporte para **URL de imágenes**.
- Sincronización dinámica de datos: Las vistas públicas (`Ludoteca`, `Menú`, `Promociones`) ahora consumen datos en tiempo real desde la base de datos PostgreSQL, mostrando las imágenes de cada item si están configuradas.
- Sistema de feedback administrativo: Implementados estados de "Guardando...", "Actualizando..." y mensajes de éxito/error flash tras cada operación de registro o edición.
- Corregidos errores críticos en procedimientos de edición: Se optimizó la limpieza de datos en el frontend (IDs en el body, limpieza de `NaN` en números) y se flexibilizaron los esquemas de validación Zod en el backend para permitir actualizaciones parciales y parámetros de ruta.
- Configurada suite de pruebas integrales: Añadida carpeta `backend/TEST/admin.test.ts` para verificar los flujos de CRUD (Create, Read, Update, Delete) de juegos y menú, garantizando la integridad de los procedimientos de datos.
- Integrados favicons oficiales en el frontend (soporte para navegadores, móviles y WebApp).
- Añadido archivo `AGENTS.md` para gestión de agentes personalizados.
- **Refactorizada la gestión de juegos**: implementación de tablas separadas para Dificultad y Categorías, permitiendo múltiples categorías por cada juego y una lista preestablecida de 23 categorías estándar.
- **Actualizada la interfaz administrativa**: soporte para selección múltiple de categorías y asignación dinámica de niveles de dificultad dinámicos.
- **Mejorada la experiencia de usuario (UX) en catálogos**: implementada paginación en el catálogo de juegos y la carta gastronómica. Se añadieron barras de búsqueda por nombre y descripciones, y, en el catálogo de juegos, los filtros de categorías y dificultad ahora utilizan componentes de selección múltiple con capacidad de búsqueda, optimizando la exploración del contenido.
- **Implementado el registro avanzado de reservas de mesas**: Se añadieron 2 mesas de 4 jugadores y 2 de 8 jugadores al espacio lúdico. Al iniciar una reserva, los usuarios pueden seleccionar si desean compartir mesa. El sistema prioriza las mesas de 8 jugadores ya habilitadas para compartir. Los usuarios pueden preseleccionar hasta 2 juegos de mesa y, al unirse a una mesa compartida, pueden ver los jugadores actuales y los juegos ya elegidos por ellos, con una pantalla de confirmación antes de guardar.
- **Refactorización de Navegación a React Router**: Migración de un sistema de estados internos a un enrutamiento declarativo con URLs persistentes (`/`, `/ludoteca`, `/menu`, `/reserva`, `/perfil`, `/admin/reservas`).
- **Página de Inicio Dinámica**:
    - **Carrusel de Promociones**: Sistema automatizado y manual para visualizar ofertas directamente desde la base de datos (`/api/promociones`).
    - **Dashboard Unificado**: Acceso rápido a las secciones clave y visualización inmediata de las reservas próximas del usuario.
- **Panel de Administración de Reservas Avanzado**:
    - Agrupación por mesa física para una mejor visualización logística.
    - Cálculo de aforo en tiempo real basado en el estado de las reservas.
    - Sistema de confirmación de asistencia con actualización instantánea de disponibilidad.
- **Arquitectura de Seguridad**: Implementación de rutas protegidas (`ProtectedRoute`) y redirecciones automáticas tras el cierre de sesión.
- **Evolución del Modelo de Datos**: Incorporación de estados de reserva (`PENDING`, `CONFIRMED`, `CANCELLED`) para un control granular del flujo de negocio.
- **Optimización Logística del Panel de Reservas**: Rediseño de la vista administrativa (`/admin/reservas`) para agrupar reservas por mesa física. Se implementó una visualización unificada de jugadores y juegos, cálculo automático de aforo libre por mesa y un sistema de confirmación de asistencia individual mediante botones dinámicos para cada jugador.
- **Corrección en Gestión de Juegos (Error 400)**: Se resolvió un error de "Bad Request" al intentar modificar juegos. Se actualizaron los esquemas de validación Zod para incluir campos faltantes (`price`, `stockVenta`) y se refactorizó el servicio administrativo (`adminService.ts`) para filtrar correctamente los datos de relación (como `categories` , `difficulty`, e `id` en el body) antes de enviarlos a Prisma. Se incluyó un script de prueba de integración (`apiTest.js`) para garantizar la estabilidad futura de este módulo.
- **Autenticación con Verificación por Correo**: Implementado flujo de registro con envío de código de 6 dígitos (expiración 15 min). La cuenta requiere activación vía `/verify` antes de permitir el login (`emailVerified`).
- **Reserva en Dos Etapas con Selección Global**:
    - **Rediseño de la Card de Juego (UI/UX)**:
        - **Frontal**: Se reestructuró para mostrar imagen, título, categorías, número de jugadores (mín-máx) y tiempo de juego de forma jerárquica.
        - **Dorso**: Se mejoró la legibilidad de la descripción (fuente más legible y contenedor con relieve), dificultad con indicador visual y stock dinámico que cambia según el modo (Reserva vs Venta).
        - **Interactividad**: Se añadieron micro-animaciones en el giro y estados visuales más claros para la selección de juegos.
    - **Step 1**: Configuración de mesa, fecha y aforo.
    - **Step 2**: Selección de mesa basada en disponibilidad real + **Modo Selección de Juegos** en la Ludoteca.
    - **Integración con Ludoteca**: Los usuarios navegan al catálogo completo de juegos para elegir hasta 2 títulos. La selección se persiste entre rutas usando `localStorage`.
    - **Integración de Nodemailer**: Implementado sistema de envío real de correos electrónicos para la verificación de cuentas. Se configuró un servicio de mensajería con soporte para SMTP, plantillas HTML personalizadas y manejo de errores en el proceso de registro.
- **Refactorización de Ludoteca (Estabilidad)**: Se corrigió un error crítico en el renderizado del catálogo que causaba pantallas en blanco debido a violaciones de hooks de React. Se extrajo la lógica de cada juego a un componente `GameCard` independiente para gestionar de forma limpia el estado de rotación (flip).
- **Correcciones en Panel de Admin**: Se solucionaron errores de importación de iconos (`Plus`) que impedían la carga del panel administrativo. Se robusteció la validación de roles en la barra de navegación para asegurar que los enlaces de "Admin" y "Reservas" aparezcan correctamente para usuarios autorizados (`ADMIN`, `SUPERADMIN`).
- **Mejora de Robustez en Navegación**: Se optimizó la transición entre la vista de reservas y el catálogo de juegos (modo selección), asegurando que el filtrado por stock funcione correctamente y que la navegación sea fluida mediante la persistencia de estados en `localStorage`.
