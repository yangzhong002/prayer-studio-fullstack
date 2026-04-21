import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  fetchStyles,
  generateContent,
  type GenerateResponse,
  type StyleOption,
} from '@/lib/api';
import { OutputPanel } from './OutputPanel';
import { StyleSelector } from './StyleSelector';

const TONES = ['reverent', 'tender', 'solemn', 'hopeful', 'urgent'];
const LENGTHS = ['short', 'medium', 'long'];
const LANGUAGES: Array<{ value: 'en' | 'es'; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

export function GenerationForm() {
  const [styles, setStyles] = useState<StyleOption[]>([]);
  const [stylesError, setStylesError] = useState<string | null>(null);

  const [userInput, setUserInput] = useState(
    'I have been feeling anxious lately and my prayers feel powerless.',
  );
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['spurgeon']);
  const [tone, setTone] = useState('reverent');
  const [length, setLength] = useState('medium');
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStyles()
      .then(setStyles)
      .catch((e) => setStylesError(e instanceof Error ? e.message : 'Failed to load styles'));
  }, []);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      const data = await generateContent({
        user_input: userInput,
        selected_styles: selectedStyles,
        tone,
        length,
        language,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const submitDisabled = loading || selectedStyles.length === 0;

  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <Text style={s.title}>Prayer Studio</Text>
          <Text style={s.subtitle}>Input + Style Tags = Triple Output</Text>
        </View>

        <View style={s.card}>
          <Text style={s.label}>Describe your situation</Text>
          <TextInput
            value={userInput}
            onChangeText={setUserInput}
            multiline
            numberOfLines={4}
            placeholder="What are you wrestling with?"
            style={s.textarea}
            textAlignVertical="top"
          />
        </View>

        <View style={s.card}>
          <Text style={s.label}>Pastor preaching style</Text>
          {stylesError ? (
            <Text style={s.error}>{stylesError}</Text>
          ) : styles.length === 0 ? (
            <ActivityIndicator />
          ) : (
            <StyleSelector options={styles} value={selectedStyles} onChange={setSelectedStyles} />
          )}
        </View>

        <View style={s.card}>
          <Text style={s.label}>Tone</Text>
          <PillGroup options={TONES} value={tone} onChange={setTone} />

          <Text style={[s.label, { marginTop: 12 }]}>Length</Text>
          <PillGroup options={LENGTHS} value={length} onChange={setLength} />

          <Text style={[s.label, { marginTop: 12 }]}>Language</Text>
          <PillGroup
            options={LANGUAGES.map((l) => l.value)}
            labels={LANGUAGES.map((l) => l.label)}
            value={language}
            onChange={(v) => setLanguage(v as 'en' | 'es')}
          />
        </View>

        <OutputPanel result={result} loading={loading} />
      </ScrollView>

      <View style={s.footer}>
        {error ? <Text style={s.errorInFooter}>{error}</Text> : null}
        <Pressable
          onPress={onSubmit}
          disabled={submitDisabled}
          style={[s.primaryButton, submitDisabled && s.buttonDisabled]}
        >
          <Text style={s.primaryButtonText}>
            {loading ? 'Generating…' : 'Generate Scripture / Sermon / Prayer'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function PillGroup({
  options,
  labels,
  value,
  onChange,
}: {
  options: string[];
  labels?: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt, i) => {
        const selected = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[s.pill, selected && s.pillSelected]}
          >
            <Text style={[s.pillText, selected && s.pillTextSelected]}>
              {labels?.[i] ?? opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, gap: 16, paddingBottom: 24 },
  header: { gap: 4 },
  title: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
  subtitle: { fontSize: 13, color: '#6b7280' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  label: { fontSize: 13, fontWeight: '600', color: '#1f2937' },
  textarea: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 8,
    padding: 12,
    minHeight: 90,
    fontSize: 15,
    color: '#1f2937',
    backgroundColor: '#fafaf9',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d4d4d8',
    backgroundColor: '#fafaf9',
  },
  pillSelected: { backgroundColor: '#1f2937', borderColor: '#1f2937' },
  pillText: { color: '#1f2937', fontSize: 13 },
  pillTextSelected: { color: '#fafaf9' },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#e7e5e4',
    backgroundColor: '#f5f5f4',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#1f2937',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: '#fafaf9', fontWeight: '700', fontSize: 15 },
  error: { color: '#b91c1c', fontSize: 13 },
  errorInFooter: { color: '#b91c1c', fontSize: 13, textAlign: 'center' },
});
