import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ─── MOCK SUPABASE ───────────────────────────────────────────────
// Dois usuários com tarefas isoladas (simula RLS)
const DB = {
  usuarios: [
    { id: 'uid-001', email: 'joao@email.com',  password: '123456' },
    { id: 'uid-002', email: 'maria@email.com', password: '123456' },
  ],
  tarefas: [
    { id: 1, titulo: 'Comprar pão',       user_id: 'uid-001', concluida: false },
    { id: 2, titulo: 'Estudar React Native', user_id: 'uid-001', concluida: false },
    { id: 3, titulo: 'Academia',          user_id: 'uid-002', concluida: false },
  ],
  proximoId: 4,
};

let _listener = null;
let _sessaoAtual = null;

const supabase = {
  auth: {
    getSession: () =>
      Promise.resolve({ data: { session: _sessaoAtual } }),

    getUser: () =>
      Promise.resolve({ data: { user: _sessaoAtual?.user ?? null } }),

    signInWithPassword: ({ email, password }) =>
      new Promise((resolve) => {
        setTimeout(() => {
          const usuario = DB.usuarios.find(
            u => u.email === email && u.password === password
          );
          if (usuario) {
            const session = { user: { id: usuario.id, email: usuario.email } };
            _sessaoAtual = session;
            if (_listener) _listener('SIGNED_IN', session);
            resolve({ data: { session }, error: null });
          } else {
            resolve({ data: null, error: { message: 'Invalid login credentials' } });
          }
        }, 1000);
      }),

    signOut: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          _sessaoAtual = null;
          if (_listener) _listener('SIGNED_OUT', null);
          resolve({ error: null });
        }, 600);
      }),

    onAuthStateChange: (callback) => {
      _listener = callback;
      return { data: { subscription: { unsubscribe: () => { _listener = null; } } } };
    },
  },

  from: (tabela) => ({
    select: () => ({
      order: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            const userId = _sessaoAtual?.user?.id;
            // RLS: filtra só as tarefas do usuário logado
            const dados = DB[tabela].filter(t => t.user_id === userId)
              .sort((a, b) => b.id - a.id);
            resolve({ data: dados, error: null });
          }, 600);
        }),
    }),

    insert: (itens) =>
      new Promise((resolve) => {
        setTimeout(() => {
          itens.forEach(item => {
            DB[tabela].push({ ...item, id: DB.proximoId++ });
          });
          resolve({ error: null });
        }, 600);
      }),

    delete: () => ({
      eq: (campo, valor) =>
        new Promise((resolve) => {
          setTimeout(() => {
            const userId = _sessaoAtual?.user?.id;
            // RLS: só deleta se for do usuário logado
            DB[tabela] = DB[tabela].filter(
              t => !(t[campo] === valor && t.user_id === userId)
            );
            resolve({ error: null });
          }, 400);
        }),
    }),
  }),
};
// ─────────────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator();

// --- TELA LOGIN ---
function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const fazerLogin = async () => {
    if (!email || !senha) { Alert.alert('Erro', 'Preencha todos os campos!'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);
    if (error) Alert.alert('Erro', error.message);
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.logo}>TaskApp</Text>
      <Text style={styles.loginSub}>Faça login para continuar</Text>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input} value={email} onChangeText={setEmail}
          placeholder="seu@email.com" autoCapitalize="none" keyboardType="email-address"
        />
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input} value={senha} onChangeText={setSenha}
          placeholder="Sua senha" secureTextEntry
        />
        <TouchableOpacity
          style={[styles.botaoLogin, loading && styles.botaoDisabled]}
          onPress={fazerLogin} disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={styles.botaoTexto}>Entrar</Text>}
        </TouchableOpacity>

        <View style={styles.dicaBox}>
          <Text style={styles.dicaTitulo}>Contas de teste (RLS ativo):</Text>
          <Text style={styles.dica}>joao@email.com  / 123456</Text>
          <Text style={styles.dica}>maria@email.com / 123456</Text>
        </View>
      </View>
    </View>
  );
}

// --- TELA TAREFAS (PROTEGIDA) ---
function TelaTarefas({ sessao }) {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [loading, setLoading] = useState(true);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => { buscarTarefas(); }, []);

  const buscarTarefas = async () => {
    setLoading(true);
    const { data } = await supabase.from('tarefas').select('*').order('id');
    if (data) setTarefas(data);
    setLoading(false);
  };

  const adicionarTarefa = async () => {
    if (!novaTarefa.trim()) return;
    await supabase.from('tarefas').insert([{
      titulo: novaTarefa.trim(),
      user_id: sessao.user.id,
      concluida: false,
    }]);
    setNovaTarefa('');
    buscarTarefas();
  };

  const deletarTarefa = async (id) => {
    await supabase.from('tarefas').delete().eq('id', id);
    buscarTarefas();
  };

  const fazerLogout = async () => {
    setSaindo(true);
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.tarefasContainer}>
      <View style={styles.tarefasHeader}>
        <View>
          <Text style={styles.tarefasTitulo}>Minhas Tarefas</Text>
          <Text style={styles.tarefasEmail}>{sessao.user.email}</Text>
        </View>
        <TouchableOpacity
          style={[styles.botaoLogout, saindo && styles.botaoDisabled]}
          onPress={fazerLogout} disabled={saindo}
        >
          {saindo
            ? <ActivityIndicator color="white" size="small" />
            : <Text style={styles.botaoLogoutTexto}>Sair</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputTarefa} value={novaTarefa}
          onChangeText={setNovaTarefa} placeholder="O que precisa ser feito?"
          onSubmitEditing={adicionarTarefa}
        />
        <TouchableOpacity style={styles.botaoAdd} onPress={adicionarTarefa}>
          <Text style={styles.botaoAddTexto}>+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhuma tarefa ainda. Adicione uma acima!</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.tarefaCard}>
              <Text style={styles.tarefaTexto}>{item.titulo}</Text>
              <TouchableOpacity
                style={styles.botaoDeletar}
                onPress={() => deletarTarefa(item.id)}
              >
                <Text style={styles.botaoDeletarTexto}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.rlsBadge}>
        <Text style={styles.rlsTexto}>RLS ativo — apenas suas tarefas são visíveis</Text>
      </View>
    </View>
  );
}

// --- APP PRINCIPAL ---
export default function App() {
  const [sessao, setSessao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
      setCarregando(false);
    });

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
        {sessao?.user ? (
          <Stack.Screen name="Tarefas">
            {() => <TelaTarefas sessao={sessao} />}
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
  dicaBox: { marginTop: 20, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 },
  dicaTitulo: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 4 },
  dica: { fontSize: 12, color: '#888', marginTop: 2 },

  // Tarefas
  tarefasContainer: { flex: 1, backgroundColor: '#f0f4f8', padding: 20 },
  tarefasHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20, marginTop: 10,
  },
  tarefasTitulo: { fontSize: 22, fontWeight: 'bold', color: '#111' },
  tarefasEmail: { fontSize: 13, color: '#888', marginTop: 2 },
  botaoLogout: { backgroundColor: '#d32f2f', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  botaoLogoutTexto: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  inputContainer: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  inputTarefa: {
    flex: 1, backgroundColor: 'white', borderRadius: 10,
    padding: 14, fontSize: 15, borderWidth: 1, borderColor: '#ddd',
  },
  botaoAdd: {
    backgroundColor: '#1976d2', width: 50, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  botaoAddTexto: { color: 'white', fontSize: 28, fontWeight: 'bold', lineHeight: 32 },

  tarefaCard: {
    backgroundColor: 'white', padding: 16, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 1,
  },
  tarefaTexto: { flex: 1, fontSize: 16, color: '#222' },
  botaoDeletar: {
    backgroundColor: '#ffebee', width: 32, height: 32,
    borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  botaoDeletarTexto: { color: '#d32f2f', fontWeight: 'bold', fontSize: 14 },

  vazio: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },

  rlsBadge: {
    marginTop: 16, backgroundColor: '#e8f5e9', padding: 10,
    borderRadius: 8, alignItems: 'center',
  },
  rlsTexto: { fontSize: 12, color: '#2e7d32' },
});