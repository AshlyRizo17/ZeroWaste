import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import emailjs from "emailjs-com"; // ✅ Usa la librería oficial

export default function ForgotPassword(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const handleSendEmail = async (): Promise<void> => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }

    try {
      // 🔹 Buscar usuario guardado en AsyncStorage
      const savedUser = await AsyncStorage.getItem("user");
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;

      if (!parsedUser || parsedUser.email !== email.trim()) {
        Alert.alert(
          "Usuario no encontrado",
          "No existe una cuenta registrada con este correo."
        );
        return;
      }

      // 🔹 Configura EmailJS
      const serviceID = "Brandon"; // Tu Service ID en EmailJS
      const templateID = "Brandon2"; // Tu Template ID en EmailJS
      const publicKey = "pQAc5c_yFtuRRFj1c"; // Tu Public Key

      // 🔹 Datos a enviar a la plantilla
      const templateParams = {
        to_email: email,
        to_name: parsedUser.name || "Usuario",
        user_password: parsedUser.password,
        reset_link: `https://mindnote.edu/ForgotPassword?email=${encodeURIComponent(
          email
        )}`,
      };

      // 🔹 Enviar correo usando el SDK de EmailJS
      await emailjs.send(serviceID, templateID, templateParams, publicKey);

      Alert.alert(
        "Correo enviado ✅",
        "Revisa tu bandeja de entrada para restablecer tu contraseña."
      );
      router.back();
    } catch (error) {
      console.error("Error al enviar correo:", error);
      Alert.alert(
        "Error",
        "Ocurrió un problema al enviar el correo. Intenta nuevamente."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>

      <Text style={styles.subtitle}>
        Ingresa tu correo electrónico y te enviaremos un enlace para
        restablecer tu contraseña.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
        <Text style={styles.buttonText}>Enviar correo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    width: "90%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: "#007AFF",
    fontWeight: "500",
  },
});
