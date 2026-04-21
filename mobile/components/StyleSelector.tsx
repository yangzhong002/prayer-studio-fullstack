import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { StyleOption } from '@/lib/api';

type Props = {
  options: StyleOption[];
  value: string[];
  onChange: (next: string[]) => void;
};

export function StyleSelector({ options, value, onChange }: Props) {
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const selected = value.includes(opt.id);
        return (
          <Pressable
            key={opt.id}
            onPress={() => toggle(opt.id)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d4d4d8',
    backgroundColor: '#fafaf9',
  },
  chipSelected: { backgroundColor: '#1f2937', borderColor: '#1f2937' },
  chipText: { color: '#1f2937', fontSize: 13 },
  chipTextSelected: { color: '#fafaf9' },
});
