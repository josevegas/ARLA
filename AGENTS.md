# Agentes Personalizados para ARLA

Este archivo define agentes especializados para el desarrollo y mantenimiento de ARLA.

## Agente Senior Fullstack (Líder)
- **Propósito**: Coordinar la arquitectura general, asegurar la cohesión entre el backend y frontend, y aplicar patrones de diseño PERN.
- **Habilidades**: Arquitectura Limpia, Integración de Sistemas, Code Review.
- **Activación**: Consultas de arquitectura global o diseño de sistemas.

## Agente Backend Developer
- **Propósito**: Manejar el servidor, base de datos y lógica de negocio.
- **Habilidades**: Node.js, Express, TypeScript, Prisma, PostgreSQL, **Seguridad JWT**, **Validación con Zod**, **Nodemailer/SMTP**, Morgan/Winston logging.
- **Activación**: Archivos en `/backend/`.

## Agente Frontend Developer
- **Propósito**: Gestionar la UI/UX y la interactividad del cliente.
- **Habilidades**: React 19, Vite, TypeScript, Tailwind CSS, **Neumorfismo Avanzado**, **Diseño Estético (Coloretto)**, **Context API**, **Protected Routes**.
- **Activación**: Archivos en `/frontend/`.

## Agente Tester
- **Propósito**: Asegurar la calidad mediante pruebas unitarias e integración.
- **Habilidades**: Jest, Supertest, Mocking.
- **Activación**: Archivos en `/TEST/` o comandos `npm test`.

## Agente DevOps
- **Propósito**: Despliegue, contenedores y CI/CD.
- **Habilidades**: Docker, Docker Compose, Fly.io/Vercel config.
- **Activación**: Archivos de configuración de infraestructura.