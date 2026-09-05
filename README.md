# WorkerApp — Service Platform & On-Demand Marketplace

A modern, full-stack, multi-lingual service platform and marketplace application built with Next.js 16 (App Router), React 19, TypeScript, Prisma ORM, PostgreSQL, Supabase Auth (with built-in offline mock fallback), and OpenAI.

WorkerApp connects service seekers (Customers) with local service providers (Workers, Freelancers, Businesses) through direct bookings and intelligent on-demand request matching based on geographic proximity. It features real-time messaging, AI-assisted job tracking, integrated payment sheets, automated PDF invoicing with email dispatch, digital wallet management, and 13-language internationalization.

---

## Table of Contents

- [1. Executive Summary \& Purpose](#1-executive-summary--purpose)
- [2. Tech Stack \& Key Dependencies](#2-tech-stack--key-dependencies)
- [3. System Architecture](#3-system-architecture)
- [4. Database Models \& Schema Overview](#4-database-models--schema-overview)
- [5. Repository Structure](#5-repository-structure)
- [6. Key Modules \& Features](#6-key-modules--features)
  - [6.1 Authentication \& Role Management](#61-authentication--role-management)
  - [6.2 Customer Dashboard \& Marketplace](#62-customer-dashboard--marketplace)
  - [6.3 Service Request \& Distance Matching Engine](#63-service-request--distance-matching-engine)
  - [6.4 Direct Worker Booking System](#64-direct-worker-booking-system)
  - [6.5 Chat \& OpenAI Assistant Integration](#65-chat--openai-assistant-integration)
  - [6.6 Invoicing, Payments \& Digital Wallet](#66-invoicing-payments--digital-wallet)
  - [6.7 Multi-Language Localization (13 Languages)](#67-multi-language-localization-13-languages)
- [7. API Reference](#7-api-reference)
  - [7.1 Authentication APIs](#71-authentication-apis)
  - [7.2 Service Requests \& Matching APIs](#72-service-requests--matching-apis)
  - [7.3 Bookings APIs](#73-bookings-apis)
  - [7.4 Chat \& AI APIs](#74-chat--ai-apis)
  - [7.5 Payments, Invoices \& Wallet APIs](#75-payments-invoices--wallet-apis)
  - [7.6 Marketplace \& Product APIs](#76-marketplace--product-apis)
  - [7.7 Profile \& Notification APIs](#77-profile--notification-apis)
- [8. Data Flow Architecture](#8-data-flow-architecture)
- [9. Setup \& Installation Guide](#9-setup--installation-guide)
  - [9.1 Prerequisites](#91-prerequisites)
  - [9.2 Environment Configuration](#92-environment-configuration)
  - [9.3 Database Setup](#93-database-setup)
  - [9.4 Running the Application](#94-running-the-application)
  - [9.5 Development Utilities \& Helper Scripts](#95-development-utilities--helper-scripts)
- [10. Known Limitations \& TODOs](#10-known-limitations--todos)
- [11. Contribution Guide](#11-contribution-guide)

---

## 1. Executive Summary & Purpose

**WorkerApp** is an end-to-end web platform designed to streamline service booking and local trade management.

### Target Audience & Persona Scenarios:
1. **Customers (Service Seekers)**: Book skilled professionals (Plumbers, Electricians, Cleaners, Technicians, etc.) directly or post open service requests with attached media (photos, video, voice notes).
2. **Workers & Freelancers**: Manage incoming job opportunities, set hourly rates and skill portfolios, toggle online/offline availability status, and track earnings.
3. **Businesses / Agencies**: Offer specialized services and products through the integrated e-commerce marketplace.
4. **Administrators**: Monitor platform activity, manage service categories, inspect invoices, and re-trigger billing dispatches.

---

## 2. Tech Stack & Key Dependencies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.2.4 (App Router) | Full-stack server/client component framework |
| **UI Library** | React 19.2.4 | Dynamic interface components |
| **Language** | TypeScript 5 | End-to-end type safety |
| **Styling** | TailwindCSS v4 + `@tailwindcss/postcss` | Modern Utility-First CSS styling |
| **Icons** | Lucide React | Clean icon system across customer/worker portals |
| **Database** | PostgreSQL (Neon / Supabase) | Relational storage for users, bookings, payments, and marketplace |
| **ORM & Driver** | Prisma 7.8 + `@prisma/adapter-pg` | Type-safe database queries and migrations |
| **Auth System** | Supabase SSR (`@supabase/ssr`) | Cookie-based session authentication with custom Supabase Mock fallback |
| **AI Integration** | OpenAI Node SDK + Vercel AI SDK | Conversational AI assistant for booking confirmation & en-route worker tracking |
| **PDF Generation** | `pdf-lib` | Server-side PDF invoice creation |
| **Email Delivery** | `nodemailer` | Automated email dispatch with HTML/PDF invoice attachments |
| **Internationalization** | Custom Context (`LanguageContext`) | 13-language client & server i18n support |

---

## 3. System Architecture

```mermaid
graph TD
    A[Client Browser / Mobile Web] -->|HTTP / React 19 UI| B[Next.js 16 App Router]
    
    subgraph Frontend & API Layer
        B --> C[Page Routes & Server Actions]
        B --> D[API Routes /api/*]
        B --> E[Language Context & i18n]
    end

    subgraph Authentication Layer
        D --> F{Auth Provider}
        F -->|Production| G[Supabase Auth Engine]
        F -->|Local Dev / Fallback| H[Internal Mock Auth Handler /api/supabase-mock]
    end

    subgraph Core Services
        D --> I[Prisma Client / Adapter PG]
        D --> J[OpenAI API Engine gpt-5.4-mini]
        D --> K[Invoice Generator pdf-lib]
        D --> L[Nodemailer SMTP Dispatcher]
    end

    subgraph Data Storage
        I --> M[(PostgreSQL Database)]
        G --> M
        H --> M
    end
```

---

## 4. Database Models & Schema Overview

The database schema is defined in [`prisma/schema.prisma`](file:///c:/new%20team/workerapp/prisma/schema.prisma) and managed via Prisma ORM:

* **User**: Core account model storing basic credentials, role (`CUSTOMER`, `WORKER`, `ADMIN`), notifications preferences, language settings, accessibility options (font size, contrast, animations), wallet balance, and relations.
* **WorkerProfile**: Profile extension for service providers storing skills array, experience, professions list, availability status (`AVAILABLE`, `OFFLINE`), hourly rate, location coordinates (lat/lng), ratings, and portfolio.
* **Booking**: Direct worker booking entity tracking statuses (`PENDING`, `ACCEPTED`, `REJECTED`, `IN_PROGRESS`, `AWAITING_PAYMENT`, `PAYMENT_COMPLETED`, `CANCELLED`), scheduled date, price, job details, voice notes, completion images, and chat flags.
* **ServiceRequest**: Broadcast on-demand requests created by customers, linked with media attachments (image, video, audio) and assigned to workers based on geographic proximity.
* **Media**: File attachments (image, video, audio URLs) attached to service requests.
* **Conversation & Message**: Real-time chat threads between customers and service providers.
* **Payment**: Financial transaction record containing platform fee (default ₹25.00), tax, total amount, payment method (`UPI`, `DEBIT_CARD`, `CREDIT_CARD`, `NET_BANKING`, `WALLET`), transaction ID, and booking reference.
* **Invoice**: Billing record generated upon payment verification containing invoice number, HTML contents, and email delivery status (`PENDING`, `SENT`, `FAILED`).
* **Product, CartItem, WishlistItem, Order, OrderItem**: E-commerce marketplace models supporting product catalog, shopping cart, wishlist, and orders.
* **Notification**: In-app notifications for bookings, requests, payments, and system updates.
* **Transaction**: Log of wallet balance deposits, payments, and worker withdrawals.

---

## 5. Repository Structure

```
workerapp/
├── .env.local                    # Environment configuration (Supabase, Postgres, OpenAI keys)
├── AGENTS.md                     # Agent execution rules and Next.js guidelines
├── next.config.ts                # Next.js configurations & remote image domain rules
├── package.json                  # NPM packages & build scripts
├── postcss.config.mjs            # PostCSS configuration for Tailwind CSS v4
├── RESTART_SERVER.bat            # Windows batch script to clear cache & restart dev server
├── setup.ps1                     # PowerShell script for dev environment setup
├── update_locales.js             # Utility script to sync localization dictionaries
├── prisma/
│   ├── schema.prisma             # Full Prisma database schema
│   ├── seed.ts                   # Core database seed script (Categories & demo users)
│   └── seed_marketplace.ts       # E-commerce marketplace products seed script
└── src/
    ├── app/                      # Next.js App Router pages and API endpoints
    │   ├── (auth)/               # Authentication route group (/login, /signup)
    │   ├── admin/                # Admin portal (/admin/invoices)
    │   ├── api/                  # 19 REST API endpoint modules
    │   ├── businesses/           # Business provider dashboard view
    │   ├── chat/                 # Worker chat overview & active messaging
    │   ├── customer/             # Customer portal (Dashboard, Bookings, Request, Wallet, Explore)
    │   ├── explore/              # Global marketplace explore route
    │   ├── freelance/            # Freelance provider view & opportunities feed
    │   ├── invoice/              # Invoice view & PDF preview page ([id])
    │   ├── jobs/                 # Worker jobs dashboard & detail views
    │   ├── notifications/        # User notifications feed
    │   ├── profile/              # User settings, role upgrades, account settings
    │   ├── uploads/              # Upload handling route
    │   ├── LandingPageClient.tsx # Client interactive landing page component
    │   ├── layout.tsx            # Global Root Layout with Language Provider
    │   └── page.tsx              # Root Home page routing
    ├── components/               # Reusable React client components
    │   ├── ActiveChatRoom.tsx    # Live messaging UI with worker job status updates
    │   ├── CustomerBottomNav.tsx # Customer mobile bottom navigation bar
    │   ├── CustomerSidebarDrawer.tsx # Mobile drawer navigation menu
    │   ├── EditProfessions.tsx   # Worker profession & skills editor modal
    │   ├── HomeInteractions.tsx  # Customer home page search & category interactions
    │   ├── OpportunitiesFeed.tsx # Live job feed for workers
    │   ├── PaymentSheet.tsx      # Payment modal sheet supporting UPI, Card, Wallet
    │   ├── Portal.tsx            # React Portal wrapper for modals
    │   └── ProductMedia.tsx      # Media gallery viewer for product listings
    ├── context/
    │   └── LanguageContext.tsx   # 13-language translation context & cookie switcher
    ├── hooks/
    │   └── useDebounce.ts        # Custom React hook for debouncing search queries
    ├── lib/
    │   ├── data.ts               # Static mock data & fallback items
    │   ├── firebaseAdmin.ts      # Firebase Admin SDK setup for push notifications
    │   ├── prisma.ts             # Prisma Client instance with PG adapter connection pooling
    │   └── supabase.ts           # Supabase browser client with dynamic endpoint routing
    ├── locales/
    │   └── index.ts              # 13-language translation dictionaries (en, ta, ml, te, hi, etc.)
    └── utils/
        ├── distance.ts           # Geographic Haversine distance calculator
        ├── email.ts              # HTML invoice compiler and SMTP email sender
        ├── invoiceGenerator.ts   # Server-side PDF invoice compiler using pdf-lib
        ├── serverLanguage.ts     # Server-side language resolution from request cookies
        └── supabase/             # Supabase server client and middleware handlers
```

---

## 6. Key Modules & Features

### 6.1 Authentication & Role Management
* Supports three primary user roles: `CUSTOMER`, `WORKER` (with `FREELANCER` and `BUSINESS` variants), and `ADMIN`.
* **Supabase Auth & Offline Fallback**: Authenticates through Supabase SSR. When running locally without a live Supabase server, the application seamlessly routes auth calls to [`/api/supabase-mock`](file:///c:/new%20team/workerapp/src/app/api/supabase-mock/[[...path]]/route.ts), which uses PostgreSQL `auth.users` tables and issue signed JWTs directly.
* Role-switching and profile upgrades via `/profile/upgrade`.

### 6.2 Customer Dashboard & Marketplace
* **Category Explorer**: Browse 12 major service categories (Plumbing, Electrical, Cleaning, Repair, Carpentry, Painting, Appliance, Moving, Lawn & Garden, Pest Control, Beauty & Wellness, IT & Tech).
* **E-Commerce Store**: Discover eco-friendly products and service supplies in `/customer/explore`. Supports cart management, wishlist saved items, and direct order placement.

### 6.3 Service Request & Distance Matching Engine
* Customers create broadcast service requests with voice recordings, budget, and media attachments via `/customer/request`.
* **Proximity Matching Algorithm**: Uses the Haversine formula ([`src/utils/distance.ts`](file:///c:/new%20team/workerapp/src/utils/distance.ts)) to calculate real-time distance between customer coordinates and active workers.
* Automatically identifies the nearest online service provider with matching skill tags and delivers instant booking notification alerts.

### 6.4 Direct Worker Booking System
* Customers can view detailed worker profiles (`/customer/services/workers/[id]`) showing skills, hourly rate, verified ratings, working hours, and location distance.
* Direct booking interface (`/customer/services/book/[id]`) allowing customers to select dates, attach voice notes, specify priority, and send direct job requests.

### 6.5 Chat & OpenAI Assistant Integration
* Real-time end-to-end messaging room ([`ActiveChatRoom.tsx`](file:///c:/new%20team/workerapp/src/components/ActiveChatRoom.tsx)) for active bookings.
* **AI Job Tracker**: Route `/api/chat` integrates OpenAI (`gpt-5.4-mini`) to validate worker job acceptances, calculate estimated arrival times, and provide automated customer updates during service dispatch.

### 6.6 Invoicing, Payments & Digital Wallet
* **Digital Wallet**: Integrated user wallet with pre-funded demo balance (₹5,000.00), supporting deposits and instant job payment debits (`/customer/wallet`).
* **Payment Sheet**: Interactive payment sheet modal ([`PaymentSheet.tsx`](file:///c:/new%20team/workerapp/src/components/PaymentSheet.tsx)) supporting UPI, Debit/Credit Card, Net Banking, and Wallet payments.
* **Automated PDF Invoicing**: Upon payment verification (`/api/payments/verify`), an invoice number (e.g., `INV-2026-XXXX`) is assigned, a PDF is rendered via `pdf-lib`, and an email notification with the attached PDF is dispatched via `nodemailer`.

### 6.7 Multi-Language Localization (13 Languages)
* Full internationalization system built with `LanguageContext` supporting 13 languages:
  1. English (`en`)
  2. Tamil (`ta`)
  3. Malayalam (`ml`)
  4. Telugu (`te`)
  5. Kannada (`kn`)
  6. Hindi (`hi`)
  7. Bengali (`bn`)
  8. Marathi (`mr`)
  9. Gujarati (`gu`)
  10. Punjabi (`pa`)
  11. Odia (`or`)
  12. Assamese (`as`)
  13. Urdu (`ur`)
* Remembers language selection across sessions using HTTP-only cookies (`app_language`) and syncs user preferences to the database.

---

## 7. API Reference

### 7.1 Authentication APIs

#### `GET /api/auth/check`
* **Purpose**: Verifies active session token validity.
* **Output**: `{ authenticated: boolean, user?: object }`

#### `POST /api/auth/sync`
* **Purpose**: Synchronizes Supabase auth metadata with Prisma `User` and `WorkerProfile` database records.
* **Input**: `{ userId: string, role: string, name: string, email: string }`
* **Output**: `{ success: boolean, user: object }`

---

### 7.2 Service Requests & Matching APIs

#### `POST /api/requests`
* **Purpose**: Creates an on-demand service request, computes nearest matching worker, and uploads media.
* **Input**: `FormData` (`category`, `description`, `budget`, `latitude`, `longitude`, `media` files)
* **Output**: `{ message: string, id: string }` (Status 201)

#### `POST /api/requests/accept`
* **Purpose**: Allows a worker to accept an open service request.
* **Input**: `{ requestId: string, workerId: string }`
* **Output**: `{ success: boolean, bookingId: string }`

---

### 7.3 Bookings APIs

#### `POST /api/bookings/create`
* **Purpose**: Creates a direct booking with a specific worker.
* **Input**: `{ workerId: string, jobDetails: string, price: number, scheduledAt?: string, category: string, priority?: string, voiceUrl?: string }`
* **Output**: `{ success: boolean, booking: object }`

#### `POST /api/bookings/update-status`
* **Purpose**: Transitions booking state (`ACCEPTED`, `REJECTED`, `IN_PROGRESS`, `COMPLETED`, `AWAITING_PAYMENT`, `CANCELLED`).
* **Input**: `{ bookingId: string, status: string }`
* **Output**: `{ success: boolean, booking: object }`

#### `GET /api/customer/bookings-summary`
* **Purpose**: Fetches metrics on total, pending, and completed bookings for the logged-in customer.
* **Output**: `{ activeCount: number, completedCount: number, pendingCount: number }`

---

### 7.4 Chat & AI APIs

#### `POST /api/chat`
* **Purpose**: Interacts with the OpenAI (`gpt-5.4-mini`) assistant for en-route tracking and job validation.
* **Input**: `{ messages: Array<{ role: string, content: string }> }`
* **Output**: `{ message: { content: string } }`

#### `GET / POST /api/chat/messages`
* **Purpose**: Fetches or sends messages in an active conversation thread.
* **Input (POST)**: `{ conversationId: string, content: string }`
* **Output**: `{ success: boolean, message: object }`

#### `GET / POST /api/chat/sessions`
* **Purpose**: Retrieves or starts a conversation session between a customer and worker.
* **Input (POST)**: `{ workerId: string }`
* **Output**: `{ conversationId: string }`

---

### 7.5 Payments, Invoices & Wallet APIs

#### `POST /api/payments/create`
* **Purpose**: Initializes payment intent with fixed platform fee (₹25.00) and calculates total.
* **Input**: `{ bookingId: string, amount: number, method: string }`
* **Output**: `{ success: boolean, paymentId: string, totalAmount: number }`

#### `POST /api/payments/verify`
* **Purpose**: Atomic verification of payment, transitions booking to `PAYMENT_COMPLETED`, generates invoice record, and emails PDF invoice to customer. Includes idempotency guards.
* **Input**: `{ paymentId: string, transactionId?: string }`
* **Output**: `{ success: boolean, payment: object, invoice: object, emailPreviewUrl?: string }`

#### `GET /api/invoices`
* **Purpose**: Lists invoices for the authenticated user.
* **Output**: `Array<Invoice>`

#### `GET /api/invoices/[id]`
* **Purpose**: Retrieves detailed invoice metadata and renders PDF download response.

#### `POST /api/admin/invoices/[id]/resend`
* **Purpose**: Admin endpoint to re-send invoice emails.
* **Output**: `{ success: boolean, message: string }`

#### `GET / POST /api/wallet`
* **Purpose**: Gets user wallet balance or processes deposits.
* **Input (POST)**: `{ amount: number, type: "DEPOSIT" | "PAYMENT" }`
* **Output**: `{ balance: number, transaction: object }`

#### `POST /api/wallet/withdraw`
* **Purpose**: Processes payout requests for worker earnings.
* **Input**: `{ amount: number, bankDetails: object }`
* **Output**: `{ success: boolean, newBalance: number }`

---

### 7.6 Marketplace & Product APIs

#### `GET /api/explore/products`
* **Purpose**: Fetches catalog products with category/search filter support.
* **Output**: `Array<Product>`

#### `POST /api/explore/cart`
* **Purpose**: Adds or updates items in user's shopping cart.
* **Input**: `{ productId: string, quantity: number }`
* **Output**: `{ success: boolean, cart: object }`

#### `POST /api/explore/order`
* **Purpose**: Checkout cart items and create an e-commerce order.
* **Input**: `{ items: Array<object>, shippingAddress: string }`
* **Output**: `{ success: boolean, orderId: string }`

---

### 7.7 Profile & Notification APIs

#### `POST /api/profile/update`
* **Purpose**: Updates user preferences (language, theme, contrast, notifications, address).
* **Input**: `{ language?: string, theme?: string, ... }`
* **Output**: `{ success: boolean, user: object }`

#### `POST /api/profile/upgrade`
* **Purpose**: Upgrades a customer account to worker or business status.
* **Input**: `{ role: "WORKER", professions: string[], hourlyRate: number }`
* **Output**: `{ success: boolean }`

#### `GET /api/notifications`
* **Purpose**: Fetches user notifications.
* **Output**: `{ notifications: Array<Notification> }`

---

## 8. Data Flow Architecture

### End-to-End Service Booking Flow

```
[Customer] -> Submits On-Demand Request (Category, Budget, Voice/Photo)
     │
     ▼
[API: POST /api/requests] -> Executes Proximity Algorithm (Haversine distance)
     │
     ▼
[Prisma DB] -> Queries WorkerProfile & selects closest online provider
     │
     ▼
[Notification Engine] -> Dispatches "New Service Request" notification to Worker
     │
     ▼
[Worker] -> Accepts Request -> Creates Booking (Status: ACCEPTED)
     │
     ▼
[Active Chat Room] -> Real-time messaging enabled between Customer & Worker
     │               └─ OpenAI Bot monitors en-route ETA & confirmation status
     ▼
[Worker] -> Marks Job COMPLETED with optional completion photo
     │
     ▼
[Customer] -> Triggers Payment Sheet (UPI / Card / Wallet)
     │
     ▼
[API: POST /api/payments/verify] -> Atomic Prisma Transaction:
     ├── Sets Payment status = SUCCESSFUL
     ├── Sets Booking status = PAYMENT_COMPLETED
     ├── Generates Invoice (INV-2026-XXXX)
     └── Compiles PDF (pdf-lib) & Emails via Nodemailer (SMTP / Ethereal)
     │
     ▼
[Wallet System] -> Credits worker balance / debits customer wallet
```

---

## 9. Setup & Installation Guide

### 9.1 Prerequisites
* **Node.js**: `v20.x` or higher
* **npm**: `v10.x` or higher
* **PostgreSQL**: Local PostgreSQL instance or cloud PostgreSQL database (Neon, Supabase, AWS RDS)

### 9.2 Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Connection (Neon / PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=verify-full"
DIRECT_URL="postgresql://user:password@host:5432/dbname?sslmode=verify-full"

# Supabase Auth Configuration (Points to mock for local dev without external Supabase)
NEXT_PUBLIC_SUPABASE_URL="http://localhost:3000/api/supabase-mock"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-or-mock-key"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"

# OpenAI API Key (For Chatbot & en-route assistance)
OPENAI_API_KEY="sk-proj-your-openai-api-key"

# SMTP Email Configuration (Optional - defaults to Ethereal SMTP test account if omitted)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT="587"
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"
SMTP_SECURE="false"
```

### 9.3 Database Setup

1. **Install NPM dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Push Schema to Database**:
   ```bash
   npx prisma db push
   ```

4. **Seed Database with Categories & Demo Data**:
   ```bash
   npx tsx prisma/seed.ts
   npx tsx prisma/seed_marketplace.ts
   ```

### 9.4 Running the Application

* **Development Mode**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

* **Production Build**:
  ```bash
  npm run build
  npm run start
  ```

### 9.5 Development Utilities & Helper Scripts

* **Server Restart Script (`RESTART_SERVER.bat`)**:
  Windows batch script that kills hanging Node processes, clears `.next` cache, regenerates Prisma client, pushes database schema, and starts a fresh development server.
  ```cmd
  .\RESTART_SERVER.bat
  ```

* **Setup Script (`setup.ps1`)**:
  PowerShell script to reset dev environment cache and launch Next.js dev server:
  ```powershell
  .\setup.ps1
  ```

---

## 10. Known Limitations & TODOs

1. **Supabase Auth Mock**:
   * Uses an embedded mock auth server (`/api/supabase-mock`) when `NEXT_PUBLIC_SUPABASE_URL` is set to the local mock endpoint.
   * *Future Improvement*: Support full OAuth 2.0 social logins (Google, Apple) when configured with live Supabase credentials.

2. **Payment Gateway Integration**:
   * Current payment verification (`/api/payments/verify`) simulates payment capture for demo, UPI, and digital wallet balances.
   * *Future Improvement*: Plug in active Razorpay or Stripe Webhook handlers for production card capture.

3. **Haversine Proximity Model**:
   * Nearest worker calculations currently rely on 2D spherical coordinates.
   * *Future Improvement*: Integrate Google Maps Distance Matrix API for real-time driving traffic times.

4. **SMTP Email Delivery**:
   * Defaults to Ethereal SMTP test account if `SMTP_HOST` is not set in `.env.local`. Ensure production SMTP credentials are configured before live deployment.

---

## 11. Contribution Guide

We welcome contributions! Please follow these guidelines:

1. **Branching Strategy**:
   * Create feature branches from `main`: `feature/your-feature-name` or `fix/your-bug-fix`.
2. **Next.js & React 19 Conventions**:
   * Follow Next.js App Router rules. Mark interactive client components with `"use client"` directive at the top.
   * Keep server utilities and Prisma calls inside Server Components or API route handlers.
3. **Database Schema Changes**:
   * When modifying `prisma/schema.prisma`, run `npx prisma db push` and `npx prisma generate` to verify model integrity.
4. **Pull Request Checklist**:
   * Ensure TypeScript type-checking passes (`npx tsc --noEmit`).
   * Test multi-language keys if adding UI strings to `src/locales/index.ts`.
