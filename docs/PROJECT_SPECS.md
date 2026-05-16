# CryptoWatch — Documento Funcional

**Proyecto:** Dashboard de seguimiento de criptomonedas en tiempo real
**Stack principal:** React + TypeScript + TanStack Query + Zustand
**Tipo:** Proyecto de portfolio / showcase técnico
**Alcance:** MVP enfocado (2–3 semanas de desarrollo)

---

## 1. Visión del producto

CryptoWatch es una aplicación web que permite a usuarios autenticados monitorear el mercado de criptomonedas en tiempo real, configurar una watchlist personal, ver gráficos técnicos avanzados y recibir alertas cuando un activo cruza un precio objetivo.

El objetivo del proyecto es doble: ofrecer una experiencia útil al usuario final y servir como demostración técnica de patrones avanzados de React (gestión de servidor vs estado cliente, datos en tiempo real, optimización de rendering con grandes volúmenes de datos).

### Público objetivo
- Usuarios interesados en seguir el mercado cripto sin operar (no es un exchange).
- Para portfolio: reclutadores técnicos y tech leads que evaluarán la calidad del código.

### Propuesta de valor
- Datos en vivo vía WebSockets, sin necesidad de refrescar.
- Watchlist persistida por usuario.
- Alertas configurables por precio.
- Gráficos de velas con indicadores técnicos básicos.

---

## 2. Stack técnico

### Core
| Categoría | Tecnología | Justificación |
|---|---|---|
| Framework | React 18+ con TypeScript | Estándar de la industria, tipado para mantenibilidad |
| Build | Vite | DX rápida, HMR instantáneo |
| Routing | TanStack Router | Type-safe, integración natural con TanStack Query |
| Server state | TanStack Query v5 | Caching, refetching, infinite queries, mutations |
| Client state | Zustand | Liviano, sin boilerplate, middleware potente |
| Estilos | Tailwind CSS + shadcn/ui | Productividad y consistencia visual |
| Forms | React Hook Form + Zod | Performance + validación tipada |
| Charts | Lightweight Charts (TradingView) | Velas profesionales, performance |
| Virtualización | TanStack Virtual | Listas largas sin pérdida de FPS |

### APIs externas
- **CoinGecko REST API** (gratuita, sin auth): catálogo de monedas, históricos, metadata.
- **Binance WebSocket API** (gratuita, sin auth): streams de precios en tiempo real.
- **Supabase** (auth + base de datos): autenticación de usuarios, watchlist y alertas persistidas.

### Tooling
- ESLint + Prettier
- Husky + lint-staged (pre-commit hooks)
- Vitest + React Testing Library (tests unitarios de hooks y stores)
- MSW (mocking de API en tests)

---

## 3. Features funcionales

### 3.1 Autenticación
- Registro y login exclusivamente vía OAuth (GitHub y Google) usando Supabase Auth.
- No se contempla flujo de email/contraseña: simplifica la UX y evita gestionar recuperación de contraseña, verificación de email, etc.
- Rutas protegidas: la watchlist y las alertas requieren sesión activa.
- Persistencia de sesión con refresh tokens.
- Logout con limpieza de cache de TanStack Query.

### 3.2 Mercado (página principal pública)
- Lista paginada/virtualizada de las top 250 criptomonedas.
- Columnas: rank, logo, nombre, precio, cambio 24h, market cap, volumen, sparkline 7 días.
- Búsqueda con debounce (300ms) sobre nombre y símbolo.
- Filtros: top 10/50/100/250, ordenamiento por columna.
- Tabs de categorías: All, DeFi, NFTs, Layer 1.
- Refresh automático cada 60s (configurable).
- Prefetch del detalle al hacer hover sobre una fila.

### 3.3 Detalle de moneda
- Información general: precio actual, cambio 24h, ATH, ATL, supply, market cap.
- Gráfico de velas con timeframes: 1H, 4H, 1D, 1W.
- Indicadores técnicos togglables: SMA(20), EMA(50), volumen.
- Precio actualizado en tiempo real vía WebSocket de Binance.
- Botón "Agregar a watchlist" (requiere login).
- Botón "Crear alerta" (requiere login).
- Descripción de la moneda, enlaces oficiales.

### 3.4 Watchlist (requiere auth)
- Vista personalizada con solo las monedas marcadas por el usuario.
- Suscripción simultánea a múltiples streams de WebSocket.
- Reordenamiento drag & drop.
- Quick actions: ver detalle, crear alerta, quitar de watchlist.
- Sincronización con backend (Supabase) + optimistic updates.

### 3.5 Alertas (requiere auth)
- Crear alerta: moneda + condición (precio > X o precio < X) + valor objetivo.
- Listado de alertas activas y disparadas.
- Notificación visual (toast) cuando una alerta se dispara mientras el usuario está en la app.
- Notificación del navegador (Web Notifications API) si el permiso está concedido.
- Las alertas se evalúan client-side mientras la app está abierta. (En una v2 se podría mover a un cron server-side.)

### 3.6 Configuración de usuario
- Tema claro / oscuro / sistema.
- Moneda de visualización: USD / EUR / ARS.
- Intervalo de auto-refresh.

---

## 4. Arquitectura de carpetas

```
src/
├── app/                      # Setup raíz: providers, router, query client
│   ├── providers.tsx
│   ├── router.tsx
│   └── query-client.ts
├── features/                 # Features auto-contenidas (vertical slicing)
│   ├── auth/
│   │   ├── api/              # hooks de TanStack Query
│   │   ├── components/
│   │   ├── stores/           # zustand store (sesión)
│   │   └── types/
│   ├── market/
│   │   ├── api/              # useCoins, useCoinDetail, useCoinHistory
│   │   ├── components/       # CoinTable, CoinRow, SearchBar, Filters
│   │   ├── hooks/            # useCoinSubscription (WS)
│   │   └── types/
│   ├── watchlist/
│   │   ├── api/
│   │   ├── components/
│   │   ├── stores/
│   │   └── types/
│   └── alerts/
│       ├── api/
│       ├── components/
│       ├── stores/
│       └── types/
├── shared/                   # Reutilizable transversal
│   ├── components/ui/        # Botones, inputs, modal, toast
│   ├── components/layout/    # Header, Sidebar, Footer
│   ├── hooks/                # useDebounce, useMediaQuery
│   ├── lib/                  # supabase client, axios instance, ws manager
│   └── utils/                # formatters (currency, percentage, dates)
├── pages/                    # Componentes página, ensamblan features
└── styles/
```

**Principio rector:** las features son autocontenidas. Una feature puede importar de `shared/`, pero no de otra feature directamente. Si dos features necesitan compartir algo, sube a `shared/`.

---

## 5. Patrones técnicos clave (lo que se va a demostrar)

### 5.1 División clara entre estado servidor y estado cliente
- **TanStack Query** maneja todo lo que viene de una API: monedas, detalles, históricos, watchlist persistida, alertas.
- **Zustand** maneja únicamente estado puramente cliente: tema, filtros activos en la UI, modal abierto, datos de WebSocket que llegan en streaming, sesión actual.
- Regla de oro: si el dato puede quedar desactualizado respecto a un servidor, va en TanStack Query.

### 5.2 Estrategia de cache con TanStack Query
| Query | staleTime | gcTime | Refetch |
|---|---|---|---|
| Lista de monedas | 60s | 5min | onWindowFocus |
| Detalle de moneda | 30s | 5min | onWindowFocus |
| Histórico (velas) | 5min | 10min | manual |
| Watchlist | 0 (siempre fresco al volver) | 10min | onMount |
| Alertas | 30s | 5min | onMount |

- **Query keys jerárquicas:** `['coins', 'list', { page, filters }]`, `['coins', 'detail', id]`, `['coins', 'history', id, timeframe]`.
- **Prefetch on hover** en filas de la tabla para sensación de instantaneidad.
- **Optimistic updates** en agregar/quitar de watchlist y crear/eliminar alertas.

### 5.3 WebSockets + TanStack Query
- Un único `WebSocketManager` singleton maneja la conexión a Binance.
- Las suscripciones se agregan/quitan dinámicamente según las monedas visibles.
- Cuando llega un tick, se hace `queryClient.setQueryData(['coins', 'detail', id], updater)` para inyectar el precio en la cache. Los componentes que consumen ese query re-renderizan automáticamente.
- Esto evita acoplar componentes al WebSocket: ellos solo leen vía `useQuery`.

### 5.4 Zustand con slices
- Store dividido por dominio: `authSlice`, `uiSlice`, `realtimePricesSlice`.
- Middleware: `persist` (tema, preferencias), `devtools` (debugging), `immer` (mutaciones simples).
- Selectores granulares para evitar re-renders innecesarios:
  ```ts
  const theme = useStore(state => state.ui.theme); // ✓ re-render solo si cambia theme
  ```

### 5.5 Performance
- **Virtualización** de la lista de mercado con TanStack Virtual: renderiza solo las filas visibles.
- **Memoización** de filas (`React.memo`) con comparador custom para evitar re-renders al actualizar precio de otra moneda.
- **Code splitting** por ruta con `React.lazy` + Suspense.
- **Lazy loading** de la librería de charts (~150KB) solo cuando se abre el detalle.
- **Debounce** en búsqueda y throttle en updates de WebSocket si la frecuencia es muy alta.

### 5.6 Manejo de errores
- `ErrorBoundary` global + por ruta.
- Toasts informativos para errores de mutación.
- Retry exponencial automático en queries (configurado en el QueryClient).
- Estados explícitos: loading skeleton, empty state, error state.

### 5.7 Type safety end-to-end
- Tipos generados desde el schema de Supabase.
- Schemas de Zod para validar respuestas de CoinGecko (la API puede cambiar).
- TanStack Router con rutas tipadas: nada de strings sueltos.

---

## 6. Modelo de datos

### Tablas en Supabase

**users** (gestionada por Supabase Auth)
- id (uuid, PK)
- email
- created_at

**watchlist_items**
- id (uuid, PK)
- user_id (FK → users.id)
- coin_id (string, ej: "bitcoin")
- position (int, para drag & drop)
- added_at (timestamptz)

**alerts**
- id (uuid, PK)
- user_id (FK → users.id)
- coin_id (string)
- condition (enum: 'above' | 'below')
- target_price (numeric)
- status (enum: 'active' | 'triggered' | 'dismissed')
- created_at (timestamptz)
- triggered_at (timestamptz, nullable)

Row Level Security activado en ambas tablas: cada usuario solo ve y modifica sus propias filas.

---

## 7. Roadmap de implementación (3 semanas)

### Semana 1 — Fundaciones
- [ ] Setup del proyecto: Vite + React + TS + Tailwind + ESLint/Prettier.
- [ ] Setup de TanStack Router con rutas vacías.
- [ ] Setup de TanStack Query (QueryClient, devtools).
- [ ] Setup de Supabase (proyecto, tablas, RLS).
- [ ] Feature auth: login con GitHub/Google (OAuth), logout, rutas protegidas.
- [ ] Layout base: Header, Sidebar, ThemeProvider.
- [ ] Página de mercado con lista paginada (sin virtualización todavía).

### Semana 2 — Core de datos y tiempo real
- [ ] Integración con CoinGecko, hooks `useCoins`, `useCoinDetail`, `useCoinHistory`.
- [ ] Virtualización de la lista de mercado con TanStack Virtual.
- [ ] Página de detalle con gráfico de velas (Lightweight Charts).
- [ ] WebSocketManager + integración con TanStack Query cache.
- [ ] Feature watchlist: CRUD + optimistic updates + drag & drop.

### Semana 3 — Alertas, pulido y demo
- [ ] Feature alertas: crear, listar, evaluar client-side, notificaciones.
- [ ] Estados de loading/error/empty en todas las vistas.
- [ ] Tests unitarios de stores y hooks críticos.
- [ ] Lighthouse: optimizar a 90+ en Performance.
- [ ] Deploy en Vercel.
- [ ] README destacando decisiones técnicas y diagramas.
- [ ] Grabación de demo (Loom o video corto) para mostrar en portfolio.

---

## 8. Criterios de "terminado" (definition of done)

Un usuario no autenticado puede:
- Ver el mercado completo con datos en vivo.
- Buscar, filtrar y ordenar monedas.
- Ver el detalle de cualquier moneda con su gráfico y precio en tiempo real.

Un usuario autenticado puede además:
- Agregar y quitar monedas de su watchlist con respuesta instantánea (optimistic).
- Reordenar su watchlist con drag & drop persistido.
- Crear, listar y eliminar alertas de precio.
- Recibir un toast cuando una alerta se dispara estando en la app.

A nivel técnico:
- 0 errores de TypeScript en build.
- 0 warnings de ESLint.
- Lighthouse Performance ≥ 90.
- Sin re-renders innecesarios en la tabla de mercado al recibir un tick (verificable con React DevTools Profiler).
- Deploy productivo accesible vía URL pública.

---

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Rate limits de CoinGecko (free tier: 10–30 req/min) | Cache agresivo en TanStack Query, polling cada 60s, no por moneda |
| Demasiados streams WebSocket simultáneos | Limitar a las monedas visibles + watchlist; usar streams combinados de Binance (`!ticker@arr`) |
| Alertas no se evalúan si la app está cerrada | Documentar como limitación conocida; v2 podría usar Edge Function de Supabase con cron |
| Performance al actualizar 250 filas con WebSocket | Memoización por fila + actualización selectiva del cache |

---

## 10. Lo que NO entra en el MVP

Para mantener el alcance acotado a 3 semanas, quedan fuera:
- Portfolio simulado (compra/venta ficticia).
- Internacionalización (i18n).
- Mobile app o PWA.
- Notificaciones push server-side.
- Comparación entre múltiples monedas en un mismo gráfico.
- Histórico de evolución de la watchlist.
- Modo trading paper.

Estos quedan documentados como "futuro" en el README para mostrar visión de producto.