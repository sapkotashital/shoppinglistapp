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
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const { deleteItem } = useLists();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteItem(id);
      router.back();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Delete List</Text>
      <Text style={styles.message}>
        Are you sure you want to delete{" "}
        <Text style={styles.itemName}>{title}</Text>?
      </Text>
      <Text style={styles.subMessage}>This action cannot be undone.</Text>

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

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={deleting}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

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
