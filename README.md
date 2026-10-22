# Chromis POS Backend Sales

API REST de solo lectura con Node.js, Express, TypeScript y mysql2.

## Inicio
```bash
npm install
cp .env.example .env
npm run dev
```
Configura .env con credenciales de una cuenta SQL de solo lectura. CORS_ORIGINS admite orígenes separados por coma.

## Endpoints
- GET /api/health — salud del servidor
- GET /api/chromis/connection — prueba SELECT 1
- GET /api/chromis/schema — tablas Chromis conocidas detectadas
- GET /api/products?page=1&limit=20&search=&category= — productos paginados
- GET /api/products/:id — producto individual
- GET /api/products/list — alias compatible
- GET /api/categories — categorías y cantidad de productos
- GET /api/sales?page=1&limit=20&from=2026-01-01&to=2026-12-31 — tickets paginados
- GET /api/sales/summary?from=&to= — cantidad de tickets y total de pagos
- GET /api/sales/:id — detalle del ticket con líneas y pagos

Verificar esquema y convenciones tributarias con la instalación real de Chromis antes de usar los reportes en producción. Los pagos pueden ser negativos por devoluciones. Para despliegues públicos, configurar autenticación y autorización; los endpoints de diagnóstico son solo para redes confiables.
