import { Client, Databases } from "react-native-appwrite";

// ---------------------------------------------------------------------------
// Appwrite client – values are read from the .env file via EXPO_PUBLIC_ prefix
// ---------------------------------------------------------------------------
export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);

export const databases = new Databases(client);
