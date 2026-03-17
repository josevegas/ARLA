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
- **Game (Ludoteca)**: Catálogo de juegos con categoría, dificultad, duración, stock y rango de jugadores.
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
- Añadido archivo `AGENTS.md` para gestión de agentes personalizados.
