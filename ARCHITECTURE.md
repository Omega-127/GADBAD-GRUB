# Gadbad Grub --- System Architecture

### Food Delivery Speed Racing

This document describes the proposed architecture for Gadbad Grub, based
on the team's dashboard and mobile workflow reference images, project
requirements, and hackathon MVP scope.

> **Implementation rule:** Inspect the existing repository before
> choosing frameworks, adding dependencies, or changing the stack. The
> architecture below is technology-agnostic and should be mapped onto
> the project's actual structure.

------------------------------------------------------------------------

## 1. Architecture Goals

-   Deliver a polished and responsive food-delivery racing experience.
-   Support the complete flow: Place Order → Start Race → Watch Live
    Race → Predict Winner → Win Rewards.
-   Separate UI, order management, race simulation/tracking, prediction,
    and rewards logic.
-   Support simulated demo data first, with clear seams for real APIs
    later.
-   Avoid representing simulated rider positions as actual GPS data.
-   Keep prediction logic explainable and avoid claiming an ML model
    where none exists.

## 2. High-Level Architecture

``` mermaid
flowchart TD
    U[Customer / Demo User] --> UI[Responsive Web UI]

    UI --> NAV[Navigation and Page Components]
    UI --> STATE[Client State and Data Layer]

    STATE --> API[Backend API / Demo Service Layer]

    API --> ORDERS[Order Service]
    API --> RACE[Race and Tracking Service]
    API --> PRED[ETA and Winner Prediction]
    API --> REWARD[Rewards and Leaderboard Service]
    API --> COMMENT[Race Commentary Service]

    ORDERS --> DB[(Database or Demo Persistence)]
    RACE --> DB
    PRED --> DB
    REWARD --> DB

    SIM[Demo Race Simulator] --> RACE
    EXT[Optional External APIs: Restaurant / Maps / Delivery] --> ADAPTER[Provider Adapters]
    ADAPTER --> ORDERS
    ADAPTER --> RACE

    RACE --> EVENTS[Race Event Stream / Polling]
    EVENTS --> STATE
    STATE --> UI
```

### Architecture Explanation

1.  The customer interacts with the responsive web UI.
2.  Page components use the project's existing client state and
    data-fetching approach.
3.  Requests go through the existing backend/API layer or a clearly
    separated demo service layer.
4.  Order, race, prediction, and reward modules handle their own
    responsibilities.
5.  A race simulator generates demo progress and events when real
    tracking is unavailable.
6.  The UI receives refreshed state through the available real-time
    mechanism or polling.
7.  Optional external providers are isolated behind adapters so the rest
    of the app does not depend directly on a specific provider.

## 3. Frontend Architecture

The frontend should use reusable components and shared data models.
Names below are suggested logical modules; adapt them to the
repository's actual conventions.

``` text
src/
├── app/ or pages/
│   ├── Home
│   ├── Order
│   ├── RaceWatch
│   ├── Leaderboard
│   ├── Rewards
│   └── Profile
│
├── components/
│   ├── layout/
│   │   ├── Header
│   │   ├── Sidebar
│   │   ├── BottomNavigation
│   │   └── Footer
│   ├── race/
│   │   ├── RaceMap
│   │   ├── RiderMarker
│   │   ├── RaceTrack
│   │   ├── RaceStatus
│   │   ├── ETAWidget
│   │   └── RaceEventFeed
│   ├── orders/
│   │   ├── RestaurantCard
│   │   ├── FoodItemCard
│   │   ├── Cart
│   │   └── OrderStatus
│   ├── competition/
│   │   ├── Leaderboard
│   │   ├── PredictionCard
│   │   └── RaceCommentary
│   └── rewards/
│       ├── RewardSummary
│       ├── BadgeCard
│       └── AchievementPanel
│
├── services/
│   ├── orderService
│   ├── raceService
│   ├── predictionService
│   └── rewardService
│
├── state/ or store/
├── types/ or models/
├── utils/
└── assets/
    ├── logo
    ├── rider illustrations
    ├── food icons
    └── sound and animation assets
```

This is a conceptual layout, not a requirement to create duplicate
folders if equivalent modules already exist.

### Main UI Responsibilities

  -----------------------------------------------------------------------
  Component                           Responsibility
  ----------------------------------- -----------------------------------
  Home Dashboard                      Compose Race Watch Hub, live
                                      updates, order predictions,
                                      competition, profile, and rewards
                                      panels.

  Order Page                          Browse menu items, manage cart, and
                                      submit an order.

  Race Watch Hub                      Render track, rider markers, finish
                                      line, progress, ETA, and event
                                      feed.

  Leaderboard                         Display race rankings using a
                                      consistent ETA/progress rule.

  Rewards                             Display points, badges,
                                      achievements, and eligible claims.

  Profile                             Display user details, race history,
                                      and achievements.
  -----------------------------------------------------------------------

## 4. Backend / Service Architecture

Use the project's current backend if present. The following modules
define responsibilities and can be implemented as separate services,
modules, or functions within a single backend for the MVP.

### Order Service

Responsibilities: - Retrieve available demo restaurants and menu
items. - Validate cart items and calculate order totals. - Create an
order with a unique ID. - Maintain order status and timestamps. -
Provide order details to the race module.

### Race and Tracking Service

Responsibilities: - Create a race associated with an order. - Maintain
rider/racer identity, route progress, status, and ETA. - Update race
progress from an external tracking provider or demo simulator. - Publish
or expose race events to the frontend. - Identify demo/simulated
tracking data clearly.

### Demo Race Simulator

Responsibilities: - Generate predictable, configurable virtual racer
movement. - Simulate checkpoints, preparation completion, pickup, ETA
changes, and finish events. - Update virtual progress without
controlling or encouraging real-world rider behavior. - Support
repeatable demo scenarios for judging.

The simulator should be isolated from production tracking so it can be
disabled when a real provider is configured.

### Prediction Service

Responsibilities: - Calculate ETA estimates from available progress and
timing data. - Rank racers using a documented ordering rule. - Return a
predicted winner and, only if calibrated, a confidence estimate. -
Provide a reason or explanation for a prediction. - Record the
prediction and the race state at the time it was made.

For the MVP, a deterministic, rule-based algorithm is sufficient. Do not
describe it as a trained AI/ML model unless training and model inference
are implemented.

### Rewards and Leaderboard Service

Responsibilities: - Accept eligible user predictions and validate that
they were submitted before race completion. - Calculate points for
correct predictions. - Track XP, badges, achievements, and race
history. - Prevent duplicate reward claims for the same event. - Return
leaderboard and profile summaries.

Reward validation should happen server-side when a backend is available.
For a frontend-only demo, clearly treat local rewards as prototype data
rather than secure production rewards.

### Race Commentary Service

Responsibilities: - Convert race events into short, playful
commentary. - Use an LLM provider through an adapter when configured. -
Provide deterministic fallback messages if the provider is
unavailable. - Avoid exposing API keys to the browser.

## 5. Core Data Model

The following are conceptual entities and suggested fields. Adapt names
and types to the actual database.

### User

  Field          Description
  -------------- ----------------------------
  user_id        Unique user identifier
  display_name   Name shown in the app
  avatar         Avatar or mascot selection
  points         Current virtual points
  xp             Experience points
  badges         Earned badge references

### Restaurant and MenuItem

  -----------------------------------------------------------------------
  Entity                              Suggested fields
  ----------------------------------- -----------------------------------
  Restaurant                          restaurant_id, name, description,
                                      rating, image, availability

  MenuItem                            item_id, restaurant_id, name,
                                      description, price, image,
                                      availability
  -----------------------------------------------------------------------

### Order

  -----------------------------------------------------------------------
  Field                               Description
  ----------------------------------- -----------------------------------
  order_id                            Unique order identifier

  user_id                             Customer who placed the order

  restaurant_id                       Selected restaurant

  items                               Ordered item IDs and quantities

  total                               Calculated order total

  status                              placed, preparing, picked_up,
                                      out_for_delivery, delivered,
                                      cancelled

  created_at                          Order creation time

  estimated_delivery_at               Current estimated arrival time
  -----------------------------------------------------------------------

### Race

  Field             Description
  ----------------- ------------------------------------------
  race_id           Unique race identifier
  order_id          Related order
  racer_id          Virtual racer or rider identifier
  progress          Normalized demo progress, such as 0--100
  eta_seconds       Current estimated time remaining
  status            waiting, racing, finished, cancelled
  tracking_source   simulated, provider, or manual/demo
  updated_at        Last update time

### RaceEvent

  -----------------------------------------------------------------------
  Field                               Description
  ----------------------------------- -----------------------------------
  event_id                            Unique event identifier

  race_id                             Related race

  event_type                          pickup, checkpoint, eta_changed,
                                      boost_visual, delivered, etc.

  message                             User-facing event description

  created_at                          Event time

  source                              simulator or configured provider
  -----------------------------------------------------------------------

### Prediction

  Field                Description
  -------------------- --------------------------------------
  prediction_id        Unique prediction identifier
  user_id              User who predicted
  race_id              Race being predicted
  predicted_racer_id   Selected winner
  submitted_at         Submission time
  result               pending, correct, incorrect, or void
  points_awarded       Points awarded after validation

### Reward / Badge

  Field             Description
  ----------------- ------------------------------------
  reward_id         Unique reward identifier
  user_id           Recipient
  reward_type       points, XP, badge, achievement
  source_event_id   Event or prediction that earned it
  created_at        Reward time

## 6. Core Data Flow

### A. Place an Order

``` mermaid
sequenceDiagram
    actor Customer
    participant UI as Order UI
    participant Order as Order Service
    participant Store as Persistence

    Customer->>UI: Select food and checkout
    UI->>Order: Submit cart
    Order->>Order: Validate items and total
    Order->>Store: Save order
    Store-->>Order: Order ID
    Order-->>UI: Order confirmation
    UI->>UI: Open order/race view
```

### B. Start and Update a Race

``` mermaid
sequenceDiagram
    participant Order as Order Service
    participant Race as Race Service
    participant Sim as Demo Simulator
    participant UI as Race Dashboard

    Order->>Race: Create race for order
    Race->>Sim: Start demo scenario
    Sim->>Race: Progress / checkpoint / ETA event
    Race->>Race: Update race state
    Race-->>UI: Updated state via polling or event stream
    UI->>UI: Animate rider and refresh ETA/feed
```

If a real tracking provider is configured, its adapter supplies tracking
updates instead of the demo simulator. The app must identify the source
of the data.

### C. Predict and Award Rewards

``` mermaid
sequenceDiagram
    actor Customer
    participant UI as Prediction UI
    participant Pred as Prediction Service
    participant Race as Race Service
    participant Reward as Reward Service
    participant Store as Persistence

    Customer->>UI: Select predicted winner
    UI->>Pred: Submit prediction
    Pred->>Race: Verify race state and deadline
    Pred->>Store: Save prediction
    Pred-->>UI: Prediction confirmation
    Race->>Reward: Race completed event
    Reward->>Store: Validate result and record eligible reward
    Reward-->>UI: Updated points and badges
```

## 7. Suggested API Contracts

These are illustrative endpoint contracts. Implement them using the
backend conventions already present in the repository.

  Method   Endpoint                       Purpose
  -------- ------------------------------ -----------------------------------
  GET      `/api/restaurants`             List available restaurants
  GET      `/api/restaurants/:id/menu`    Get restaurant menu
  POST     `/api/orders`                  Create an order
  GET      `/api/orders/:id`              Retrieve order details
  GET      `/api/races/:id`               Retrieve race state
  GET      `/api/races/:id/events`        Retrieve recent race events
  GET      `/api/races`                   Retrieve active demo races
  POST     `/api/races/:id/predictions`   Submit a winner prediction
  GET      `/api/leaderboard`             Retrieve leaderboard
  GET      `/api/users/:id/rewards`       Retrieve user rewards
  GET      `/api/users/:id/profile`       Retrieve profile and achievements

For real-time delivery, the existing project may use WebSockets or
server-sent events. A polling endpoint is acceptable for the hackathon
MVP if it is reliable and clearly documented.

## 8. Race Ranking and Prediction Logic

### ETA-Based Ranking

For active races, sort racers by the smallest valid ETA remaining. Use a
consistent tie-breaking rule, such as greater route progress, followed
by a stable racer ID.

Do not rank riders by actual driving speed or reward unsafe behavior.

### ETA Estimate

A basic demo estimate can use remaining simulated route progress and a
configured average virtual pace:

``` text
remaining_progress = 100 - progress
estimated_seconds = remaining_progress / virtual_progress_rate
```

The actual implementation should handle completed races, invalid values,
preparation time, and any available provider ETA.

### Confidence

Do not display an arbitrary percentage as a calibrated probability. If a
confidence value is shown, document how it is calculated and label it as
a demo estimate unless it has been validated against historical
outcomes.

## 9. Real-Time and Demo Data Strategy

### Demo Mode

-   Use seeded restaurants, food items, users, and racers.
-   Simulate rider movement and race events at a controlled interval.
-   Allow judges to observe a complete race within the demo time.
-   Display a visible "Demo / Simulated Tracking" label.
-   Keep simulation state separate from actual order and provider
    integrations.

### Provider Mode

-   Use configured provider APIs only when credentials and permissions
    are available.
-   Keep provider-specific request/response handling inside adapters.
-   Validate and normalize incoming status, ETA, and location data.
-   Handle rate limits, missing updates, stale positions, and provider
    errors.
-   Never expose secrets or API keys in client-side code.

## 10. Security, Reliability, and Safety

-   Store secrets in environment variables or a secure backend
    configuration.
-   Validate order quantities, prices, prediction deadlines, and user
    input.
-   Calculate prices and rewards on the server when a backend is
    available.
-   Avoid duplicate order submissions and duplicate reward awards.
-   Handle API failures, missing data, and stale tracking updates
    gracefully.
-   Clearly distinguish simulated locations from real tracking.
-   Do not encourage speeding, dangerous shortcuts, or unsafe rider
    behavior.
-   Provide accessible text/status alternatives to animated maps and
    color-coded states.

## 11. Evaluation and Testing Plan

  -----------------------------------------------------------------------
  Area                                Test
  ----------------------------------- -----------------------------------
  Order flow                          Add items, update cart, place
                                      order, and verify confirmation.

  Race simulation                     Verify rider progress, checkpoints,
                                      ETA, and finish status update.

  UI updates                          Measure event-to-screen latency in
                                      the demo environment.

  Ranking                             Verify racers are sorted according
                                      to the documented ETA rule.

  Prediction                          Confirm predictions are locked or
                                      rejected after the deadline.

  Rewards                             Confirm eligible rewards are
                                      awarded once and only once.

  Responsive UI                       Test desktop, tablet, and mobile
                                      layouts.

  Failure handling                    Simulate API failure, missing ETA,
                                      and unavailable commentary
                                      provider.
  -----------------------------------------------------------------------

### Proposed Demo Targets

-   Race updates visible within 2 seconds in the demo environment.
-   Rankings consistent with the current ETA-based ranking rule.
-   No duplicate reward awards in tested completion scenarios.
-   All primary navigation and MVP actions functional.
-   No horizontal overflow on supported mobile and desktop viewport
    sizes.

These are targets to test, not verified performance claims.

## 12. Deployment and Configuration

Deployment depends on the existing framework and hosting environment.

Before deployment:

1.  Confirm the actual framework, build command, and start command.
2.  Configure required environment variables on the hosting platform.
3.  Ensure API secrets remain server-side.
4.  Configure the database or seed demo data.
5.  Verify demo mode works without optional third-party credentials.
6.  Test order placement, race updates, predictions, and rewards in the
    deployed environment.

Document the verified setup commands and environment variables in the
project README and an example environment file. Do not commit real
credentials.

------------------------------------------------------------------------

## Final Architecture Summary

Gadbad Grub is organized around six core capabilities:

1.  Food ordering and order status.
2.  Race tracking and simulation.
3.  ETA and winner prediction.
4.  Live event updates and race commentary.
5.  Leaderboard and rewards.
6.  Responsive desktop and mobile interfaces.

The hackathon MVP should prioritize a working order flow, a visually
impressive Race Watch Hub, reliable simulated updates, understandable
predictions, and a complete rewards loop. Real delivery-provider
integrations can be added through adapters without redesigning the
entire application.

**Gadbad Grub --- Don't Just Track Your Food. Race It!**
