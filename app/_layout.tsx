import { Stack } from "expo-router";
import { ListProvider } from "../contexts/ListContext";

export default function RootLayout() {
  return (
    <ListProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Shopping List" }} />
        <Stack.Screen name="add" options={{ title: "Add List" }} />
        <Stack.Screen name="delete" options={{ title: "Delete List" }} />
      </Stack>
    </ListProvider>
  );
}
