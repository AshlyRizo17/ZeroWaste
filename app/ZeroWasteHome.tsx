// App.tsx
import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  TextInput, // Nuevo: Para los campos de formulario
  ScrollView, // Nuevo: Para hacer el formulario deslizable
} from 'react-native';

// Nota: Reemplaza con 'react-native-maps' e importaciones reales si lo usas.
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; 

const { width } = Dimensions.get('window');

// --- 1. TIPOS DE DATOS ---

type RouteInfo = {
  distanceKm: number;
  durationMin: number;
  mode: 'walk' | 'bike' | 'car';
};

type RecyclingPoint = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'RecyclingCenter' | 'ZeroWasteStore' | 'CompostPoint' | 'Donation';
  accepts: string[];
  schedule: string;
};

type SidebarItemProps = {
  icon: string;
  label: string;
  badgeCount?: number;
  onPress: () => void;
};

type ScreenName = 'Recoleccion' | 'Solicitud' | 'Profile' | 'Progress' | 'Alerts' | 'Guide' | 'Logout';

// --- DATOS MOCK ---
const MOCK_POINT: RecyclingPoint = {
  id: 'P001',
  name: 'Centro de Acopio EcoBosa',
  latitude: 4.67,
  longitude: -74.08,
  type: 'RecyclingCenter',
  accepts: ['PET', 'Vidrio', 'Aluminio'],
  schedule: 'Lun-Sab 8am-5pm',
};

const MOCK_ROUTE: RouteInfo = { 
    distanceKm: 4.8, 
    durationMin: 22, 
    mode: 'bike' 
};

// --- 2. COMPONENTE PANEL LATERAL (AppSidebar) ---

interface AppSidebarProps {
  onNavigate: (screen: ScreenName) => void;
  currentScreen: ScreenName;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, badgeCount = 0, onPress }) => (
  <TouchableOpacity style={sidebarStyles.item} onPress={onPress}>
    <Text style={sidebarStyles.icon}>{icon}</Text>
    <Text style={sidebarStyles.label}>{label}</Text>
    {badgeCount > 0 && (
      <View style={sidebarStyles.badge}>
        <Text style={sidebarStyles.badgeText}>{badgeCount}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const AppSidebar: React.FC<AppSidebarProps> = ({ onNavigate, currentScreen }) => {
  return (
    <View style={sidebarStyles.container}>
      <Text style={sidebarStyles.header}>Panel Ciudadano</Text>
      
      <View style={sidebarStyles.menu}>
        <SidebarItem 
          icon="👤" 
          label="Mi Perfil" 
          onPress={() => onNavigate('Profile')} 
        />
        <SidebarItem 
          icon="🏆" 
          label="Mi Progreso" 
          onPress={() => onNavigate('Progress')} 
        />
        <SidebarItem 
          icon="⚠️" 
          label="Alertas y Novedades" 
          badgeCount={3} 
          onPress={() => onNavigate('Alerts')} 
        />
        <SidebarItem 
          icon="♻️" 
          label="Puntos de Recolección" 
          onPress={() => onNavigate('Recoleccion')} 
        />
        {/* NUEVO ITEM PARA SOLICITUD DE RECOLECCIÓN */}
        <SidebarItem 
          icon="📞" 
          label="Solicitar Recolección" 
          onPress={() => onNavigate('Solicitud')} 
        />
        <SidebarItem 
          icon="📚" 
          label="Guía de Separación" 
          onPress={() => onNavigate('Guide')} 
        />
      </View>

      <TouchableOpacity style={sidebarStyles.logoutButton} onPress={() => onNavigate('Logout')}>
        <Text style={sidebarStyles.logoutText}>➡️ Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- 3. COMPONENTE PANTALLA DE SOLICITUD DE RECOLECCIÓN ---

const RecoleccionSolicitudScreen: React.FC = () => {
  const [residuos, setResiduos] = useState('');
  const [fecha, setFecha] = useState('DD/MM/AAAA');
  const [solicitudees, setsolicitudees] = useState('');

  const handleSubmit = () => {
    console.log('Solicitud enviada:', { residuos, fecha, solicitudees });
    alert('✅ Solicitud de recolección enviada con éxito!');
  };

  return (
    <ScrollView style={solicitudStyles.container}>
      <View style={solicitudStyles.header}>
        <Text style={solicitudStyles.title}>📞 Solicitar Recolección Especial</Text>
        <Text style={solicitudStyles.subtitle}>
          Use este formulario para solicitar la recogida de residuos voluminosos o especiales.
        </Text>
      </View>

      <Text style={solicitudStyles.label}>Tipo y Cantidad de Residuos:</Text>
      <TextInput
        style={solicitudStyles.input}
        placeholder="Ej: 3 llantas viejas, 1 nevera dañada, 5kg de aceite usado."
        multiline
        numberOfLines={3}
        value={residuos}
        onChangeText={setResiduos}
      />

      <Text style={solicitudStyles.label}>Fecha Deseada (Estimada):</Text>
      <TextInput
        style={solicitudStyles.input}
        placeholder="Ej: 20/06/2026 (Usarías un DatePicker aquí)"
        value={fecha}
        onChangeText={setFecha}
      />

      <Text style={solicitudStyles.label}> Adicionales (Ubicación exacta, acceso):</Text>
      <TextInput
        style={solicitudStyles.input}
        placeholder="Ej: Dejar al lado del garaje. Hay un perro grande, avisar antes de llegar."
        multiline
        numberOfLines={3}
        value={solicitudees}
        onChangeText={setsolicitudees}
      />
      
      <View style={solicitudStyles.warningBox}>
          <Text style={solicitudStyles.warningText}>
              ⚠️ **Importante:** Este servicio está disponible para residuos no habituales (ej: escombros, electrónicos grandes, muebles). La confirmación del servicio depende de la disponibilidad municipal.
          </Text>
      </View>

      <TouchableOpacity style={solicitudStyles.submitButton} onPress={handleSubmit}>
        <Text style={solicitudStyles.submitButtonText}>Enviar Solicitud</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// --- 4. COMPONENTE PANTALLA DE MAPA (RecoleccionScreen) ---

const FilterInput: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={filterStyles.inputContainer}>
    <Text style={filterStyles.label}>{label}</Text>
    <View style={filterStyles.valueBox}>
      <Text style={filterStyles.valueText} numberOfLines={1}>{value}</Text>
    </View>
  </View>
);

const RecoleccionScreen: React.FC = () => {
  const [origin] = useState<string>('Mi Casa, Engativá, Bogotá');
  const [destination] = useState<RecyclingPoint | null>(MOCK_POINT);

  return (
    <View style={screenStyles.container}>
      
      {/* HEADER Y TÍTULO */}
      <View style={screenStyles.header}>
        <Text style={screenStyles.title}>♻️ Puntos de Recolección</Text>
        <Text style={screenStyles.subtitle}>
          Visualización de la ruta óptima y centros de acopio.
        </Text>
      </View>

      {/* BARRA DE FILTROS/BÚSQUEDA */}
      <View style={screenStyles.filterBar}>
        <FilterInput label="Origen" value={origin} />
        <FilterInput label="Destino" value={destination?.name || 'Seleccionar...'} />
        <TouchableOpacity style={screenStyles.optionsButton}>
          <Text style={screenStyles.optionsText}>Mis Opciones</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENEDOR DEL MAPA */}
      <View style={screenStyles.mapContainer}>
        {/* Placeholder para react-native-maps */}
        <Text style={screenStyles.mapPlaceholder}>
          [Aquí se renderizaría el MapView interactivo]
        </Text>
        
        {/* TARJETA DE RUTA FLOTANTE */}
        {destination && (
          <View style={screenStyles.routeCard}>
            <Text style={screenStyles.routeTime}>{MOCK_ROUTE.durationMin} min</Text>
            <Text style={screenStyles.routeDistance}>{MOCK_ROUTE.distanceKm} km</Text>
            <Text style={screenStyles.routeMode}>
              {MOCK_ROUTE.mode === 'walk' ? '🚶‍♀️' : MOCK_ROUTE.mode === 'bike' ? '🚲' : '🚗'}
            </Text>
          </View>
        )}
      </View>

      {/* FOOTER Y RESUMEN */}
      <View style={screenStyles.footer}>
        <Text style={screenStyles.summary}>
          **🟢 Origen:** {origin} | **📍 Destino Final:** {destination?.name || 'N/A'}
        </Text>
        <Text style={screenStyles.summary}>
          *Ruta estimada: {MOCK_ROUTE.durationMin} min ({MOCK_ROUTE.mode}). Acepta: {destination?.accepts.join(', ')}.*
        </Text>
        
        <View style={screenStyles.ecologicalNote}>
          <Text style={screenStyles.ecologicalText}>
            ℹ️ **Recordatorio Ecológico:** Lleva tus residuos limpios y secos.
          </Text>
        </View>
      </View>
    </View>
  );
};


// --- 5. COMPONENTE PRINCIPAL DE LA APP (Maneja el estado de la pantalla) ---

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Recoleccion');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Recoleccion':
        return <RecoleccionScreen />;
      case 'Solicitud':
        return <RecoleccionSolicitudScreen />;
      // Agrega más casos para 'Profile', 'Progress', etc.
      default:
        return <RecoleccionScreen />;
    }
  };

  return (
    <SafeAreaView style={appStyles.safeArea}>
      <View style={appStyles.appContainer}>
        {/* Sidebar (35% de la pantalla) */}
        <AppSidebar 
            onNavigate={setCurrentScreen} 
            currentScreen={currentScreen} 
        /> 
        
        {/* Pantalla Activa (65% de la pantalla) */}
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
};

export default App;

// --- 6. ESTILOS ---

const appStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  appContainer: {
    flex: 1,
    flexDirection: 'row', // Se mantiene el layout de escritorio/tablet
  },
});

// Estilos de la Pantalla de Solicitud (NUEVOS ESTILOS)
const solicitudStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white', padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#005500' },
    subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
    label: { fontSize: 14, fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#f9f9f9',
        minHeight: 40,
        textAlignVertical: 'top',
    },
    warningBox: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#fff3cd',
        borderColor: '#ffeeba',
        borderWidth: 1,
        borderRadius: 8,
    },
    warningText: {
        fontSize: 13,
        color: '#856404',
    },
    submitButton: {
        backgroundColor: '#005500',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40, // Espacio al final de la ScrollView
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

// Estilos del Sidebar (EXISTENTES)
const sidebarStyles = StyleSheet.create({
  container: { 
    width: Dimensions.get('window').width * 0.35, 
    backgroundColor: '#f0f0f0', 
    padding: 20, 
    borderRightWidth: 1, 
    borderColor: '#ccc',
  },
  header: { fontSize: 16, fontWeight: 'bold', marginBottom: 30, color: '#005500' },
  menu: { marginBottom: 40 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 5 },
  icon: { marginRight: 10, fontSize: 18 },
  label: { fontSize: 15, color: '#333' },
  badge: { 
    marginLeft: 'auto', 
    backgroundColor: 'red', 
    borderRadius: 10, 
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  logoutButton: { 
    position: 'absolute', 
    bottom: 20, 
    width: '90%', 
    left: 10, 
    padding: 10, 
    borderRadius: 5,
    backgroundColor: '#ffe6e6',
  },
  logoutText: { color: 'red', textAlign: 'center', fontWeight: '600' },
});

// Estilos de la Pantalla de Recolección (EXISTENTES)
const screenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#005500' },
  subtitle: { fontSize: 13, color: '#666', marginTop: 4 },
  
  filterBar: { 
    flexDirection: 'row', 
    padding: 15, 
    alignItems: 'flex-end', 
    backgroundColor: '#f9f9f9', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
  },
  optionsButton: { 
    padding: 8, 
    backgroundColor: '#e0f7e9', 
    borderRadius: 5, 
    height: 38,
    justifyContent: 'center',
  },
  optionsText: { fontSize: 13, color: '#005500', fontWeight: 'bold' },
  
  mapContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e0e0' },
  mapPlaceholder: { color: '#666', fontSize: 16 },
  
  routeCard: { 
    position: 'absolute', 
    top: 15, 
    left: 15, 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 8, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  routeTime: { fontSize: 18, fontWeight: 'bold', color: '#005500' },
  routeDistance: { fontSize: 12, color: '#999' },
  routeMode: { fontSize: 18, marginTop: 5 },

  footer: { padding: 15, borderTopWidth: 1, borderTopColor: '#eee' },
  summary: { fontSize: 13, marginBottom: 5, lineHeight: 18 },
  ecologicalNote: { marginTop: 10, padding: 10, backgroundColor: '#e6ffe6', borderRadius: 5 },
  ecologicalText: { fontSize: 12, color: 'green' },
});

// Estilos de los inputs de filtro (EXISTENTES)
const filterStyles = StyleSheet.create({
  inputContainer: { flex: 1, marginRight: 10 },
  label: { fontSize: 12, color: '#333', marginBottom: 2 },
  valueBox: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    padding: 8, 
    backgroundColor: 'white',
  },
  valueText: { fontSize: 14, color: '#000' },
});