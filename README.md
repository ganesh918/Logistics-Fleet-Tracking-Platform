# FleetFlow — Logistics & Fleet Tracking Platform

Production-style React frontend for fleet operations: dashboard analytics, vehicle & driver management, shipments, live map tracking, advanced filters, notifications, and authentication.

## Stack

- **React.js** (JavaScript + JSX) + **Vite**
- **Tailwind CSS v4**
- **React Router v7**
- **Recharts** (analytics)
- **React Leaflet** + OpenStreetMap (tracking)
- **React Hook Form** + **Zod** (forms & validation)
- **Vitest** + **Testing Library** (unit tests)

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://127.0.0.1:5173`).

### Authentication

- **`/login`** — Sign in (local mock auth; users stored in `localStorage`)
- **`/signup`** — Create an account
- All fleet routes require a session; use **Log out** at the bottom of the sidebar (confirmation + toast)

## Mock vs live API

By default the app uses an in-memory **mock API** (`src/api/mock/`).

To connect a real backend, set:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

Implement endpoints matching `src/api/fleetApi.js` (`/dashboard`, `/vehicles`, `/drivers`, `/shipments`, `/notifications`).

## Features

| Area | Highlights |
|------|------------|
| Dashboard | KPI cards, shipment pipeline, performance charts, map snapshot, alerts, activity feed |
| Vehicles | CRUD (mock), fuel/maintenance, driver assignment, detail + **activity log** |
| Drivers | **Full CRUD**, profiles, status, metrics, delivery history |
| Shipments | **Create & edit**, timeline, status tracking, map routes |
| Tracking | Interactive map, route polyline, pickup/delivery markers, ETA panel |
| Search | **Global search** with grouped results; page-level filters |
| Notifications | Delay/maintenance/delivery/driver alerts with read state |
| Auth | Themed login/signup, password visibility toggle, toasts |

## Project structure

```
src/
  api/           # HTTP client + mock store + fleetApi facade
  components/    # UI, layout, auth, feature widgets
  context/       # Auth, Fleet, Theme, Toast providers
  hooks/
  pages/
  test/          # Vitest setup
  utils/
```

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run test` — run unit tests
- `npm run preview` — preview production build
