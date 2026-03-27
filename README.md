React Movie Browser

A modern single-page app for discovering films. Browse popular titles from [The Movie Database (TMDB)](https://www.themoviedb.org/), search with debounced queries, filter by genre and minimum rating, sort by popularity, rating, or release date, and open any title for a full detail view with cast-adjacent metadata from the API.

This project is a learning-friendly React front end: TypeScript for safety, Vite for fast dev and builds, and a small set of pages and components wired with React Router.

Features

- Home — Popular movies loaded from TMDB, with optional search replacing the list when you type.
- Filters — Genre dropdown, minimum rating, and client-side sorting.
- Detail page — Rich movie information at /movie/:movieId (posters, overview, runtime, genres, and more).
- Component docs — [Storybook](https://storybook.js.org/) stories for key UI (e.g. MovieCard, browse and detail flows).
- Quality tooling — ESLint, Prettier, Vitest, and Husky with lint-staged for consistent code on commit.

Tech stack

| Area        | Choice                  |
| ----------- | ----------------------- |
| UI          | React 19                |
| Language    | TypeScript              |
| Build / dev | Vite 8                  |
| Routing     | React Router 7          |
| Data        | TMDB REST API (`fetch`) |
| Tests       | Vitest, Testing Library |
| Docs        | Storybook 10            |

Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

Getting started

1. Install dependencies\*\*

   npm install

2. Configure the API key in the .env

   VITE_TMDB_API_KEY=your_actual_key

3.Run the dev server

npm run dev

Open the URL Vite prints (usually http://localhost:5173).

Scripts

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| npm run dev             | Start Vite in development mode     |
| npm run build           | Typecheck and production build     |
| npm run preview         | Serve the production build locally |
| npm test                | Run Vitest in watch mode           |
| npm run test:run        | Run Vitest once (CI-friendly)      |
| npm run lint            | ESLint across the project          |
| npm run format:check    | Check formatting with Prettier     |
| npm run storybook       | Storybook UI on port 6006          |
| npm run build-storybook | Static Storybook build             |

Project layout

- [src/App.tsx](src/App.tsx) — Route definitions (/ and /movie/:movieId).
- [src/pages/](src/pages/) — Browse and detail screens.
- [src/components/](src/components/) — Reusable UI (e.g. movie cards).
- [src/lib/api_client.ts](src/lib/api_client.ts) — TMDB types and fetch helpers.

---

Data and images are provided by TMDB; this app is not endorsed or certified by TMDB.
