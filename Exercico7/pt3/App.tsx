import React, { useState } from 'react';
import {
  View, Text, TextInput, Button,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function TelaNovoProduto() {
  // PASSO 3 — Estados dos valores
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');

  // PASSO 3 — Estados dos erros
  const [erroNome, setErroNome] = useState('');
  const [erroPreco, setErroPreco] = useState('');

  // PASSO 4 e 6 — Validação e submit
  const salvar = () => {
    let valido = true;

    // Reseta erros
    setErroNome('');
    setErroPreco('');

    // Valida Nome
    if (nome.trim().length < 3) {
      setErroNome('O nome é obrigatório e deve ter pelo menos 3 letras.');
      valido = false;
    }

    // Valida Preço
    const precoNum = parseFloat(preco.replace(',', '.'));
    if (!preco || isNaN(precoNum) || precoNum <= 0) {
      setErroPreco('O preço é obrigatório e deve ser maior que zero.');
      valido = false;
    }

    // PASSO 6 — Sucesso
    if (valido) {
      Alert.alert('✅ Sucesso!', `Produto "${nome}" cadastrado por R$ ${precoNum.toFixed(2)}.`);
      setNome('');
      setPreco('');
      setDescricao('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome do Produto *</Text>
      <TextInput
        style={[styles.input, erroNome ? styles.inputErro : null]}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Arroz, Notebook, Camiseta..."
      />
      {erroNome ? <Text style={styles.textoErro}>{erroNome}</Text> : null}

      {/* PASSO 2 — Teclado numérico para preço */}
      <Text style={styles.label}>Preço (R$) *</Text>
      <TextInput
        style={[styles.input, erroPreco ? styles.inputErro : null]}
        value={preco}
        onChangeText={setPreco}
        placeholder="Ex: 19.90"
        keyboardType="numeric"
      />
      {erroPreco ? <Text style={styles.textoErro}>{erroPreco}</Text> : null}

      {/* PASSO 2 — Campo multiline para descrição */}
      <Text style={styles.label}>Descrição (opcional)</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Detalhes sobre o produto..."
        multiline={true}
        numberOfLines={4}
      />

      <View style={styles.botao}>
        <Button title="Salvar Produto" onPress={salvar} />
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
          name="TelaNovoProduto"
          component={TelaNovoProduto}
          options={{ title: 'Novo Produto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: 'white', flexGrow: 1 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 12, borderRadius: 6, fontSize: 15,
  },
  inputErro: { borderColor: 'red', borderWidth: 2 },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  textoErro: { color: 'red', fontSize: 12, marginTop: 5 },
  botao: { marginTop: 30 },
});