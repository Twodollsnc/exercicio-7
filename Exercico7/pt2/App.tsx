import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, FlatList,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function ListaCompras() {
  const [texto, setTexto] = useState('');
  const [itens, setItens] = useState([]);

  // PASSO 6 — Carrega a lista do disco ao abrir o app
  useEffect(() => {
    carregarItens();
  }, []);

  const carregarItens = async () => {
    const salvo = await AsyncStorage.getItem('@lista_compras');
    if (salvo) setItens(JSON.parse(salvo)); // Texto -> Array
  };

  // PASSO 2 e 3 — Adiciona item e salva no AsyncStorage
  const adicionarItem = async () => {
    if (texto.trim() === '') {
      Alert.alert('Atenção', 'Digite um item antes de adicionar.');
      return;
    }
    const novoItem = { id: Date.now().toString(), nome: texto.trim() };
    const novaLista = [...itens, novoItem]; // Array antigo + novo item

    setItens(novaLista);
    setTexto('');
    await AsyncStorage.setItem('@lista_compras', JSON.stringify(novaLista)); // Array -> Texto
  };

  // PASSO 5 — Remove item com .filter() e salva nova lista
  const removerItem = async (id) => {
    const novaLista = itens.filter(item => item.id !== id);
    setItens(novaLista);
    await AsyncStorage.setItem('@lista_compras', JSON.stringify(novaLista));
  };

  // PASSO 4 — Renderiza a lista com FlatList
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={texto}
          onChangeText={setTexto}
          placeholder="Ex: Maçã, Pão, Leite..."
        />
        <Button title="Adicionar" onPress={adicionarItem} />
      </View>

      {itens.length === 0 && (
        <Text style={styles.vazio}>Sua lista está vazia. Adicione itens acima!</Text>
      )}

      <FlatList
        data={itens}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.textoCard}>🛒 {item.nome}</Text>
            <TouchableOpacity onPress={() => removerItem(item.id)}>
              <Text style={styles.btnRemover}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// PASSO 1 — Stack Navigator com a tela ListaCompras
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ListaCompras"
          component={ListaCompras}
          options={{ title: '🛒 Lista de Compras' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  inputContainer: { flexDirection: 'row', marginBottom: 20, gap: 8 },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#ccc',
    padding: 10, borderRadius: 5, backgroundColor: 'white',
  },
  vazio: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
  card: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'white', padding: 15, marginBottom: 10,
    borderRadius: 5, elevation: 2,
  },
  textoCard: { fontSize: 16, flex: 1 },
  btnRemover: { fontSize: 18, color: 'red', paddingHorizontal: 8 },
});