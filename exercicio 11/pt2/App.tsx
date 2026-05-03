import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Simulação do cliente Supabase
const supabase = {
  auth: {
    signInWithPassword: ({ email, password }) =>
      new Promise((resolve) => {
        setTimeout(() => {
          if (email === 'teste@email.com' && password === '123456') {
            resolve({
              data: { user: { id: 'uuid-mock-123', email } },
              error: null,
            });
          } else {
            resolve({
              data: null,
              error: { message: 'Invalid login credentials' },
            });
          }
        }, 1200);
      }),
  },
};

function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erro de Login', error.message);
    } else {
      Alert.alert('Sucesso! ✅', `Bem-vindo de volta, ${data.user.email}!`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TaskApp</Text>
      <Text style={styles.subtitulo}>Faça login para continuar</Text>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.botao, loading && styles.botaoDisabled]}
          onPress={fazerLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.textoBotao}>Entrar</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.dica}>Use: teste@email.com / 123456</Text>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={TelaLogin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f0f4f8' },
  logo: { fontSize: 40, fontWeight: 'bold', color: '#1976d2', textAlign: 'center', marginBottom: 8 },
  subtitulo: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32 },
  card: {
    backgroundColor: 'white', padding: 24, borderRadius: 16, elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#ddd', padding: 14,
    marginBottom: 16, borderRadius: 8, fontSize: 16, backgroundColor: '#fafafa',
  },
  botao: { backgroundColor: '#1976d2', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  botaoDisabled: { backgroundColor: '#90caf9' },
  textoBotao: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  dica: { textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 16 },
});