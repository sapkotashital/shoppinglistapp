import { Stack } from "expo-router";
import { ListProvider } from "../contexts/ListContext";

/**
 * Root layout – wraps every screen in ListProvider so that
 * useLists() works from index.tsx, add.tsx, and delete.tsx.
 */
export default function RootLayout() {
  return (
    <ListProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Shopping List" }} />
        <Stack.Screen name="add" options={{ title: "Add Item" }} />
        <Stack.Screen name="delete" options={{ title: "Delete Item" }} />
      </Stack>
    </ListProvider>
  );
}
