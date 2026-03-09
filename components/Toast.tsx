import { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text } from "react-native";
import { useLists } from "../hooks/useLists";

export default function Toast() {
  const { toast, clearToast } = useLists();
  const opacity = useRef(new Animated.Value(0)).current;
  const nativeDriver = Platform.OS !== "web";

  useEffect(() => {
    if (!toast) return;

    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: nativeDriver,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: nativeDriver,
      }).start(() => clearToast());
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast, clearToast, opacity, nativeDriver]);

  if (!toast) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        toast.type === "success" ? styles.success : styles.error,
        { opacity },
      ]}
    >
      <Text style={styles.text}>{toast.text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    bottom: 36,
    left: 20,
    right: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    // boxShadow works on web; elevation is used on Android
    ...Platform.select({
      web: { boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)" },
      default: { elevation: 5 },
    }),
  },
  success: {
    backgroundColor: "#2ecc71",
  },
  error: {
    backgroundColor: "#e74c3c",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
