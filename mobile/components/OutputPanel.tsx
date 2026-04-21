import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import type { GenerateResponse } from '@/lib/api';

type Props = {
  result: GenerateResponse | null;
  loading: boolean;
};

export function OutputPanel({ result, loading }: Props) {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator />
        <Text style={styles.muted}>Generating scripture, sermon, and prayer…</Text>
      </View>
    );
  }

  if (!result) return null;

  return (
    <View style={{ gap: 16 }}>
      <View style={styles.card}>
        <Text style={styles.heading}>Scripture</Text>
        {result.scripture.length === 0 ? (
          <Text style={styles.muted}>No scripture returned.</Text>
        ) : (
          result.scripture.map((s, i) => (
            <View key={`${s.reference}-${i}`} style={styles.scriptureItem}>
              <Text style={styles.reference}>{s.reference}</Text>
              <Text style={styles.body}>{s.text}</Text>
              {s.relevance_note ? <Text style={styles.muted}>{s.relevance_note}</Text> : null}
            </View>
          ))
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Sermon</Text>
        <Text style={styles.body}>{result.sermon}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Prayer</Text>
        <Text style={styles.body}>{result.prayer}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  heading: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  body: { fontSize: 15, lineHeight: 22, color: '#1f2937' },
  reference: { fontWeight: '700', color: '#1f2937' },
  muted: { color: '#6b7280', fontSize: 13 },
  scriptureItem: { gap: 4 },
});
