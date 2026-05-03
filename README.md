## 🛠️ Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) *(quando aplicável)*
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---
# 📱 Exercícios React Native

Repositório criado para armazenar os códigos dos exercícios práticos de React Native, desenvolvidos durante os estudos da tecnologia.

---

## 📂 Estrutura do Repositório

Cada exercício fica em sua própria pasta, nomeada de forma descritiva. Exemplo:

```
/
├── ex01-tela-perfil-async-storage/
│   ├── App.js
│   ├── TelaPerfil.js
│   └── README.md  (opcional, com anotações do exercício)
├── ex02-navegacao-tabs/
│   └── ...
└── README.md
```

---

## 📋 Lista de Exercícios

| # | Exercício | Conceitos Praticados |
|---|-----------|----------------------|
| 01 | **Tela de Perfil com AsyncStorage** | Stack Navigator, AsyncStorage, useEffect, useState |
| ... | *(em breve)* | ... |

---

## 🧩 Exercício 01 — Tela de Perfil com AsyncStorage

**Pasta:** `ex01-tela-perfil-async-storage`

### O que foi feito

- Criação de um **Stack Navigator** com a tela `TelaPerfil`
- Campo `TextInput` para digitar o nome do usuário
- Botão **Salvar** que persiste o nome com `AsyncStorage.setItem`
- `useEffect` que carrega o nome salvo ao abrir a tela e exibe a mensagem *"Bem-vindo de volta, [Nome]"*
- Botão **Apagar** que remove o dado com `AsyncStorage.removeItem` e limpa a tela

### Dependências utilizadas

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
```

---

## 🚀 Como rodar qualquer exercício

1. Acesse a pasta do exercício:
   ```bash
   cd ex01-tela-perfil-async-storage
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto:
   ```bash
   npx expo start
   # ou
   npx react-native run-android
   ```



## 📝 Observações

- Os exercícios são feitos com fins didáticos — o foco é no funcionamento, não no visual.
- Cada pasta é independente e pode ser rodada separadamente.