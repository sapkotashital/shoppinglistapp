import { databases } from "@/lib/appwrite";
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";
import { ID, Models } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

// Shape of a shopping item document from Appwrite
export interface ShoppingItem extends Models.Document {
  title: string;
}

// Data required when creating a new item
export interface NewItemData {
  title: string;
}

// Toast notification shown after an action
export interface ToastMessage {
  text: string;
  type: "success" | "error";
}

// Shape of the context value
interface ListContextType {
  items: ShoppingItem[];
  loading: boolean;
  toast: ToastMessage | null;
  clearToast: () => void;
  fetchItems: () => Promise<void>;
  addItem: (data: NewItemData) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const ListContext = createContext<ListContextType | undefined>(
  undefined,
);

export const ListProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const clearToast = () => setToast(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments<ShoppingItem>(
        DATABASE_ID,
        COLLECTION_ID,
      );
      setItems(response.documents);
    } catch (error: any) {
      setToast({
        text: error?.message ?? "Failed to load items.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  async function addItem(data: NewItemData) {
    try {
      await databases.createDocument<ShoppingItem>(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        { ...data },
      );
      await fetchItems();
      setToast({ text: "Item added successfully!", type: "success" });
    } catch (error: any) {
      setToast({
        text: error?.message ?? "Failed to add item.",
        type: "error",
      });
    }
  }

  async function deleteItem(id: string) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      await fetchItems();
      setToast({ text: "Item deleted successfully!", type: "success" });
    } catch (error: any) {
      setToast({
        text: error?.message ?? "Failed to delete item.",
        type: "error",
      });
    }
  }

  // Fetch items on initial mount so the list is populated when the app starts
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <ListContext.Provider
      value={{
        items,
        loading,
        toast,
        clearToast,
        fetchItems,
        addItem,
        deleteItem,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
