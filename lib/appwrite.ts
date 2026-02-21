import { Client, Databases, ID, Models, Query } from "appwrite";

// ---------------------------------------------------------------------------
// Appwrite client – values are read from the .env file via EXPO_PUBLIC_ prefix
// ---------------------------------------------------------------------------
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

// Convenience references to the env-provided IDs
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ShoppingItem extends Models.Document {
  name: string;
}

// ---------------------------------------------------------------------------
// CRUD helpers
// ---------------------------------------------------------------------------

/** Fetch all shopping items ordered by creation date (newest first) */
export async function getItems(): Promise<ShoppingItem[]> {
  const response = await databases.listDocuments<ShoppingItem>(
    DATABASE_ID,
    COLLECTION_ID,
    [Query.orderDesc("$createdAt")],
  );
  return response.documents;
}

/** Add a new shopping item */
export async function addItem(name: string): Promise<ShoppingItem> {
  return databases.createDocument<ShoppingItem>(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    { name },
  );
}

/** Delete a shopping item by its document ID */
export async function deleteItem(id: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
}
