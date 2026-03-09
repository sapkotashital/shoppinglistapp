import { Platform } from "react-native";

const isDev = __DEV__;

// ── Web (Expo web / browser) ─────────────────────────────────────────────────
const WEB_DEV_URL =
  process.env.EXPO_PUBLIC_API_URL_WEB_DEV ?? "http://localhost:4000";
const WEB_PROD_URL =
  process.env.EXPO_PUBLIC_API_URL_WEB_PROD ?? "http://localhost:4000";

// ── Android ──────────────────────────────────────────────────────────────────
// Emulator: 10.0.2.2 is a special alias that maps to the host machine's localhost
// Physical device: set EXPO_PUBLIC_API_URL_ANDROID_DEV to your LAN IP
const ANDROID_DEV_URL =
  process.env.EXPO_PUBLIC_API_URL_ANDROID_DEV ?? "http://10.0.2.2:4000";
const ANDROID_PROD_URL =
  process.env.EXPO_PUBLIC_API_URL_ANDROID_PROD ?? "http://10.0.2.2:4000";

// ── iOS ───────────────────────────────────────────────────────────────────────
// Simulator: localhost works fine
// Physical device: set EXPO_PUBLIC_API_URL_IOS_DEV to your LAN IP
const IOS_DEV_URL =
  process.env.EXPO_PUBLIC_API_URL_IOS_DEV ?? "http://localhost:4000";
const IOS_PROD_URL =
  process.env.EXPO_PUBLIC_API_URL_IOS_PROD ?? "http://localhost:4000";

export const API_BASE_URL: string = (() => {
  if (Platform.OS === "web") return isDev ? WEB_DEV_URL : WEB_PROD_URL;
  if (Platform.OS === "android")
    return isDev ? ANDROID_DEV_URL : ANDROID_PROD_URL;
  return isDev ? IOS_DEV_URL : IOS_PROD_URL; // ios
})();
