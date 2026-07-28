//importar la navegacion que queremos que tenga
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#db2f2f",
        tabBarInactiveTintColor: "#6B7280",

        tabBarStyle: {
          height: 60,
          backgroundColor: "#fff",
        },

        tabBarLabelStyle: {
          fontSize: 13,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
            href: null,
        }}
      />

      <Tabs.Screen
        name="alta"
        options={{
          title: "alta",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="consulta"
        options={{
          title: "consulta",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}