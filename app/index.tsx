import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "../components/Toast";
import { useLists } from "../hooks/useLists";

export default function HomeScreen() {
  const router = useRouter();

  // Consume items, fetchItems and deleteItem from ListContext via the useLists hook
  const { items, loading, fetchItems } = useLists();

  // Re-fetch every time this screen comes into focus (e.g. after adding or deleting)
  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [fetchItems]),
  );

  return (
    <View style={styles.container}>
      {/* ── Top section: title, description & Add button ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List App</Text>
        <Text style={styles.description}>
          Welcome to the Shopping List App! Create and manage your shopping
          lists below.
        </Text>

        {/* Navigates to the dedicated Add screen (app/add.tsx) */}
        <FontAwesome.Button
          name="plus"
          backgroundColor="#983b5c"
          onPress={() => router.push("/add")}
          style={styles.addButton}
        >
          Add Item
        </FontAwesome.Button>
      </View>

      {/* ── Bottom section: list of all items from Appwrite ── */}
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#983b5c"
            style={{ marginTop: 30 }}
          />
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
                <Text style={styles.listItemText}>{item.title}</Text>

                {/* Navigates to the dedicated Delete screen (app/delete.tsx) */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/delete",
                      params: { id: item.$id, title: item.title },
                    })
                  }
                >
                  <Text style={styles.removeText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* Floating toast for success / error feedback */}
      <Toast />
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
