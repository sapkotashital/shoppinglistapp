import { apiFetch } from "@/lib/api";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

export interface SubItem {
  name: string;
  quantity: number;
  checked: boolean;
  notes: string;
}

export interface ShoppingItem {
  _id: string;
  title: string;
  items: SubItem[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewItemData {
  title: string;
  items: SubItem[];
}

export interface ToastMessage {
  text: string;
  type: "success" | "error";
}

interface ListContextType {
  items: ShoppingItem[];
  loading: boolean;
  toast: ToastMessage | null;
  clearToast: () => void;
  fetchItems: () => Promise<void>;
  addItem: (data: NewItemData) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleSubItem: (listId: string, itemIndex: number) => Promise<void>;
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
      const data = await apiFetch<ShoppingItem[]>("/api/items");
      setItems(data);
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
      await apiFetch<ShoppingItem>("/api/items", {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          items: data.items,
          isArchived: false,
        }),
      });
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
      await apiFetch(`/api/items/${id}`, { method: "DELETE" });
      await fetchItems();
      setToast({ text: "Item deleted successfully!", type: "success" });
    } catch (error: any) {
      setToast({
        text: error?.message ?? "Failed to delete item.",
        type: "error",
      });
    }
  }

  async function toggleSubItem(listId: string, itemIndex: number) {
    // Optimistically flip the checked flag in local state
    setItems((prev) =>
      prev.map((list) => {
        if (list._id !== listId) return list;
        const updatedSubItems = list.items.map((si, i) =>
          i === itemIndex ? { ...si, checked: !si.checked } : si,
        );
        return { ...list, items: updatedSubItems };
      }),
    );

    // Persist the full updated items array to the backend
    try {
      const list = items.find((l) => l._id === listId);
      if (!list) return;
      const updatedSubItems = list.items.map((si, i) =>
        i === itemIndex ? { ...si, checked: !si.checked } : si,
      );
      await apiFetch(`/api/items/${listId}`, {
        method: "PUT",
        body: JSON.stringify({ items: updatedSubItems }),
      });
    } catch (error: any) {
      // Revert on failure
      await fetchItems();
      setToast({
        text: error?.message ?? "Failed to update item.",
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
        toggleSubItem,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
