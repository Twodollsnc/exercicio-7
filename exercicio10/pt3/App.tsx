import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function TelaCamera() {
  const [imagemUri, setImagemUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // PASSO 4 — Abre a câmera
  const abrirCamera = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      alert('Precisamos da permissão da câmera!');
      return;
    }

    setLoading(true);
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    setLoading(false);

    if (!resultado.canceled) {
      setImagemUri(resultado.assets[0].uri);
    }
  };

  // PASSO 5 — Abre a galeria
  const abrirGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      alert('Precisamos da permissão da galeria!');
      return;
    }

    setLoading(true);
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    setLoading(false);

    if (!resultado.canceled) {
      setImagemUri(resultado.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Foto de Perfil</Text>

      {/* PASSO 3 e 6 — Avatar circular */}
      <View style={styles.avatarWrapper}>
        {imagemUri ? (
          <Image source={{ uri: imagemUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarIcone}>👤</Text>
            <Text style={styles.avatarTexto}>Sem foto</Text>
          </View>
        )}
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#1976d2" style={{ marginBottom: 20 }} />
      )}

      {/* PASSO 3 — Dois botões */}
      <TouchableOpacity style={[styles.btn, styles.btnCamera]} onPress={abrirCamera}>
        <Text style={styles.btnTexto}>📷  Tirar Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.btnGaleria]} onPress={abrirGaleria}>
        <Text style={styles.btnTexto}>🖼️  Escolher da Galeria</Text>
      </TouchableOpacity>

      {imagemUri && (
        <TouchableOpacity onPress={() => setImagemUri(null)}>
          <Text style={styles.remover}>Remover foto</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// PASSO 1 — Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TelaCamera"
          component={TelaCamera}
          options={{ title: 'Meu Perfil' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, backgroundColor: 'white' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, marginTop: 10 },

  avatarWrapper: { marginBottom: 30 },
  avatar: { width: 200, height: 200, borderRadius: 100 },
  avatarPlaceholder: {
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarIcone: { fontSize: 60 },
  avatarTexto: { fontSize: 14, color: '#888', marginTop: 8 },

  btn: {
    width: '100%', paddingVertical: 14, borderRadius: 10,
    alignItems: 'center', marginBottom: 12,
  },
  btnCamera: { backgroundColor: '#1976d2' },
  btnGaleria: { backgroundColor: '#455a64' },
  btnTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  remover: { color: 'red', marginTop: 8, fontSize: 14 },
});