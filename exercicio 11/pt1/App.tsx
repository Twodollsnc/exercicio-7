import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// PASSO 2 — Tela InfoAuth
function InfoAuth() {
  const passos = [
    {
      numero: '1',
      titulo: 'Usuário envia as credenciais',
      sub: 'Login / senha para o servidor',
      descricao: 'O usuário preenche email e senha. O app faz uma requisição POST para o endpoint de autenticação do Supabase. As credenciais viajam de forma segura via HTTPS.',
      cor: '#185FA5',
      fundo: '#E6F1FB',
    },
    {
      numero: '2',
      titulo: 'Servidor valida e devolve o token',
      sub: 'Geração do JWT assinado',
      descricao: 'O Supabase verifica as credenciais no banco. Se corretas, gera um JWT — um token assinado digitalmente com header, payload e signature. Esse token tem prazo de expiração e é salvo localmente no app.',
      cor: '#0F6E56',
      fundo: '#E1F5EE',
    },
    {
      numero: '3',
      titulo: 'Token autentica as próximas chamadas',
      sub: 'Acesso a rotas protegidas',
      descricao: 'A cada requisição seguinte, o app envia o token no cabeçalho: Authorization: Bearer <token>. O servidor valida a assinatura e libera (ou nega) o acesso sem precisar consultar o banco novamente.',
      cor: '#534AB7',
      fundo: '#EEEDFE',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Autenticação com JWT</Text>
      <Text style={styles.subtitulo}>
        Entenda o fluxo completo — do login até o acesso protegido.
      </Text>

      {/* PASSO 3 — Cards dos 3 passos */}
      {passos.map((passo, index) => (
        <View key={passo.numero}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: passo.fundo }]}>
                <Text style={[styles.badgeTexto, { color: passo.cor }]}>
                  {passo.numero}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitulo}>{passo.titulo}</Text>
                <Text style={styles.cardSub}>{passo.sub}</Text>
              </View>
            </View>
            <Text style={styles.cardDescricao}>{passo.descricao}</Text>
          </View>

          {index < passos.length - 1 && (
            <Text style={styles.seta}>↓</Text>
          )}
        </View>
      ))}

      {/* PASSO 4 — Rodapé Supabase */}
      <View style={styles.rodape}>
        <View style={styles.rodapeIcone}>
          <View style={styles.rodapePonto} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rodapeTitulo}>Supabase Auth</Text>
          <Text style={styles.rodapeTexto}>
            O Supabase já implementa todo esse fluxo automaticamente. Basta
            chamar{' '}
            <Text style={styles.codigo}>
              supabase.auth.signInWithPassword()
            </Text>{' '}
            e o SDK cuida dos tokens, refresh e sessão persistente.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// PASSO 1 — Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="InfoAuth"
          component={InfoAuth}
          options={{ title: 'Como funciona o login' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f0f2f5', flexGrow: 1 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  subtitulo: { fontSize: 14, color: '#888', marginBottom: 24, lineHeight: 20 },

  card: {
    backgroundColor: 'white', borderRadius: 14, padding: 20,
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  badge: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeTexto: { fontSize: 16, fontWeight: 'bold' },
  cardTitulo: { fontSize: 15, fontWeight: '600', color: '#111' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },
  cardDescricao: { fontSize: 14, color: '#555', lineHeight: 22 },

  seta: { textAlign: 'center', fontSize: 20, color: '#bbb', marginVertical: 6 },

  rodape: {
    backgroundColor: 'white', borderRadius: 14, padding: 16,
    marginTop: 8, flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    elevation: 2,
  },
  rodapeIcone: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: '#E1F5EE',
    justifyContent: 'center', alignItems: 'center',
  },
  rodapePonto: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1D9E75' },
  rodapeTitulo: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 4 },
  rodapeTexto: { fontSize: 13, color: '#666', lineHeight: 20 },
  codigo: { fontFamily: 'monospace', fontSize: 12, color: '#185FA5' },
});