# 🛒 Shopping List App

A cross-platform mobile and web shopping list app built with **React Native**, **Expo**, and **Appwrite**. Add, view, and delete shopping items that are persisted in a cloud database — works on Android, iOS, and Web.

> 👨‍💻 Developed by **Shital Sapkota**

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Appwrite Setup](#appwrite-setup)
- [Environment Variables](#environment-variables)
- [Installation & Running](#installation--running)
- [Screens](#screens)
- [Architecture](#architecture)
- [Available Scripts](#available-scripts)

---

## ✨ Features

- 📦 **View all shopping items** — fetched in real-time from Appwrite database
- ➕ **Add new items** — saved directly to the cloud database
- 🗑️ **Delete items** — with a dedicated confirmation screen
- 🔔 **Toast notifications** — animated success/error feedback (no intrusive alerts)
- 🌐 **Cross-platform** — runs on Android, iOS, and Web from one codebase
- 🔄 **Auto-refresh** — list re-fetches whenever the home screen comes into focus
- ⚡ **Loading states** — spinner shown while data is being fetched
- 🏗️ **TypeScript** — fully typed throughout

---

## 🛠 Tech Stack

| Technology   | Version                         | Purpose                         |
| ------------ | ------------------------------- | ------------------------------- |
| React Native | 0.81.5                          | Core mobile framework           |
| Expo         | ~54.0.33                        | Build tooling & native APIs     |
| Expo Router  | ~6.0.23                         | File-based navigation           |
| Appwrite     | ^0.24.0 (react-native-appwrite) | Backend-as-a-service / database |
| TypeScript   | ~5.9.2                          | Type safety                     |
| React        | 19.1.0                          | UI rendering                    |

---

## 📁 Project Structure

```
shoppinglistapp/
├── app/                        # All screens (Expo Router file-based routing)
│   ├── _layout.tsx             # Root layout – wraps all screens in ListProvider
│   ├── index.tsx               # Home screen – lists all shopping items
│   ├── add.tsx                 # Add screen – form to create a new item
│   └── delete.tsx              # Delete screen – confirmation before deleting
│
├── components/
│   └── Toast.tsx               # Reusable animated toast notification banner
│
├── contexts/
│   └── ListContext.tsx         # React Context – shared state & Appwrite CRUD logic
│
├── hooks/
│   └── useLists.ts             # Custom hook – safe accessor for ListContext
│
├── lib/
│   └── appwrite.ts             # Appwrite client & Databases instance
│
├── assets/                     # Images, icons, fonts
├── .env                        # Environment variables (not committed)
├── app.json                    # Expo app configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies & scripts
```

---

## ✅ Prerequisites

Before running the app you will need:

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://npmjs.com/) v9 or later
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- [Expo Go](https://expo.dev/go) app on your phone (for physical device testing)
- An [Appwrite](https://appwrite.io/) account (free Cloud plan works)

---

## ☁️ Appwrite Setup

1. **Create a project** in the [Appwrite Console](https://cloud.appwrite.io/).
2. **Create a database** and note down the **Database ID**.
3. **Create a collection** inside that database. Collection name can be anything (e.g. `itemslist`).
4. **Add an attribute** to the collection:
   - Attribute key: `title`
   - Type: `String`
   - Size: `255`
   - Required: ✅
5. **Set permissions** on the collection:
   - Read: `Any`
   - Create: `Any`
   - Delete: `Any`
     > ⚠️ For production, replace `Any` with authenticated user permissions.
6. **Register a platform** in your Appwrite project settings:
   - For Android/iOS: add your app's bundle ID / package name
   - For Web: add `localhost` as a hostname

---

## 🔐 Environment Variables

Create a `.env` file in the project root (it is already ignored by `.gitignore`):

```dotenv
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_PROJECT_NAME="Your Project Name"
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
EXPO_PUBLIC_APPWRITE_PLATFORM=com.yourcompany.shoppinglistapp
```

> **Important:** All variables must use the `EXPO_PUBLIC_` prefix (all uppercase) to be accessible at runtime via `process.env`. Any other prefix (e.g. `Expo_PUBLIC_`) will result in `undefined`.

After editing `.env`, always restart Expo with the cache cleared:

```bash
npx expo start --clear
```

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

Copy the example above into a new `.env` file and fill in your Appwrite credentials.

### 4. Start the development server

```bash
# Start with platform picker
npx expo start

# Or target a specific platform directly
npx expo start --android
npx expo start --ios
npx expo start --web
```

### 5. Open on device

- **Physical device** — scan the QR code in the terminal using the Expo Go app
- **Android emulator** — press `a` in the terminal (requires Android Studio)
- **iOS simulator** — press `i` in the terminal (requires Xcode on macOS)
- **Web browser** — press `w` in the terminal

---

## 📱 Screens

### Home Screen (`app/index.tsx`)

- Displays the app title and a brief description at the top
- **Add Item** button (top section) navigates to the Add screen
- Full list of all shopping items fetched from Appwrite (bottom section)
- Shows a loading spinner while items are being fetched
- Shows an empty-state message when no items exist
- Each item has a **Delete** button that navigates to the Delete confirmation screen
- List automatically re-fetches every time this screen comes into focus

### Add Screen (`app/add.tsx`)

- Text input for the new item name (auto-focused on open)
- Inline validation error shown below the input if field is empty
- **Save Item** button — saves to Appwrite and returns to home screen
- **Cancel** button — goes back without saving
- Button shows a loading spinner while saving

### Delete Screen (`app/delete.tsx`)

- Shows the name of the item to be deleted
- **Yes, Delete** button — deletes from Appwrite and returns to home screen
- **Cancel** button — goes back without deleting
- Button shows a loading spinner while deleting

### Toast Notifications (`components/Toast.tsx`)

- Floating animated banner shown at the bottom of the screen
- 🟢 **Green** for success messages (e.g. "Item added successfully!")
- 🔴 **Red** for error messages (e.g. Appwrite error details)
- Fades in on appear, auto-dismisses after 3 seconds with a fade-out
- Cross-platform: uses `boxShadow` on Web and `elevation` on Android

---

## 🏗️ Architecture

The app uses a **React Context + custom hook** pattern to share database state across all screens.

```
app/_layout.tsx
  └─ <ListProvider>            ← Single source of truth for all shopping data
       ├─ app/index.tsx        ← const { items, loading, fetchItems } = useLists()
       ├─ app/add.tsx          ← const { addItem } = useLists()
       └─ app/delete.tsx       ← const { deleteItem } = useLists()
```

### `ListContext` (`contexts/ListContext.tsx`)

| Export       | Type                      | Description                             |
| ------------ | ------------------------- | --------------------------------------- |
| `items`      | `ShoppingItem[]`          | Current list of items from Appwrite     |
| `loading`    | `boolean`                 | `true` while a fetch is in progress     |
| `toast`      | `ToastMessage \| null`    | Current notification (success or error) |
| `clearToast` | `() => void`              | Dismisses the current toast             |
| `fetchItems` | `() => Promise<void>`     | Fetches all documents from Appwrite     |
| `addItem`    | `(data) => Promise<void>` | Creates a document and re-fetches       |
| `deleteItem` | `(id) => Promise<void>`   | Deletes a document and re-fetches       |

### `useLists` hook (`hooks/useLists.ts`)

A thin wrapper around `useContext(ListContext)` that throws a descriptive error if used outside of `<ListProvider>`, preventing silent failures.

### Appwrite Client (`lib/appwrite.ts`)

Initialises the Appwrite `Client` with endpoint, project ID, and platform from `.env`. Exports the `databases` instance used by `ListContext`.

---

## 📜 Available Scripts

| Script  | Command           | Description                                |
| ------- | ----------------- | ------------------------------------------ |
| Start   | `npm start`       | Start Expo dev server with platform picker |
| Android | `npm run android` | Start and open on Android emulator/device  |
| iOS     | `npm run ios`     | Start and open on iOS simulator/device     |
| Web     | `npm run web`     | Start and open in the browser              |
| Lint    | `npm run lint`    | Run ESLint via Expo's lint config          |
