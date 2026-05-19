import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';

const languages = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'Inglês' },
  { code: 'es', label: 'Espanhol' },
  { code: 'fr', label: 'Francês' },
  { code: 'de', label: 'Alemão' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: 'Japonês' },
];

export default function App() {
  const [sourceText, setSourceText] = useState('');
  const [resultText, setResultText] = useState('');
  const [fromLang, setFromLang] = useState('pt');
  const [toLang, setToLang] = useState('en');
  const [status, setStatus] = useState('');

  const translateText = async () => {
    if (!sourceText.trim()) {
      setStatus('Digite um texto para traduzir.');
      return;
    }

    setStatus('Traduzindo...');
    try {
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: sourceText,
          source: fromLang,
          target: toLang,
          format: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      setResultText(data.translatedText || '');
      setStatus('Tradução concluída.');
    } catch (error) {
      setStatus('Falha ao traduzir. Tente novamente.');
    }
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setSourceText(resultText);
    setResultText(sourceText);
  };

  const speak = (text, lang) => {
    if (!text.trim()) {
      setStatus('Não há texto para reproduzir.');
      return;
    }
    Speech.stop();
    Speech.speak(text, { language: lang });
  };

  const copyTranslation = async () => {
    if (!resultText.trim()) {
      setStatus('Não há tradução para copiar.');
      return;
    }
    await Clipboard.setStringAsync(resultText);
    setStatus('Tradução copiada!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>PlayTranslate Mobile</Text>
        <Text style={styles.subtitle}>Traduza e ouça no celular</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Texto original</Text>
          <TextInput
            style={styles.input}
            multiline
            value={sourceText}
            onChangeText={setSourceText}
            placeholder="Digite algo para traduzir..."
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>De</Text>
          <Picker selectedValue={fromLang} onValueChange={setFromLang} style={styles.picker}>
            {languages.map((lang) => (
              <Picker.Item key={`from-${lang.code}`} label={lang.label} value={lang.code} />
            ))}
          </Picker>

          <Text style={styles.label}>Para</Text>
          <Picker selectedValue={toLang} onValueChange={setToLang} style={styles.picker}>
            {languages.map((lang) => (
              <Picker.Item key={`to-${lang.code}`} label={lang.label} value={lang.code} />
            ))}
          </Picker>

          <View style={styles.row}>
            <ActionButton text="Traduzir" onPress={translateText} />
            <ActionButton text="Inverter" onPress={swapLanguages} secondary />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tradução</Text>
          <TextInput style={styles.input} multiline editable={false} value={resultText} />
          <View style={styles.row}>
            <ActionButton text="Ouvir original" onPress={() => speak(sourceText, fromLang)} />
            <ActionButton text="Ouvir tradução" onPress={() => speak(resultText, toLang)} />
          </View>
          <ActionButton text="Copiar tradução" onPress={copyTranslation} />
        </View>

        <Text style={styles.status}>{status}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({ text, onPress, secondary = false }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, secondary && styles.buttonSecondary]}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f172a' },
  container: { padding: 16, gap: 12 },
  title: { color: '#f8fafc', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#cbd5e1', marginBottom: 6 },
  card: { backgroundColor: '#1e293b', padding: 14, borderRadius: 14, gap: 8 },
  label: { color: '#f1f5f9', fontWeight: '600' },
  input: {
    minHeight: 96,
    backgroundColor: '#0b1220',
    color: '#f8fafc',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
  },
  picker: { backgroundColor: '#0b1220', color: '#f8fafc' },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  buttonSecondary: { backgroundColor: '#475569' },
  buttonText: { color: '#fff', fontWeight: '600' },
  status: { color: '#e2e8f0', minHeight: 24, marginTop: 8 },
});
