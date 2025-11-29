# NthStore - E-Commerce Nth Order Discount System

A full-stack e-commerce simulation designed to demonstrate complex business logic implementation, specifically the "Nth Order" discount system. This project features a React frontend, Node.js backend, and a custom in-memory transactional store.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Stack](https://img.shields.io/badge/stack-React%20|%20Node.js%20|%20TypeScript-orange.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Business Logic (Nth Order)](#business-logic-nth-order)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## 🔭 Overview

**NthStore** simulates an online shop where every **n-th order** (configurable, default n=3) is eligible for a discount coupon. The system is composed of:
1. **User-Facing Shop:** Browse products, add to cart, and checkout.
2. **Admin Dashboard:** Monitor sales stats and generate discount codes based on order milestones.
3. **Backend Engine:** Handles race conditions, validations, and the core "Nth order" algorithm.

---

## ✨ Features

### 🛍️ Customer Experience
- **Dynamic Product Catalog:** Real-time fetching of products via React Query.
- **Smart Cart:** Persistent cart management with subtotal and tax calculations.
- **Coupon System:** Apply valid discount codes during checkout (10% off).
- **Instant Feedback:** Live UI updates upon successful actions.

### 👨‍💻 Admin Dashboard
- **Live Analytics:** Real-time tracking of Total Orders, Revenue, and Discounts given.
- **Conditional Code Generator:** 
  - Only generates codes when the *next* order is an Nth milestone.
  - **Strict Validation:** Prevents generating multiple codes for the same milestone (Double-Spending prevention).
- **Audit Log:** View history of generated codes and their usage status.

---

## 🏗️ Architecture

The project follows a **Monorepo-style** structure separating concerns between Client and Server.

### Tech Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS, TanStack Query (React Query), React Router DOM.
- **Backend:** Node.js, Express, TypeScript.
- **Data Store:** In-Memory Class-based Store (Simulating a DB with transactional integrity).

---

## ⚙️ Prerequisites

Ensure you have the following installed:
- **Node.js** (v16+)
- **npm** or **yarn**

---

## 🚀 Installation & Setup

### 1. Backend Setup
 Navigate to the backend folder and start the server.

```

cd backend
npm install
npm run dev

```
*Server runs on `http://localhost:3000`*

### 2. Frontend Setup
Open a new terminal, navigate to the frontend folder, and start the UI.

```

cd frontend
npm install
npm run dev

```
*Client runs on `http://localhost:5173` (default Vite port)*

---

## 📡 API Documentation

### Public Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | List all available products. |
| `GET` | `/api/cart/:userId` | Fetch current user's cart. |
| `POST` | `/api/cart/add` | Add item to cart. Body: `{ userId, productId }` |
| `POST` | `/api/checkout` | Place order. Body: `{ userId, discountCode? }` |

### Admin Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Analytics (Total sales, items sold, discount logs). |
| `POST` | `/api/admin/generate-code` | **Core Logic.** Attempts to generate a discount code if `(totalOrders + 1) % n === 0`. |

---

## 🧠 Business Logic (Nth Order)

The core requirement is that **every n-th order** gets a discount code. To ensure integrity:

1. **Configuration:** `n` is set to `3` by default.
2. **Eligibility Check:** When Admin clicks "Generate", the backend checks:
   $ (CurrentOrderCount + 1) \mod n \equiv 0 $
3. **Anti-Duplication (The Fix):** 
   - Even if the condition is met, the system checks a `generatedCodesLog` map.
   - If a code was already generated for **Order #6**, a second request will be rejected.
   - This ensures only **one** lucky user gets the code per milestone.
4. **Consumption:** A code is marked `isUsed: true` immediately upon successful checkout to prevent reuse.

---

## 🧪 Testing

The project is set up for scalability. To add unit tests:

**Backend (Jest):**
```

npm install --save-dev jest ts-jest @types/jest supertest
npx ts-jest config:init

```
*Example test file `src/tests/store.test.ts` is included in the source for testing the Nth logic.*

---

## 📂 Project Structure

```

root
├── backend
│   ├── src
│   │   ├── controllers.ts   \# API Resolvers
│   │   ├── store.ts         \# In-Memory DB \& Nth Logic
│   │   ├── types.ts         \# Shared Interfaces
│   │   └── server.ts        \# Express Entry
│   └── package.json
│
└── frontend
├── src
│   ├── components       \# Reusable UI (Navbar, Cards)
│   ├── pages            \# Route Views (Shop, Cart, Admin)
│   ├── api.ts           \# Axios \& API Layer
│   └── main.tsx         \# React Entry
└── package.json

```

---

## 🛡️ Assumptions & Constraints

1. **In-Memory Storage:** Data resets on server restart.
2. **Single User Demo:** Frontend hardcodes `user_123` for simplicity (as per assignment scope).
3. **Concurrency:** The node.js event loop handles basic concurrency; for production, a Redis lock or Database transaction would be required for the "Nth Order" check.

---

**Assignment Submission**  
*Developed byMohd Farhan Ansari*

