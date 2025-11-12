import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#45a049" },
        headerTintColor: "#236116ff",
        headerTitleAlign: "center",
      }}
    />
  );
}
