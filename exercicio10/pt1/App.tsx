import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function TelaComparativo() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.tituloPagina}>Bancos de Dados na Nuvem</Text>
      <Text style={styles.subtitulo}>Do local para a nuvem — qual escolher?</Text>

      {/* PASSO 3 — Card Supabase */}
      <View style={[styles.card, styles.cardSupabase]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcone}>🟢</Text>
          <Text style={[styles.cardTitulo, { color: '#1a7f4b' }]}>Supabase</Text>
        </View>
        <Text style={styles.cardTag}>SQL · PostgreSQL · Relacional</Text>

        <View style={styles.lista}>
          <View style={styles.item}>
            <Text style={styles.iconeItem}>🗃️</Text>
            <Text style={styles.textoItem}>Usa <Text style={styles.bold}>PostgreSQL</Text> — dados organizados em tabelas com linhas e colunas</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.iconeItem}>⚡</Text>
            <Text style={styles.textoItem}>API REST e <Text style={styles.bold}>Realtime</Text> prontas — sem precisar criar um backend</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.iconeItem}>👤</Text>
            <Text style={styles.textoItem}>Ideal para <Text style={styles.bold}>usuários, produtos e pedidos</Text> — dados estruturados e relacionados</Text>
          </View>
        </View>
      </View>

      {/* PASSO 4 — Card MongoDB Atlas */}
      <View style={[styles.card, styles.cardMongo]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcone}>🍃</Text>
          <Text style={[styles.cardTitulo, { color: '#1a5276' }]}>MongoDB Atlas</Text>
        </View>
        <Text style={styles.cardTag}>NoSQL · Documentos JSON · Flexível</Text>

        <View style={styles.lista}>
          <View style={styles.item}>
            <Text style={styles.iconeItem}>📄</Text>
            <Text style={styles.textoItem}>Salva dados como <Text style={styles.bold}>documentos JSON</Text> — sem esquema fixo ou tabelas rígidas</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.iconeItem}>📍</Text>
            <Text style={styles.textoItem}>Perfeito para <Text style={styles.bold}>logs de GPS, chats e configs variadas</Text> — dados não estruturados</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.iconeItem}>📈</Text>
            <Text style={styles.textoItem}><Text style={styles.bold}>Escala horizontalmente</Text> com facilidade — ótimo para grandes volumes de dados</Text>
          </View>
        </View>
      </View>

      {/* Rodapé comparativo */}
      <View style={styles.rodape}>
        <Text style={styles.rodapeTexto}>💡 Regra geral: dados relacionados → <Text style={styles.bold}>Supabase</Text>. Dados flexíveis → <Text style={styles.bold}>MongoDB</Text>.</Text>
      </View>
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TelaComparativo"
          component={TelaComparativo}
          options={{ title: 'Comparativo de Bancos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f0f2f5', flexGrow: 1 },
  tituloPagina: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitulo: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 24 },

  card: {
    backgroundColor: 'white', borderRadius: 12, padding: 20,
    marginBottom: 20, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6,
  },
  cardSupabase: { borderLeftWidth: 5, borderLeftColor: '#1a7f4b' },
  cardMongo: { borderLeftWidth: 5, borderLeftColor: '#1a5276' },

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardIcone: { fontSize: 22, marginRight: 8 },
  cardTitulo: { fontSize: 22, fontWeight: 'bold' },
  cardTag: { fontSize: 12, color: '#aaa', marginBottom: 16, marginLeft: 2 },

  lista: { gap: 12 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  iconeItem: { fontSize: 18, marginTop: 1 },
  textoItem: { fontSize: 14, color: '#444', flex: 1, lineHeight: 20 },
  bold: { fontWeight: 'bold', color: '#222' },

  rodape: {
    backgroundColor: '#fff8e1', borderRadius: 8, padding: 14,
    borderLeftWidth: 4, borderLeftColor: '#f4c430',
  },
  rodapeTexto: { fontSize: 13, color: '#555', lineHeight: 20 },
});