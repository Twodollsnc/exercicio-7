import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function TelaConfig() {
  // PASSO 2 — 3 estados booleanos
  const [notificacoes, setNotificacoes] = useState(false);
  const [som, setSom] = useState(false);
  const [biometria, setBiometria] = useState(false);

  // PASSO 5 — Carrega os 3 valores do disco ao abrir
  useEffect(() => {
    const carregarConfigs = async () => {
      const notifSalva  = await AsyncStorage.getItem('@config_notif');
      const somSalvo    = await AsyncStorage.getItem('@config_som');
      const bioSalva    = await AsyncStorage.getItem('@config_bio');

      // AsyncStorage salva string — precisa comparar com 'true'
      if (notifSalva === 'true') setNotificacoes(true);
      if (somSalvo   === 'true') setSom(true);
      if (bioSalva   === 'true') setBiometria(true);
    };
    carregarConfigs();
  }, []);

  // PASSO 4 — Funções toggle: atualiza estado + salva no disco
  const toggleNotificacoes = async (valor) => {
    setNotificacoes(valor);
    await AsyncStorage.setItem('@config_notif', valor.toString());
  };

  const toggleSom = async (valor) => {
    setSom(valor);
    await AsyncStorage.setItem('@config_som', valor.toString());
  };

  const toggleBiometria = async (valor) => {
    setBiometria(valor);
    await AsyncStorage.setItem('@config_bio', valor.toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configurações</Text>

      <View style={styles.card}>
        {/* PASSO 3 — 3 Switches */}
        <View style={styles.linha}>
          <View>
            <Text style={styles.labelSwitch}>Notificações</Text>
            <Text style={styles.subLabel}>Receber alertas do app</Text>
          </View>
          <Switch
            value={notificacoes}
            onValueChange={toggleNotificacoes}
            trackColor={{ false: '#ccc', true: '#81b0ff' }}
            thumbColor={notificacoes ? '#1976d2' : '#f4f3f4'}
          />
        </View>

        <View style={styles.separador} />

        <View style={styles.linha}>
          <View>
            <Text style={styles.labelSwitch}>Som</Text>
            <Text style={styles.subLabel}>Sons e efeitos sonoros</Text>
          </View>
          <Switch
            value={som}
            onValueChange={toggleSom}
            trackColor={{ false: '#ccc', true: '#81b0ff' }}
            thumbColor={som ? '#1976d2' : '#f4f3f4'}
          />
        </View>

        <View style={styles.separador} />

        <View style={styles.linha}>
          <View>
            <Text style={styles.labelSwitch}>Biometria</Text>
            <Text style={styles.subLabel}>Login por digital ou rosto</Text>
          </View>
          <Switch
            value={biometria}
            onValueChange={toggleBiometria}
            trackColor={{ false: '#ccc', true: '#81b0ff' }}
            thumbColor={biometria ? '#1976d2' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
}

// PASSO 1 — Tab Navigator com TelaConfig
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="TelaConfig"
          component={TelaConfig}
          options={{ title: 'Configurações' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  card: {
    backgroundColor: 'white', borderRadius: 10,
    padding: 10, elevation: 3,
  },
  linha: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10,
  },
  separador: { height: 1, backgroundColor: '#eee', marginHorizontal: 10 },
  labelSwitch: { fontSize: 16, fontWeight: '600' },
  subLabel: { fontSize: 12, color: '#888', marginTop: 2 },
});