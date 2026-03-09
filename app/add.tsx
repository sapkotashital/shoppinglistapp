import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "../components/Toast";
import { SubItem } from "../contexts/ListContext";
import { useLists } from "../hooks/useLists";

export default function AddScreen() {
  const router = useRouter();
  const { addItem } = useLists();

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [itemNotes, setItemNotes] = useState("");
  const [itemChecked, setItemChecked] = useState(false);
  const [itemNameError, setItemNameError] = useState("");
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [saving, setSaving] = useState(false);

  const handleAddSubItem = () => {
    const name = itemName.trim();
    if (!name) {
      setItemNameError("Item name is required.");
      return;
    }
    setItemNameError("");
    const qty = parseInt(itemQuantity, 10);
    setSubItems((prev) => [
      ...prev,
      {
        name,
        quantity: isNaN(qty) || qty < 1 ? 1 : qty,
        checked: itemChecked,
        notes: itemNotes.trim(),
      },
    ]);
    setItemName("");
    setItemQuantity("1");
    setItemChecked(false);
    setItemNotes("");
  };

  const handleRemoveSubItem = (index: number) => {
    setSubItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("List title is required.");
      return;
    }
    setTitleError("");
    setSaving(true);
    try {
      await addItem({ title: trimmedTitle, items: subItems });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionLabel}>List Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Weekly Groceries"
        value={title}
        onChangeText={setTitle}
        editable={!saving}
      />
      {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Add Items</Text>
      <View style={styles.subItemForm}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Milk"
          value={itemName}
          onChangeText={setItemName}
          editable={!saving}
        />
        {itemNameError ? (
          <Text style={styles.errorText}>{itemNameError}</Text>
        ) : null}

        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          value={itemQuantity}
          onChangeText={setItemQuantity}
          keyboardType="numeric"
          editable={!saving}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="e.g. Low fat if available"
          value={itemNotes}
          onChangeText={setItemNotes}
          multiline
          editable={!saving}
        />

        <View style={styles.checkedRow}>
          <Text style={styles.label}>Already checked?</Text>
          <Switch
            value={itemChecked}
            onValueChange={setItemChecked}
            trackColor={{ false: "#ccc", true: "#983b5c" }}
            disabled={saving}
          />
        </View>

        <TouchableOpacity
          style={styles.addSubItemButton}
          onPress={handleAddSubItem}
          disabled={saving}
        >
          <FontAwesome name="plus" size={14} color="#983b5c" />
          <Text style={styles.addSubItemText}>Add to List</Text>
        </TouchableOpacity>
      </View>

      {/* ── Sub-items preview ── */}
      {subItems.length > 0 && (
        <View style={styles.subItemsContainer}>
          <Text style={styles.sectionLabel}>
            Items Added ({subItems.length})
          </Text>
          {subItems.map((si, index) => (
            <View key={index} style={styles.subItemRow}>
              <View style={styles.subItemInfo}>
                <Text style={styles.subItemName}>{si.name}</Text>
                <Text style={styles.subItemMeta}>
                  Qty: {si.quantity}
                  {si.notes ? `  ·  ${si.notes}` : ""}
                  {si.checked ? "  ·  ✓ checked" : ""}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveSubItem(index)}>
                <FontAwesome name="trash" size={18} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save List</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={saving}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
  },
  notesInput: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 13,
    marginTop: -10,
    marginBottom: 12,
  },
  subItemForm: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  checkedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  addSubItemButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#983b5c",
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "center",
  },
  addSubItemText: {
    color: "#983b5c",
    fontWeight: "600",
    fontSize: 15,
  },
  subItemsContainer: {
    marginBottom: 24,
  },
  subItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
  },
  subItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  subItemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  subItemMeta: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: "#983b5c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
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
