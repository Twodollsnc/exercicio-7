import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Mock do Supabase com onAuthStateChange
let _listener = null;
let _sessaoAtual = null;

const supabase = {
  auth: {
    getSession: () =>
      Promise.resolve({ data: { session: _sessaoAtual } }),

    signInWithPassword: ({ email, password }) =>
      new Promise((resolve) => {
        setTimeout(() => {
          if (email === 'teste@email.com' && password === '123456') {
            const session = { user: { id: 'uuid-123', email } };
            _sessaoAtual = session;
            if (_listener) _listener('SIGNED_IN', session);
            resolve({ data: { session }, error: null });
          } else {
            resolve({ data: null, error: { message: 'Invalid login credentials' } });
          }
        }, 1200);
      }),

    signOut: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          _sessaoAtual = null;
          if (_listener) _listener('SIGNED_OUT', null);
          resolve({ error: null });
        }, 800);
      }),

    onAuthStateChange: (callback) => {
      _listener = callback;
      return { data: { subscription: { unsubscribe: () => { _listener = null; } } } };
    },
  },
};

const Stack = createNativeStackNavigator();

// --- TELA LOGIN ---
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setLoading(false);
    if (error) Alert.alert('Erro de Login', error.message);
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.logo}>TaskApp</Text>
      <Text style={styles.loginSub}>Faça login para continuar</Text>

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
          style={[styles.botaoLogin, loading && styles.botaoDisabled]}
          onPress={fazerLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={styles.botaoTexto}>Entrar</Text>
          }
        </TouchableOpacity>

        <Text style={styles.dica}>Use: teste@email.com / 123456</Text>
      </View>
    </View>
  );
}

// --- TELA HOME (PROTEGIDA) ---
function TelaHome({ sessao }) {
  const [saindo, setSaindo] = useState(false);

  const fazerLogout = async () => {
    setSaindo(true);
    await supabase.auth.signOut();
    setSaindo(false);
  };

  return (
    <View style={styles.homeContainer}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarLetra}>
          {sessao.user.email[0].toUpperCase()}
        </Text>
      </View>

      <Text style={styles.homeBoasVindas}>Bem-vindo de volta!</Text>

      {/* PASSO 3 — Email do usuário logado */}
      <View style={styles.emailBox}>
        <Text style={styles.emailLabel}>Logado como</Text>
        <Text style={styles.emailValor}>{sessao.user.email}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTexto}>
          Rota protegida — só acessível com sessão ativa.
        </Text>
      </View>

      {/* PASSO 4 — Botão Logout vermelho */}
      <TouchableOpacity
        style={[styles.botaoLogout, saindo && styles.botaoDisabled]}
        onPress={fazerLogout}
        disabled={saindo}
      >
        {saindo
          ? <ActivityIndicator color="white" />
          : <Text style={styles.botaoTexto}>Sair (Logout)</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

// --- APP PRINCIPAL ---
export default function App() {
  const [sessao, setSessao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // 1. Verifica sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
      setCarregando(false);
    });

    // 2. Escuta mudanças de login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSessao(session)
    );

    return () => subscription.unsubscribe();
  }, []);

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* PASSO 2 — Auth Flow: if/else no navegador */}
        {sessao?.user ? (
          <Stack.Screen name="Home">
            {() => <TelaHome sessao={sessao} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={TelaLogin} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Login
  loginContainer: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f0f4f8' },
  logo: { fontSize: 40, fontWeight: 'bold', color: '#1976d2', textAlign: 'center', marginBottom: 8 },
  loginSub: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32 },
  card: {
    backgroundColor: 'white', padding: 24, borderRadius: 16, elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#ddd', padding: 14,
    marginBottom: 16, borderRadius: 8, fontSize: 16, backgroundColor: '#fafafa',
  },
  botaoLogin: { backgroundColor: '#1976d2', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  botaoDisabled: { opacity: 0.6 },
  botaoTexto: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  dica: { textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 16 },

  // Home
  homeContainer: { flex: 1, padding: 28, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#1976d2', justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  avatarLetra: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  homeBoasVindas: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 20 },
  emailBox: {
    backgroundColor: 'white', width: '100%', padding: 16,
    borderRadius: 12, alignItems: 'center', marginBottom: 12,
    elevation: 2,
  },
  emailLabel: { fontSize: 12, color: '#aaa', marginBottom: 4 },
  emailValor: { fontSize: 16, fontWeight: '600', color: '#1976d2' },
  infoBox: {
    backgroundColor: '#e3f2fd', width: '100%', padding: 14,
    borderRadius: 10, marginBottom: 32,
  },
  infoTexto: { fontSize: 13, color: '#1565c0', textAlign: 'center' },
  botaoLogout: {
    backgroundColor: '#d32f2f', width: '100%',
    padding: 15, borderRadius: 10, alignItems: 'center',
  },
});