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
import Toast from "../components/Toast";
import { ShoppingItem } from "../contexts/ListContext";
import { useLists } from "../hooks/useLists";

function ListCard({
  item,
  onDelete,
  onToggle,
}: {
  item: ShoppingItem;
  onDelete: () => void;
  onToggle: (itemIndex: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeaderLeft}>
          <FontAwesome
            name={expanded ? "chevron-up" : "chevron-down"}
            size={12}
            color="#983b5c"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <View style={styles.cardHeaderRight}>
          <Text style={styles.itemCount}>
            {item.items.length} item{item.items.length !== 1 ? "s" : ""}
          </Text>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <FontAwesome name="trash" size={16} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.subItemsWrapper}>
          {item.items.length === 0 ? (
            <Text style={styles.noSubItems}>No items in this list.</Text>
          ) : (
            item.items.map((si, index) => (
              <TouchableOpacity
                key={index}
                style={styles.subItemRow}
                onPress={() => onToggle(index)}
                activeOpacity={0.6}
              >
                <FontAwesome
                  name={si.checked ? "check-square-o" : "square-o"}
                  size={18}
                  color={si.checked ? "#27ae60" : "#aaa"}
                  style={{ marginRight: 10 }}
                />
                <View style={styles.subItemInfo}>
                  <Text
                    style={[
                      styles.subItemName,
                      si.checked && styles.subItemChecked,
                    ]}
                  >
                    {si.name}
                  </Text>
                  <Text style={styles.subItemMeta}>
                    Qty: {si.quantity}
                    {si.notes ? `  ·  ${si.notes}` : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { items, loading, fetchItems, toggleSubItem } = useLists();

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [fetchItems]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List App</Text>
        <Text style={styles.description}>
          Welcome to the Shopping List App! Create and manage your shopping
          lists below.
        </Text>
        <FontAwesome.Button
          name="plus"
          backgroundColor="#983b5c"
          onPress={() => router.push("/add")}
          style={styles.addButton}
        >
          Add List
        </FontAwesome.Button>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#983b5c"
            style={{ marginTop: 30 }}
          />
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>
            {'No lists yet. Tap "Add List" to get started!'}
          </Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ListCard
                item={item}
                onDelete={() =>
                  router.push({
                    pathname: "/delete",
                    params: { id: item._id, title: item.title },
                  })
                }
                onToggle={(itemIndex) => toggleSubItem(item._id, itemIndex)}
              />
            )}
          />
        )}
      </View>

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
  listContainer: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 30,
  },
  card: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#fafafa",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    flexShrink: 1,
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemCount: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    padding: 4,
  },
  subItemsWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  noSubItems: {
    fontSize: 14,
    color: "#aaa",
    paddingVertical: 4,
  },
  subItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  subItemInfo: {
    flex: 1,
  },
  subItemName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  subItemChecked: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  subItemMeta: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
