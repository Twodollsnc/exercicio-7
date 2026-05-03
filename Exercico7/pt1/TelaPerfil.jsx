import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TelaPerfil() {
  const [nome, setNome] = useState('');
  const [nomeSalvo, setNomeSalvo] = useState('');

  useEffect(() => {
    async function carregarNome() {
      const valorSalvo = await AsyncStorage.getItem('@meu_nome');
      if (valorSalvo) {
        setNomeSalvo(valorSalvo);
      }
    }
    carregarNome();
  }, []);

  async function salvar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite um nome antes de salvar.');
      return;
    }
    await AsyncStorage.setItem('@meu_nome', nome);
    setNomeSalvo(nome);
    setNome('');
  }

  async function apagar() {
    await AsyncStorage.removeItem('@meu_nome');
    setNomeSalvo('');
    setNome('');
  }

  return (
    <View style={styles.container}>
      {nomeSalvo ? (
        <Text style={styles.boasVindas}>Bem-vindo de volta, {nomeSalvo}!</Text>
      ) : (
        <Text style={styles.semNome}>Nenhum nome salvo ainda.</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />

      <View style={styles.botao}>
        <Button title="Salvar" onPress={salvar} />
      </View>

      <View style={styles.botao}>
        <Button title="Apagar" color="red" onPress={apagar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  boasVindas: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  semNome: { fontSize: 16, color: '#888', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 12, fontSize: 16,
  },
  botao: { marginBottom: 10 },
});