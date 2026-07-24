# Explorador de perfiles de GitHub — NestJS + NextJS

**🌐 Demo en vivo:** https://explorador-perfiles-github.netlify.app/

**⚙️ API desplegada:** https://explorador-perfiles-github.onrender.com/ (ejemplo: [/user/rronrri](https://explorador-perfiles-github.onrender.com/user/rronrri))

Aplicación que muestra la información de un perfil de GitHub. El backend (NestJS) expone un endpoint que consulta la API pública de GitHub, y el frontend (NextJS) consume **ese endpoint** para renderizar los datos.

## Estructura

```
├── backend/    # NestJS — API en http://localhost:3001
└── frontend/   # NextJS + Tailwind — UI en http://localhost:3000
```

## Requisitos

- Node.js 18+ (se usa `fetch` nativo)
- npm

## Cómo correr

### 1. Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

Queda disponible en `http://localhost:3001`.

### 2. Frontend (NextJS)

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:3000`. Al cargar, muestra automáticamente el perfil de `rronrri` y permite buscar cualquier otro username.

## API

### `GET /user/:username`

Consulta `https://api.github.com/users/:username` y devuelve un DTO limpio:

```json
{
  "login": "rronrri",
  "name": null,
  "bio": null,
  "avatarUrl": "https://avatars.githubusercontent.com/u/133185867?v=4",
  "publicRepos": 4,
  "publicGists": 0,
  "followers": 0,
  "following": 0,
  "location": null,
  "company": null,
  "blog": null,
  "twitterUsername": null,
  "htmlUrl": "https://github.com/rronrri",
  "createdAt": "2023-05-11T03:22:45Z"
}
```

### `GET /user/:username/repos`

Devuelve los repositorios públicos del usuario (hasta 100, ordenados por última actualización):

```json
[
  {
    "name": "mi-repo",
    "description": "…",
    "language": "TypeScript",
    "stars": 3,
    "forks": 0,
    "isFork": false,
    "htmlUrl": "https://github.com/rronrri/mi-repo",
    "updatedAt": "2026-07-01T12:00:00Z"
  }
]
```

Errores (ambos endpoints):

- `400` — username inválido (no cumple las reglas de GitHub)
- `404` — el usuario no existe en GitHub
- `429` — rate limit de esta API superado (15 peticiones/minuto por IP)
- `502` — otro error al consultar GitHub
- `503` — rate limit de la API de GitHub alcanzado
- `504` — GitHub no respondió a tiempo (timeout 8 s)

## Seguridad

- **Helmet** (`main.ts`) — headers de seguridad HTTP: CSP, X-Frame-Options, nosniff, HSTS, etc.
- **Rate limiting** (`app.module.ts`, `@nestjs/throttler`) — 15 peticiones por minuto por IP en todas las rutas; excedido → `429`.
- **Validación de entrada** — el username se valida con regex (reglas de GitHub) antes de consultar la API externa.
- **Timeout** — el fetch a GitHub aborta a los 8 s para no acumular conexiones colgadas.
- **CORS** restringido al origen del frontend.

## Configuración

- `frontend/.env.local` → `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`)
- CORS del backend permite `http://localhost:3000`

Variables de entorno del backend (opcionales en local, usadas en producción):

| Variable | Función |
|---|---|
| `PORT` | Puerto del servidor (default `3001`) |
| `FRONTEND_ORIGIN` | Origen permitido por CORS (default `http://localhost:3000`) |
| `GITHUB_TOKEN` | Token personal de GitHub; sube la cuota de la API de 60 a 5000 req/hora |

## Despliegue

```
Usuario → Netlify (NextJS) → Render (NestJS) → api.github.com
              ▲
        UptimeRobot (ping cada 5 min al backend)
```

- **Frontend — Netlify** (https://explorador-perfiles-github.netlify.app/): build automático desde este repo con el runtime oficial de Next (`@netlify/plugin-nextjs`, configurado en `frontend/netlify.toml`). La URL del backend se inyecta en build con la variable `NEXT_PUBLIC_API_URL`.
- **Backend — Render** (https://explorador-perfiles-github.onrender.com/): Web Service de Node desde la carpeta `backend/`, build `npm install && npm run build`, arranque `npm run start:prod`. Configurado con `GITHUB_TOKEN` (cuota de 5000 req/hora, necesaria porque en la nube la IP de salida es compartida) y `FRONTEND_ORIGIN` apuntando a Netlify para el CORS. Se activó `trust proxy` para que el rate limit identifique la IP real de cada visitante detrás del proxy de Render.
- **UptimeRobot**: el plan gratuito de Render suspende el servicio tras 15 minutos sin tráfico, y despertarlo toma 30–50 s — mala primera impresión para quien visite la demo. Un monitor HTTP de UptimeRobot hace ping a `/user/rronrri` cada 5 minutos, manteniendo el backend despierto 24/7 y avisando por email si el servicio llega a caerse.
- **CI/CD implícito**: cada `git push` a `main` redespliega automáticamente frontend (Netlify) y backend (Render).
