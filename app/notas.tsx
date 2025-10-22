import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function NotasScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const savedUser = await AsyncStorage.getItem("user");
      const savedNotes = await AsyncStorage.getItem("notes");
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    };
    loadData();
  }, []);

  const saveNotes = async (newNotes: any[]) => {
    setNotes(newNotes);
    await AsyncStorage.setItem("notes", JSON.stringify(newNotes));
  };

  const handleAddNote = () => {
    if (!note.trim()) {
      Alert.alert("Error", "La nota no puede estar vacía");
      return;
    }

    if (date < new Date()) {
      Alert.alert("Error", "No puedes agendar notas en fechas pasadas");
      return;
    }

    const exists = notes.some(
      (n) => new Date(n.date).getTime() === date.getTime()
    );
    if (exists && editingIndex === null) {
      Alert.alert("Error", "Ya existe una nota agendada para esa fecha y hora");
      return;
    }

    let updatedNotes;
    if (editingIndex !== null) {
      updatedNotes = notes.map((n, i) =>
        i === editingIndex ? { text: note, date } : n
      );
      setEditingIndex(null);
    } else {
      updatedNotes = [...notes, { text: note, date }];
    }

    saveNotes(updatedNotes);
    setNote("");
    setDate(new Date());
  };

  const handleDeleteNote = (index: number) => {
    Alert.alert("Confirmar", "¿Deseas eliminar esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          const updatedNotes = notes.filter((_, i) => i !== index);
          saveNotes(updatedNotes);
        },
      },
    ]);
  };

  const handleEditNote = (index: number) => {
    const n = notes[index];
    setNote(n.text);
    setDate(new Date(n.date));
    setEditingIndex(index);
  };

  const renderItem = ({ item, index }: any) => {
    const noteDate = new Date(item.date);
    const formattedDate = noteDate.toLocaleString("es-ES", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });

    return (
      <View style={styles.noteCard}>
        <View style={styles.noteHeader}>
          <Text style={styles.noteDate}>{formattedDate}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleEditNote(index)}>
              <Text style={styles.actionEdit}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteNote(index)}>
              <Text style={styles.actionDelete}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.noteText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>🗒️ Mis Notas</Text>
      {user && <Text style={styles.subtitle}>Hola, {user.name} 👋</Text>}

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu nota..."
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateButtonText}>📅 {date.toLocaleString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNote}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>
            {editingIndex !== null ? "💾 Guardar Cambios" : "➕ Agregar Nota"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        style={{ marginTop: 20 }}
      />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/home")}
      >
        <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F8",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E1E1E",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    color: "#555",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#E8EAF6",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  dateButtonText: {
    color: "#3949AB",
    fontSize: 16,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noteCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteDate: {
    fontSize: 14,
    color: "#757575",
  },
  noteText: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  actions: {
    flexDirection: "row",
    gap: 15,
  },
  actionEdit: {
    fontSize: 20,
  },
  actionDelete: {
    fontSize: 20,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
