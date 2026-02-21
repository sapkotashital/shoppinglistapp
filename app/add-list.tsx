import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { addItem, deleteItem, getItems, ShoppingItem } from "../lib/appwrite";

export default function AddListScreen() {
  const router = useRouter();

  // State for the current input value
  const [itemName, setItemName] = useState("");

  // Items loaded from / saved to Appwrite
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

  // Loading states
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing items from Appwrite on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getItems();
        setShoppingItems(data);
      } catch (error) {
        Alert.alert("Error", "Failed to load items.");
        console.error(error);
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  // Save a new item to Appwrite and update the local list
  const handleAddItem = async () => {
    const trimmed = itemName.trim();
    if (!trimmed) return; // Ignore empty input
    setSaving(true);
    try {
      const newItem = await addItem(trimmed);
      setShoppingItems((prev) => [newItem, ...prev]);
      setItemName(""); // Clear input after saving
    } catch (error) {
      Alert.alert("Error", "Failed to save item.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Delete an item from Appwrite and remove it from the local list
  const handleRemoveItem = async (id: string) => {
    try {
      await deleteItem(id);
      setShoppingItems((prev) => prev.filter((item) => item.$id !== id));
    } catch (error) {
      Alert.alert("Error", "Failed to delete item.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Shopping List</Text>

      {/* Input row for adding a new item */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter item name..."
          value={itemName}
          onChangeText={setItemName}
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
          editable={!saving}
        />
        <TouchableOpacity
          style={[styles.addButton, saving && styles.addButtonDisabled]}
          onPress={handleAddItem}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Display the list of items saved in Appwrite */}
      {fetching ? (
        <ActivityIndicator
          size="large"
          color="#983b4e"
          style={{ marginTop: 30 }}
        />
      ) : shoppingItems.length === 0 ? (
        <Text style={styles.emptyText}>No items yet. Add one above!</Text>
      ) : (
        <FlatList
          data={shoppingItems}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleRemoveItem(item.$id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Back button to return to the home screen */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#983b4e",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
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
  backButton: {
    marginTop: 30,
    backgroundColor: "#ccc",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
