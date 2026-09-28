# Gadbad Grub 🏎️🍔

### Food Delivery Speed Racing

**Tagline:** Every Order Is a Race. Every Bite Is a Victory!

Gadbad Grub is a gamified food-delivery web application that turns the
waiting experience into an interactive virtual racing game. Customers
can place food orders, watch delivery progress on a colorful racing
dashboard, view estimated arrival times, make winner predictions, follow
live race events, and earn points and badges.

The project combines food ordering, simulated real-time delivery
tracking, race-style visualization, AI-assisted ETA/winner predictions,
leaderboards, and rewards in one playful interface.

> **Hackathon MVP note:** When real restaurant, mapping, GPS, or
> delivery-partner APIs are unavailable, the app uses clearly labeled
> simulated/demo data. Simulated rider positions and race events must
> never be presented as real GPS tracking.

------------------------------------------------------------------------

## Table of Contents

-   [Problem Statement](#problem-statement)
-   [Our Solution](#our-solution)
-   [Background](#background)
-   [Pain Points](#pain-points)
-   [Core Features](#core-features)
-   [Crazy / Differentiating Features](#crazy--differentiating-features)
-   [User Workflow](#user-workflow)
-   [Interface and Design](#interface-and-design)
-   [Technology and Integrations](#technology-and-integrations)
-   [Evaluation Metrics](#evaluation-metrics)
-   [MVP Scope](#mvp-scope)
-   [Running the Project](#running-the-project)
-   [Future Enhancements](#future-enhancements)

------------------------------------------------------------------------

## Problem Statement

Traditional food-delivery apps mainly provide order status, a map, and
an estimated delivery time. Waiting can feel boring, tracking updates
may not explain delays, and customers have few opportunities to interact
with the delivery journey.

Gadbad Grub addresses this engagement problem by transforming delivery
progress into a fun, competitive, and transparent virtual race---without
encouraging delivery riders to drive faster or take unsafe risks.

## Our Solution

Gadbad Grub combines a food-ordering experience with a virtual race
arena. Once an order is placed, the customer can follow their delivery
rider and other demo racers, see progress and ETA updates, receive
entertaining race commentary, predict a race winner, and earn virtual
rewards.

The race is a visual gamification layer. Ranking and predictions are
based on delivery progress and estimated arrival time, not unsafe
driving speed.

## Background

-   Food-delivery customers often spend their waiting time repeatedly
    checking order status.
-   Standard tracking maps are useful but may offer limited
    entertainment or interaction.
-   Customers may not understand changes caused by preparation time,
    traffic, or route progress.
-   Delivery platforms can use the waiting period to provide useful
    updates and increase customer engagement.
-   Gamification can make the experience more interactive through
    friendly competition, achievements, and rewards.

## Pain Points

1.  **Boring waiting experience:** Customers have little to do after
    placing an order.
2.  **Basic tracking experience:** A map pin alone does not create an
    engaging delivery journey.
3.  **Limited interaction:** Customers generally cannot participate in a
    fun prediction or race experience.
4.  **ETA uncertainty:** Estimated arrival times can change, and delays
    may not be explained clearly.
5.  **Low engagement during delivery:** The waiting period is an
    opportunity for interaction that conventional tracking often leaves
    unused.

## Core Features

### 1. Food Ordering

-   Browse demo restaurants and food items.
-   View item details and prices.
-   Add or remove items from the cart.
-   Place an order and receive an order ID.
-   View order status, such as placed, preparing, picked up, out for
    delivery, and delivered.

### 2. Race Watch Hub

-   Display an animated, colorful 2D race map inspired by the supplied
    UI references.
-   Show the user's virtual rider and competing demo racers.
-   Visualize route progress, checkpoints, finish line, and race status.
-   Animate rider movement using simulated coordinates when live
    location APIs are not configured.

### 3. Real-Time Updates

-   Show order status and ETA changes.
-   Display a live event feed for events such as order accepted,
    preparation completed, rider pickup, checkpoint reached, and
    delivery completed.
-   Use polling, WebSockets, or the project's existing real-time
    mechanism where available.
-   Clearly indicate whether information is live, simulated, or demo
    data.

### 4. AI-Assisted Race Prediction

-   Estimate arrival time and race position from available delivery
    data.
-   Display a predicted winner and confidence estimate only when the
    prediction method supports it.
-   For the MVP, use a transparent rule-based prediction algorithm based
    on ETA, progress, and available status data.
-   Clearly label rule-based predictions; do not claim a trained ML
    model is being used unless one is actually integrated.

### 5. Leaderboard and Competition

-   Rank demo racers by estimated arrival time or completed race status.
-   Show user rank, racer name, ETA, and progress.
-   Refresh rankings when race data changes.
-   Keep competition friendly and focused on virtual progress---not
    real-world driving speed.

### 6. Rewards and Profile

-   Award virtual XP, points, badges, and streaks for supported actions.
-   Allow users to make a prediction before the race outcome is known.
-   Award prediction points based on the result.
-   Display earned badges, current points, achievements, and race
    history in the profile.
-   Prevent duplicate rewards for the same completed event.

## Crazy / Differentiating Features

  -----------------------------------------------------------------------
  Feature                             Description
  ----------------------------------- -----------------------------------
  AI Race Commentator                 Generates playful commentary from
                                      race events, e.g. "Pizza Racer is
                                      entering the final stretch!"

  Virtual Speed Boost                 Shows a visual boost animation when
                                      a delivery milestone is reached. It
                                      does not affect real rider
                                      behavior.

  Traffic Events                      Adds simulated traffic zones or
                                      route events and updates virtual
                                      race progress and ETA.

  Prediction Challenge                Lets users predict which virtual
                                      racer will finish first and earn XP
                                      or badges for correct predictions.

  Live Race Feed                      Displays event updates such as
                                      pickup, ETA changes, checkpoint
                                      completion, and delivery.

  Finish-Line Celebration             Shows a race-finish animation,
                                      winner status, and earned rewards
                                      after delivery completion.
  -----------------------------------------------------------------------

## User Workflow

1.  **Place Order:** The customer browses food, selects items, adds them
    to the cart, and places an order.
2.  **Start Race:** The app creates an order/race record with an order
    ID, restaurant, status, rider, and ETA.
3.  **Watch Live Race:** The customer opens Race Watch Hub and sees the
    rider and demo competitors moving on the map.
4.  **Follow Updates:** The app refreshes progress, ETA, leaderboard,
    and event feed using configured live or simulated data.
5.  **Predict Winner:** The customer submits a prediction before the
    race ends.
6.  **Complete Delivery:** The app marks the order delivered and
    displays a finish-line celebration.
7.  **Earn Rewards:** The system awards eligible points, XP, and badges
    and updates the profile.

## Interface and Design

The interface follows the two project reference images provided by the
team.

### Desktop Dashboard --- Image 1 Reference

The main dashboard should include:

-   Gadbad Grub logo, racing mascot, and top navigation.
-   Left-side navigation for Home, Order, Leaderboard, Rewards, and
    Profile.
-   Central Race Watch Hub with an interactive 2D map.
-   Live Updates panel.
-   Next Orders & Predictions section.
-   Competition leaderboard.
-   Profile and achievements panel.
-   Rewards and badges panel.
-   A footer or lower banner with the project's food, fun, and happiness
    branding.

### Mobile Experience --- Image 2 Reference

-   Responsive mobile layout with a compact header and bottom
    navigation.
-   Order summary and current preparation/delivery status.
-   Compact racing map and rider event callouts.
-   AI prediction and ETA card.
-   Leaderboard, rewards, and badges adapted for mobile.
-   A visible sequence: Place Order → Start Race → Watch Live Race →
    Predict Winner → Win Rewards.

### Visual Style

-   Bright yellow, electric blue, purple, and dark navy.
-   Cartoon delivery riders, scooters, food icons, and racing tracks.
-   Rounded cards, clear status badges, playful typography, and smooth
    animations.
-   Maintain readability, accessible contrast, and responsive layouts.
-   Use the supplied images as design references, not as static
    screenshots replacing functional UI.

## Technology and Integrations

The final technology stack should follow the existing project
repository. Inspect the current codebase before adding or replacing
frameworks.

Potential implementation areas:

-   **Frontend:** Existing web framework and component system;
    responsive reusable UI components.
-   **Backend:** Existing server/API layer for orders, race state,
    predictions, and rewards.
-   **Database:** Existing database if configured; otherwise local
    storage or a lightweight demo persistence layer for the hackathon
    MVP.
-   **Real-time updates:** Existing WebSocket, server-sent events,
    polling, or simulated timers/state updates.
-   **Map:** Interactive 2D map or custom illustrated race track. Use a
    real mapping provider only when credentials and configuration are
    available.
-   **Prediction:** Transparent ETA/ranking logic for the MVP; a model
    can be integrated later.
-   **AI commentary:** Optional LLM/API integration behind a small
    service interface. Provide fallback templates if no API key is
    configured.

Do not expose API keys or secrets in frontend code or commit them to the
repository. Use environment variables and document required
configuration in an environment example file.

## Evaluation Metrics

The following are proposed hackathon demo targets and measurement
methods, not claims of achieved performance.

  -----------------------------------------------------------------------
  Metric                  How to evaluate         Suggested demo target
  ----------------------- ----------------------- -----------------------
  ETA prediction error    Compare predicted ETA   Measure and display the
                          with the simulated      result over multiple
                          final delivery time;    demo runs.
                          report mean absolute    
                          error.                  

  Update latency          Measure time between a  Aim for updates within
                          simulated/backend event 2 seconds in the demo
                          and its appearance in   environment.
                          the UI.                 

  Ranking accuracy        Compare displayed       Correctly sort racers
                          ordering with the       by the selected ranking
                          ranking implied by      rule.
                          current ETA values.     

  API reliability         Track successful        Handle errors
                          requests, failures, and gracefully and show a
                          fallback behavior.      useful status.

  User engagement         Count predictions,      Demonstrate these
                          leaderboard visits,     events in the MVP.
                          race interactions, and  
                          reward claims.          

  UI responsiveness       Test the dashboard on   Keep core actions
                          desktop, tablet, and    usable without
                          mobile viewport sizes.  horizontal overflow.
  -----------------------------------------------------------------------

## MVP Scope

### Must Have

-   Responsive dashboard inspired by the supplied references.
-   Food browsing, cart, and order placement.
-   Race Watch Hub with animated simulated riders.
-   Order status, ETA, and live event feed.
-   Basic ETA/race prediction with a clear explanation.
-   Leaderboard and winner prediction interaction.
-   Rewards, badges, and profile summary.
-   Clear demo-data labeling and basic error handling.

### If Time Allows

-   AI-generated race commentary.
-   Additional race events and visual boosts.
-   More detailed analytics and race history.
-   Real restaurant, mapping, or delivery integrations, subject to API
    availability and credentials.

## Running the Project

The exact commands depend on the framework and package manager already
used in the repository.

1.  Open the project folder in the development environment.
2.  Inspect the README, package configuration, and existing setup
    instructions.
3.  Install dependencies using the project's existing package manager.
4.  Configure required environment variables using the documented
    example file.
5.  Start the development server using the command configured in the
    project.
6.  Open the local URL printed by the development server.

Do not assume a particular framework or invent commands. Update this
section with the verified commands after inspecting and running the
actual project.

## Future Enhancements

-   Integrate verified restaurant and menu APIs.
-   Connect real delivery-partner tracking with permission and provider
    support.
-   Improve ETA estimation using historical delivery data.
-   Add multiplayer races and friend challenges.
-   Add accessible map alternatives and localization.
-   Provide restaurant and delivery-platform analytics.
-   Add secure user authentication and server-side reward validation.

------------------------------------------------------------------------

**Gadbad Grub --- Don't Just Track Your Food. Race It!**\
Good Food • Fun Journey • Happy You
