# 🌙 ميقات | Miqaat
> Accurate prayer times for Algerian Wilayas.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)

<p align="center">
  <img src="public/logo.jpg" alt="Miqaat Logo" width="200" />
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

##  Overview
**Miqaat** is a web application designed to provide accurate prayer times specifically for users in Algeria.

## 🌐 Live Demo
[View App](https://miqaat-eight.vercel.app/)

##  Key Features
*    **Dynamic Location Selection**: Easily choose your Wilaya using an interface or by using automatic GPS detection.
*    **Live Countdown**: Real-time updates and countdowns to the next prayer time.
*    **Comprehensive Calendar**: View weekly and monthly prayer schedules with an elegant, printable layout.
*    **Smart Notifications**: Frontend-scheduled notifications firing 1 minute before each prayer.
*    **Hijri Date Display**: Accurate Islamic date fetched from the Aladhan API, displayed alongside the live clock.

## 📸 Screenshots

### 🏠 Home Dashboard
Comprehensive view of current and upcoming prayer times with a live clock.
<p align="center">
  <img src="public/Pasted image (2).png" alt="Home Screen" width="800" />
</p>

### 🗓️ Prayer Calendar
weekly/monthly prayer time calendar.
<p align="center">
  <img src="public/Pasted image (4).png" alt="Calendar View" width="800" />
</p>

## 🛠️ Tech Stack
*   **Frontend**: React (React Router v7)
*   **Language**: TypeScript
*   **Styling**:
    - **Tailwind CSS** (utility-first)
    - **Custom CSS** (design tokens, shimmer animations, theming system)
*   **Icons**: Lucide React
*   **Persistence**: LocalStorage for user preferences
*   **Deployment**: Optimized production build via Vite

## 🏗️ Project Architecture

### 🧩 System Overview
- **UI Layer**
  - Routes / Pages
  - Blocks / Layout Sections
  - Atomic Components
- **Logic & State**
  - Custom Hooks
  - Global Context
  - LocalStorage
- **Data Layer**
  - API Services
  - External AlAdhan API
  - Static Data / Types

### 📁 Directory Breakdown
*   **`app/routes/`**: Entry points for each page (Home, Settings, Calendar, Location).
*   **`app/blocks/`**: Complex, layout-specific sections (e.g., Prayer Grid, Search Header) that compose pages.
*   **`app/components/`**: Reusable atomic UI elements (Buttons, Inputs, Skeletons) following a consistent design system.
*   **`app/hooks/`**: Encapsulated business logic (GPS tracking, prayer time calculations, countdown timers).
*   **`app/context/`**: Global state management using React Context for user preferences and location data.
*   **`app/services/`**: Data fetching layer and API clients for external communication.
*   **`app/data/`**: Static configuration, types, and constants.
*   **`app/i18n/`**: Localization dictionary and logic for Arabic/English support.


## 🔌 API Integration
Miqaat integrates with two external APIs for accurate prayer times and Islamic date conversion.

### Prayer Times — AlAdhan API
*   **Source**: [aladhan.com](https://aladhan.com)
*   **Endpoints**:
    - `/v1/calendarByCity`: Fetches a full annual calendar for the 58 traditional Algerian Wilayas using their city names.
    - `/v1/calendarByAddress`: Fetches a full annual calendar using coordinates for the newly established southern wilayas.
*   **Implementation**: Logic is centralized in [alAdhanService.ts](file:///home/haroune-dev/Desktop/Miqaat/app/services/alAdhanService.ts) (fetching, caching, and mapping) and [api.ts](file:///home/haroune-dev/Desktop/Miqaat/app/services/api.ts) (application mapping). All requests use `method=19` (Algerian Ministry of Religious Affairs and Endowments).

### Hijri Date — Aladhan Islamic Calendar API
*   **Source**: [aladhan.com/islamic-calendar-api](https://aladhan.com/islamic-calendar-api)
*   **Endpoint**:
    - `/v1/gToH`: Converts Gregorian dates to Hijri with accurate month/weekday names in English and Arabic.
*   **Implementation**: [`fetchHijriDate()`](file:///home/haroune-dev/Desktop/Miqaat/app/services/api.ts) in the service layer, called from [`current-time-card.tsx`](file:///home/haroune-dev/Desktop/Miqaat/app/blocks/home/current-time-card.tsx). Falls back to a client-side approximate algorithm if the API is unavailable.


##  Getting Started

### Prerequisites
*   Node.js (LTS version recommended)
*   npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Haroune-dev/miqaat.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
##  Future Improvements
*   [ ] Full Offline Data Persistence (Service Worker).
*   [ ] Support for Baladiyas (Sub-provinces).
*   [ ] Multi-language Expansion (French support).
*   [ ] Advanced Analytics & Insights.

##  Author
**Haroune-dev**

---
