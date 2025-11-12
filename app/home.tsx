import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // ← Importa el gradiente
import RegisterScreen from "./register";
import LoginScreen from "./login";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#2d9cbe", "#aee4c5", "#45a049"]} // 💚 3 tonos verdes
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>Bienvenido a Zero Waste
        -Transformando Bogotá, un residuo a la vez</Text>
      <Text style={styles.subtitle}>Solicita tu recolección y sigue en tiempo real la ruta del camión.</Text>

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.navText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.navText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 50,
    color: "#0d0f70", // verde oscuro
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#160068ff", // verde oliva suave
    marginBottom: 30,
    textAlign: "center",
  },
  navContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  navButton: {
    backgroundColor: "#367738ff", // verde medio
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 8,
    width: "70%",
    alignItems: "center",
    elevation: 4,
  },
  navText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});
