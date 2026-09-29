# Gadbad Grub — Backend API & Race Simulator 🏎️🍔

> **Tagline:** “Every Order Is a Race. Every Bite Is a Victory!”

This directory contains the complete backend service for **Gadbad Grub**, a gamified food delivery speed racing platform.

---

## 1. Architecture Overview

Built using **Node.js** and **Express.js**, following a clean, layered architecture:

```text
API Route (routes/*.routes.js)
   ↓
Controller (controllers/*.controller.js)
   ↓
Service (services/*.service.js)
   ↓
Model & Resilient Storage (models/*.model.js & config/database.js)
```

- **Resilient Storage Layer**: Out-of-the-box in-memory fast document store with automatic MongoDB support if `MONGODB_URI` is provided. Zero setup needed to run tests or local demo!
- **Strict Price Integrity**: Frontend prices are never trusted. All calculations strictly derive from verified database menu prices (`menuItem.price × quantity`).
- **Deterministic Race Simulator**: Generates real-time virtual delivery races with checkpoints, traffic bottlenecks, and speed boosts without pretending to be real GPS data.
- **Server-Sent Events (SSE)**: Native, high-performance real-time updates streamed directly to clients at `GET /api/races/:raceId/stream`.
- **Explainable Prediction Engine**: Deterministic ETA-based winner predictions (`Lowest valid ETA = Predicted Winner`). No fake ML confidence claims.
- **Idempotent Rewards**: Unique `sourceEventId` keys protect against duplicate points, XP, and badge awards.

---

## 2. Directory Structure

```text
server/
├── .env.example
├── package.json
├── README.md
└── src/
    ├── app.js
    ├── server.js
    │
    ├── config/
    │   ├── env.js
    │   └── database.js
    │
    ├── routes/
    │   ├── restaurant.routes.js
    │   ├── order.routes.js
    │   ├── race.routes.js
    │   ├── prediction.routes.js
    │   ├── leaderboard.routes.js
    │   ├── reward.routes.js
    │   └── commentary.routes.js
    │
    ├── controllers/
    │   ├── restaurant.controller.js
    │   ├── order.controller.js
    │   ├── race.controller.js
    │   ├── prediction.controller.js
    │   ├── leaderboard.controller.js
    │   ├── reward.controller.js
    │   └── commentary.controller.js
    │
    ├── services/
    │   ├── order.service.js
    │   ├── race.service.js
    │   ├── raceSimulator.service.js
    │   ├── prediction.service.js
    │   ├── leaderboard.service.js
    │   ├── reward.service.js
    │   └── commentary.service.js
    │
    ├── models/
    │   ├── user.model.js
    │   ├── restaurant.model.js
    │   ├── menuItem.model.js
    │   ├── order.model.js
    │   ├── race.model.js
    │   ├── raceEvent.model.js
    │   ├── prediction.model.js
    │   ├── reward.model.js
    │   └── userReward.model.js
    │
    ├── middleware/
    │   ├── error.middleware.js
    │   ├── validation.middleware.js
    │   └── notFound.middleware.js
    │
    ├── utils/
    │   ├── ApiError.js
    │   ├── asyncHandler.js
    │   ├── generateId.js
    │   └── ranking.js
    │
    ├── adapters/
    │   └── llm.adapter.js
    │
    ├── seed/
    │   ├── seed.js
    │   ├── restaurants.seed.js
    │   └── users.seed.js
    │
    └── tests/
        ├── order.test.js
        ├── race.test.js
        ├── prediction.test.js
        └── leaderboard.test.js
```

---

## 3. Getting Started

### Prerequisites
- Node.js (v18+ or LTS)
- npm (v9+)

### Installation
```bash
cd server
npm install
```

### Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port for the HTTP server |
| `NODE_ENV` | `development` | App environment |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS allowed origin |
| `MONGODB_URI` | `""` | Optional MongoDB connection string |
| `USE_IN_MEMORY_DB` | `true` | When true, uses embedded memory store |
| `RACE_TICK_INTERVAL_MS` | `1500` | Milliseconds per simulation tick |

### Run Database Seed
Populates mock restaurants, menu items, demo users, and badges:
```bash
npm run seed
```

### Start Development Server
```bash
npm run dev
# or
npm start
```

### Run Tests
```bash
npm test
```

---

## 4. API Reference

### Health Check
- `GET /api/health`
  - Returns service status, timestamp, and tracking source (`SIMULATOR`).

### Restaurants & Menus
- `GET /api/restaurants`
  - Returns all active restaurants.
- `GET /api/restaurants/:restaurantId`
  - Returns restaurant details.
- `GET /api/restaurants/:restaurantId/menu`
  - Returns menu items for the restaurant.

### Orders
- `POST /api/orders`
  - Request body:
    ```json
    {
      "userId": "user_demo_1",
      "restaurantId": "rest_pizza_01",
      "items": [
        { "menuItemId": "item_pizza_01", "quantity": 2 }
      ],
      "autoStartRace": true
    }
    ```
  - **Price Security**: Prices sent by client are ignored. Unit price is read from database and multiplied by quantity.
  - Automatically creates a linked virtual race with demo competitors.
  - Automatically awards `FIRST_ORDER` badge on user's first order.
- `GET /api/orders/:orderId`
- `GET /api/orders/user/:userId`
- `PATCH /api/orders/:orderId/status`
  - Valid transitions: `PLACED` → `ACCEPTED` → `PREPARING` → `READY` → `PICKED_UP` → `DELIVERED` (or `CANCELLED`).

### Races & Simulator
- `POST /api/races`
  - Create/register race for an order.
- `GET /api/races`
  - Get all races (optional query `?status=RUNNING`).
- `GET /api/races/:raceId`
  - Get race details and all racers.
- `GET /api/races/:raceId/events`
  - Get historical race events log.
- `POST /api/races/:raceId/start`
  - Manually start the race simulator.
- `GET /api/races/:raceId/stream`
  - **Server-Sent Events (SSE)** endpoint. Streams live race ticks and commentary events.
  - Example SSE payload:
    ```json
    {
      "type": "RACE_UPDATE",
      "raceId": "race_123",
      "racer": {
        "id": "racer_1",
        "name": "Thunder Tandoor",
        "progress": 72,
        "etaSeconds": 180,
        "rank": 1
      },
      "event": {
        "type": "BOOST_ACTIVATED",
        "message": "⚡ TURBO BOOST ACTIVATED!"
      },
      "timestamp": "2026-09-28T16:15:00.000Z"
    }
    ```

### Winner Predictions
- `GET /api/races/:raceId/ai-prediction`
  - Explainable ETA-based winner prediction:
    ```json
    {
      "predictedWinner": {
        "racerId": "racer_lead_01",
        "name": "Thunder Tandoor",
        "etaSeconds": 140
      },
      "method": "ETA_BASED_RANKING",
      "explanation": "Thunder Tandoor currently has the lowest valid ETA (140s)."
    }
    ```
- `POST /api/races/:raceId/predictions`
  - Submit user prediction before race finish deadline:
    ```json
    {
      "userId": "user_demo_1",
      "predictedRacerId": "racer_lead_01"
    }
    ```
  - Enforces one prediction per user per race.
  - Rejects submissions once race is `FINISHED` or `CANCELLED`.
- `GET /api/races/:raceId/predictions`
- `GET /api/predictions/user/:userId`

### Leaderboard
- `GET /api/leaderboard`
  - Returns racers sorted by ascending ETA, tie-breaker descending progress, then racer ID.
- `GET /api/leaderboard/users`
  - Top users ranked by points and XP.

### Rewards & Profile
- `GET /api/rewards/badges`
  - Available badges (`FIRST_ORDER`, `SPEED_PREDICTOR`, `HAT_TRICK`, `RACER_SUPPORTER`).
- `GET /api/rewards/user/:userId`
  - Reward transaction log.
- `GET /api/rewards/user/:userId/profile`
  - User level, XP progress to next level, current points, earned badges, and history.

### Commentary
- `GET /api/commentary/:raceId`
- `POST /api/commentary/generate`
