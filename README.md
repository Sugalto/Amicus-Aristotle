# Amicus Aristotle AI

A React/Vite interface for an Aristotle-inspired AI tutor. This repository contains the presentation layer, chat experience, language support, admin views, transcript tools, and a small provider-neutral HTTP adapter. It does not include a hosted AI, authentication, persistence, or deployment service.

## Architecture

The frontend calls two replaceable HTTP surfaces:

| Surface | Default route | Purpose |
| --- | --- | --- |
| Function adapter | `POST /api/functions/:name` | Chat, persistence, service status, and admin operations. |
| Authentication adapter | `GET /api/auth/me`, `POST /api/auth/logout` | Optional session lookup and logout. |

`src/api/apiClient.js` is the only integration boundary. Replace its `request` implementation or expose equivalent routes from any backend, serverless provider, or local service. Each function response is wrapped as `{ data }` to keep existing UI components independent of the transport.

## Required backend contracts

The current UI expects these function names: `aristotleChat`, `saveConversation`, `listConversations`, `getServiceStatus`, and `setServiceStatus`. Payloads are visible at their call sites in `src/pages/Chat.jsx`, `src/pages/Admin.jsx`, and `src/components/admin/ServiceStatusControls.jsx`. A backend may implement these as REST handlers, RPC methods, GraphQL resolvers, or direct SDK calls.

Authentication is optional for the public chat flow. Implement `/api/auth/me` if the admin route should use signed-in users; otherwise return a `401` response and provide your own admin policy in the function handlers.

## Local development

Copy `.env.example` to `.env`, install dependencies, and start the Vite server:

```bash
cp .env.example .env
npm install
npm run dev
```

The frontend alone is intentionally usable as a UI shell, but chat and persistence require a compatible backend.

## Build and validation

```bash
npm run lint
npm run typecheck
npm run build
```

## Customization

The local SVG assets in `public/assets/` are intentionally editable placeholders. Replace them with your own licensed artwork. API credentials must stay on the server; do not place provider secrets in `VITE_*` variables.
