import { useContext } from "react";
import { ListContext } from "../contexts/ListContext";

export const useLists = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useLists must be used within a ListProvider");
  }
  return context;
};
