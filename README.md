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
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── TEST/
├── docker-compose.yml
└── README.md
```

## Modelos de Datos

- **User**: Roles (Admin, Staff, Cliente), credenciales, historial de visitas.
- **Table**: Capacidad, ubicación, estado.
- **Game**: Catálogo de juegos con dificultad, duración y stock.
- **Sale**: Registro de ventas vinculadas a mesas.
- **Reservation**: Reservas con fecha, hora, número de personas y prepago opcional.

## API Endpoints

- `POST /api/reservations` - Crear reserva
- `GET /api/reservations` - Obtener todas las reservas
- `GET /api/reservations/:id` - Obtener reserva por ID
- `PUT /api/reservations/:id` - Actualizar reserva
- `DELETE /api/reservations/:id` - Eliminar reserva

## Tests

Ejecuta los tests en la carpeta `TEST/` con Jest.

## Agentes Personalizados
Consulta `AGENTS.md` para definiciones de agentes especializados en diferentes aspectos del proyecto.

## Correcciones Recientes
- Corregidos errores de importación en `frontend/src/App.tsx` (logos no definidos).
- Actualizado script de build en `backend/package.json` para usar `npx tsc`.
- Añadido archivo `AGENTS.md` para gestión de agentes personalizados.
