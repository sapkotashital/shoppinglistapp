# 🛒 Shopping List App

A cross-platform mobile and web shopping list app built with **React Native**, **Expo**, and a **custom Node.js + MongoDB backend**. Create and manage shopping lists with sub-items, track quantities, notes, and checked status — works on Android, iOS, and Web.

> 👨‍💻 Developed by **Shital Sapkota**

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [MongoDB Structure](#mongodb-structure)
- [Architecture & Data Flow](#architecture--data-flow)
- [Environment Variables](#environment-variables)
- [Prerequisites](#prerequisites)
- [Installation & Running](#installation--running)
- [Screens](#screens)
- [API Reference](#api-reference)
- [Platform Notes](#platform-notes)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

- 📋 **Shopping lists with sub-items** — each list has a title and multiple named items with quantity, notes, and a checked state
- ➕ **Add new lists** — form with list title, item name, quantity, notes, and checked toggle
- 🗑️ **Delete lists** — dedicated confirmation screen before deletion
- ✅ **Toggle checked state** — tap any sub-item on the home screen to check/uncheck it; updates the backend instantly with optimistic UI
- 🔽 **Collapsible list cards** — tap a list card to expand/collapse its sub-items
- 🔔 **Toast notifications** — animated success/error feedback that auto-dismisses
- 🌐 **Cross-platform** — single codebase runs on Android, iOS, and Web
- 🔄 **Auto-refresh** — list re-fetches whenever the home screen comes into focus
- ⚡ **Loading states** — spinner shown during fetch/save operations
- 🏗️ **TypeScript** — fully typed throughout

---

## 🛠 Tech Stack

| Technology      | Version     | Purpose                     |
| --------------- | ----------- | --------------------------- |
| React Native    | 0.81.5      | Core mobile framework       |
| Expo            | ~54.0.33    | Build tooling & native APIs |
| Expo Router     | ~6.0.23     | File-based navigation       |
| TypeScript      | ~5.9.2      | Type safety                 |
| React           | 19.1.0      | UI rendering                |
| Node.js Backend | Custom      | REST API server             |
| MongoDB         | Cloud/Local | Database for shopping lists |

---

## 📁 Project Structure

```
shoppinglistapp/
├── app/                        # Screens (Expo Router file-based routing)
│   ├── _layout.tsx             # Root layout — wraps all screens in ListProvider
│   ├── index.tsx               # Home screen — displays all shopping lists
│   ├── add.tsx                 # Add screen — form to create a new list with items
│   └── delete.tsx              # Delete screen — confirmation before deleting a list
│
├── components/
│   └── Toast.tsx               # Animated toast notification banner
│
├── contexts/
│   └── ListContext.tsx         # React Context — shared state & all API calls
│
├── hooks/
│   └── useLists.ts             # Custom hook — safe accessor for ListContext
│
├── lib/
│   ├── api.ts                  # Generic fetch wrapper (apiFetch)
│   └── appwrite.ts             # Empty — Appwrite removed, kept as placeholder
│
├── src/
│   └── apiConfig.ts            # Platform-aware base URL resolver
│
├── assets/                     # Images and icons
├── .env                        # Environment variables (not committed)
├── app.json                    # Expo app configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies & scripts
```

---

## 🍃 MongoDB Structure

Each document in the `items` collection represents one shopping list:

```json
{
  "_id": "69abe4831a3052dd75905854",
  "userId": "1",
  "title": "Weekly Groceries",
  "items": [
    {
      "name": "Milk",
      "quantity": 2,
      "checked": false,
      "notes": "Low fat if available"
    },
    {
      "name": "Eggs",
      "quantity": 12,
      "checked": false,
      "notes": ""
    },
    {
      "name": "Bread",
      "quantity": 1,
      "checked": true,
      "notes": "Whole grain"
    }
  ],
  "isArchived": false,
  "createdAt": "2026-03-09T10:00:00.000Z",
  "updatedAt": "2026-03-09T11:30:00.000Z"
}
```

| Field        | Type     | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| `_id`        | ObjectId | MongoDB auto-generated unique identifier        |
| `userId`     | String   | Owner of the list (placeholder for future auth) |
| `title`      | String   | Display name of the shopping list               |
| `items`      | Array    | Sub-items (name, quantity, checked, notes)      |
| `isArchived` | Boolean  | Soft-delete / archive flag                      |
| `createdAt`  | String   | Creation timestamp                              |
| `updatedAt`  | String   | Last updated timestamp                          |

---

## 🏗️ Architecture & Data Flow

```
┌─────────────────────────────────────┐
│            React Native App          │
│                                      │
│  ┌──────────┐   ┌──────────────────┐ │
│  │ Screens  │──▶│  ListContext      │ │
│  │ index    │   │  (state + CRUD)   │ │
│  │ add      │   └────────┬─────────┘ │
│  │ delete   │            │           │
│  └──────────┘            │           │
│                     lib/api.ts       │
│                   (apiFetch wrapper) │
└─────────────────────────┬───────────┘
                          │  HTTP (fetch)
                          ▼
            ┌─────────────────────────┐
            │   Node.js REST Backend   │
            │   localhost:4000         │
            │                         │
            │  GET    /api/items       │
            │  POST   /api/items       │
            │  PUT    /api/items/:id   │
            │  DELETE /api/items/:id   │
            └────────────┬────────────┘
                         │  Mongoose / MongoDB Driver
                         ▼
            ┌─────────────────────────┐
            │         MongoDB          │
            │     items collection     │
            └─────────────────────────┘
```

### How it works step by step

1. **App starts** → `ListProvider` mounts and calls `fetchItems()` → `GET /api/items` → sets `items` state
2. **Home screen** → renders collapsible `ListCard` components from `items` state
3. **Toggle checked** → taps sub-item → optimistic UI update in local state → `PUT /api/items/:id` with updated `items[]` → reverts on failure
4. **Add list** → fills form (title + sub-items) → taps Save → `POST /api/items` → re-fetches list
5. **Delete list** → taps trash icon → navigates to delete confirmation → taps Yes → `DELETE /api/items/:id` → re-fetches list
6. **Platform URL** → `src/apiConfig.ts` picks the correct base URL based on `Platform.OS` and `__DEV__`

---

## 🔐 Environment Variables

Create a `.env` file in the project root (already ignored by `.gitignore`):

```dotenv
# ── Web (browser via expo web) ──────────────────────────
EXPO_PUBLIC_API_URL_WEB_DEV=http://localhost:4000
EXPO_PUBLIC_API_URL_WEB_PROD=https://api.yourproductiondomain.com

# ── Android ─────────────────────────────────────────────
# Emulator: use http://10.0.2.2:4000
# Physical device (same WiFi): use your machine's LAN IP
EXPO_PUBLIC_API_URL_ANDROID_DEV=http://192.168.1.101:4000
EXPO_PUBLIC_API_URL_ANDROID_PROD=https://api.yourproductiondomain.com

# ── iOS Simulator / Device ───────────────────────────────
# Physical device (same WiFi): use your machine's LAN IP
EXPO_PUBLIC_API_URL_IOS_DEV=http://localhost:4000
EXPO_PUBLIC_API_URL_IOS_PROD=https://api.yourproductiondomain.com
```

> All variables must use the `EXPO_PUBLIC_` prefix to be accessible at runtime.  
> Always restart Expo after editing `.env`: `npx expo start --clear`

To find your machine's LAN IP on Windows:

```bash
ipconfig | findstr "IPv4"
```

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://npmjs.com/) v9 or later
- [Expo Go](https://expo.dev/go) app on your phone (for physical device testing)
- Your custom Node.js + MongoDB backend running locally or deployed

---

## 🚀 Installation & Running

### 1. Clone the repository

```bash
git clone https://github.com/your-username/shoppinglistapp.git
cd shoppinglistapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the `.env` example above into a new `.env` file and update the URLs to match your backend.

### 4. Start the backend

Make sure your Node.js backend is running on port `4000` and listening on `0.0.0.0` (not just `localhost`) so physical devices can connect:

```js
app.listen(4000, "0.0.0.0", () => console.log("Server running on port 4000"));
```

### 5. Start the Expo dev server

```bash
npx expo start
```

| Key     | Action                        |
| ------- | ----------------------------- |
| `a`     | Open on Android emulator      |
| `i`     | Open on iOS simulator (macOS) |
| `w`     | Open in web browser           |
| Scan QR | Open in Expo Go on device     |

---

## 📱 Screens

### Home Screen — `app/index.tsx`

- Displays all shopping lists as collapsible cards
- Each card shows: list title, item count, expand/collapse chevron, and a delete button
- Expanded card shows each sub-item with checkbox icon, name (strikethrough if checked), quantity, and notes
- Tap any sub-item to toggle its checked state (updates backend instantly with optimistic UI)
- **Add List** button navigates to the Add screen
- List auto-refreshes on focus

### Add Screen — `app/add.tsx`

- **List Title** input (required)
- Sub-item form: Name (required), Quantity (numeric), Notes (multiline), Checked toggle
- **Add to List** button accumulates sub-items into a preview list
- Preview shows added items with a trash icon to remove any
- **Save List** — `POST /api/items` with title + all sub-items, then returns home
- **Cancel** — navigates back without saving

### Delete Screen — `app/delete.tsx`

- Shows the list title to confirm deletion
- **Yes, Delete** — `DELETE /api/items/:id`, then returns home
- **Cancel** — navigates back without deleting

---

## 🔌 API Reference

All requests go to `BASE_URL` resolved from `src/apiConfig.ts`.

| Method   | Endpoint         | Body                             | Description               |
| -------- | ---------------- | -------------------------------- | ------------------------- |
| `GET`    | `/api/items`     | —                                | Fetch all shopping lists  |
| `POST`   | `/api/items`     | `{ title, items[], isArchived }` | Create a new list         |
| `PUT`    | `/api/items/:id` | `{ items[] }`                    | Update sub-items (toggle) |
| `DELETE` | `/api/items/:id` | —                                | Delete a list             |

---

## 📡 Platform Notes

| Platform            | Dev URL            | Notes                                       |
| ------------------- | ------------------ | ------------------------------------------- |
| Web (browser)       | `localhost:4000`   | Works directly                              |
| Android Emulator    | `10.0.2.2:4000`    | Special alias that maps to the host machine |
| Android Device      | `192.168.x.x:4000` | Must be on the same WiFi; use your LAN IP   |
| iOS Simulator       | `localhost:4000`   | Works directly                              |
| iOS Physical Device | `192.168.x.x:4000` | Must be on the same WiFi; use your LAN IP   |

---

## 🔮 Future Enhancements

- [ ] **User authentication** — JWT-based login/register; replace hardcoded `userId` with the authenticated user's ID
- [ ] **Edit list** — update list title or modify existing sub-items
- [ ] **Archive lists** — soft-delete using the existing `isArchived` flag instead of permanent deletion
- [ ] **Filter / search** — search lists by title or filter by archived/active
- [ ] **Offline support** — cache lists locally with AsyncStorage and sync when back online
- [ ] **Push notifications** — remind users about unchecked items
- [ ] **Drag-to-reorder** — reorder sub-items within a list
- [ ] **Categories / tags** — assign colour-coded tags to lists (e.g. Weekly, Pharmacy, Hardware)
- [ ] **Share lists** — share a list with another user by their ID or email
- [ ] **Dark mode** — respect the system colour scheme
- [ ] **CI/CD pipeline** — automated testing and deployment with GitHub Actions
- [ ] **Unit & integration tests** — Jest + React Native Testing Library
