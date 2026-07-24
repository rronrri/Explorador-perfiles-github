# Explorador de perfiles de GitHub — NestJS + NextJS

**🌐 Demo en vivo:** https://explorador-perfiles-github.netlify.app

**API desplegada:** https://explorador-perfiles-github.onrender.com/user/rronrri

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
