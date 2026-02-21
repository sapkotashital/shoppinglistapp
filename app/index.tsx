import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteItem, getItems, ShoppingItem } from "../lib/appwrite";

export default function HomeScreen() {
  const router = useRouter();

  // All shopping items fetched from Appwrite
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch items from Appwrite database whenever this screen comes into focus
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch every time the screen is focused (e.g. returning from add-list)
  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [fetchItems]),
  );

  // Delete an item from Appwrite and refresh the list
  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.$id !== id));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Top section: title, description & Add button ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List App</Text>
        <Text style={styles.description}>
          Welcome to the Shopping List App! Create and manage your shopping
          lists below.
        </Text>

        {/* Button that navigates to the Add Shopping List screen */}
        <FontAwesome.Button
          name="plus"
          backgroundColor="#983b5c"
          onPress={() => router.push("/add-list")}
          style={styles.addButton}
        >
          Add Item
        </FontAwesome.Button>
      </View>

      {/* ── Bottom section: all items from Appwrite ── */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#983b5c" />
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>
            {'No items yet. Tap "Add Item" to get started!'}
          </Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.$id)}>
                  <Text style={styles.removeText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  // Top header block (title + description + button)
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 16,
  },
  addButton: {
    borderRadius: 8,
  },
  // List section below the header
  listContainer: {
    flex: 1,
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 30,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listItemText: {
    fontSize: 16,
  },
  removeText: {
    color: "#e74c3c",
    fontSize: 14,
  },
});
