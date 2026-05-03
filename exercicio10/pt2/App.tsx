import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, ActivityIndicator,
  StyleSheet, TouchableOpacity
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const supabase = createClient(
  '',  
  ''                
);

function TelaLista() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarProdutos();
  }, []);


  const buscarProdutos = async () => {
    try {
      setLoading(true);
      setErro('');

      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setProdutos(data);
    } catch (err) {
      setErro('Erro ao buscar produtos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🛒 Produtos</Text>
      <Text style={styles.subtitulo}>Dados carregados do Supabase</Text>

      {erro ? (
        <View style={styles.erroBox}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.btnRetry} onPress={buscarProdutos}>
            <Text style={styles.btnRetryTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingTexto}>Buscando produtos...</Text>
        </View>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={item => item.id.toString()}
          onRefresh={buscarProdutos}
          refreshing={loading}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardNome}>{item.nome}</Text>
                <Text style={styles.cardId}>ID: {item.id}</Text>
              </View>
              <View style={styles.precoBox}>
                <Text style={styles.cardPreco}>
                  R$ {parseFloat(item.preco).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Lista"
          component={TelaLista}
          options={{ title: 'Produtos' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 2 },
  subtitulo: { fontSize: 13, color: '#888', marginBottom: 20 },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingTexto: { color: '#555', fontSize: 15 },

  erroBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  erroTexto: { color: 'red', textAlign: 'center', fontSize: 14 },
  btnRetry: { backgroundColor: '#1976d2', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  btnRetryTexto: { color: 'white', fontWeight: 'bold' },

  vazio: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },

  card: {
    backgroundColor: 'white', padding: 15, marginBottom: 10,
    borderRadius: 10, elevation: 2,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  cardId: { fontSize: 12, color: '#aaa' },
  precoBox: { backgroundColor: '#e3f2fd', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  cardPreco: { fontSize: 16, fontWeight: 'bold', color: '#1976d2' },
});