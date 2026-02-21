import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "../components/Toast";
import { useLists } from "../hooks/useLists";

export default function DeleteScreen() {
  const router = useRouter();

  // Receive the item id and title passed via router.push params from index.tsx
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();

  // Access deleteItem from ListContext via the useLists hook
  const { deleteItem } = useLists();

  const [deleting, setDeleting] = useState(false);

  // Confirm deletion – calls deleteItem from ListContext then navigates back
  const handleConfirm = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteItem(id);
      router.back(); // Return to the home screen after deleting
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Delete Item</Text>

      {/* Show the item name that is about to be deleted */}
      <Text style={styles.message}>
        Are you sure you want to delete{" "}
        <Text style={styles.itemName}>{title}</Text>?
      </Text>
      <Text style={styles.subMessage}>This action cannot be undone.</Text>

      {/* Confirm deletion – calls deleteItem from ListContext */}
      <TouchableOpacity
        style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
        onPress={handleConfirm}
        disabled={deleting}
      >
        {deleting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.deleteButtonText}>Yes, Delete</Text>
        )}
      </TouchableOpacity>

      {/* Go back without deleting */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={deleting}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      {/* Floating toast for success / error feedback */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 8,
  },
  itemName: {
    fontWeight: "bold",
    color: "#983b5c",
  },
  subMessage: {
    fontSize: 14,
    textAlign: "center",
    color: "#999",
    marginBottom: 32,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#eee",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#555",
  },
});
