import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#0D0F14',
  surface: '#161B24',
  surface2: '#1E2535',
  border: '#2A3347',
  accent: '#00E5A0',
  blue: '#0099FF',
  warn: '#FF6B35',
  amazon: '#FF9900',
  text: '#E8EDF5',
  muted: '#7A8BA8',
};

// Indian number format: 134900 -> ₹1,34,900 (does not depend on Intl support)
export function inr(n: number): string {
  const s = String(Math.round(n));
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return '₹' + (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3);
}

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  title: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: 6 },
  text: { color: colors.text, fontSize: 14 },
  muted: { color: colors.muted, fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  btn: { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '800', fontSize: 14 },
  btnOutline: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnOutlineText: { color: colors.text, fontWeight: '700', fontSize: 13 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    marginRight: 8,
  },
  chipActive: { borderColor: colors.accent, backgroundColor: 'rgba(0,229,160,0.12)' },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: colors.accent },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  kpi: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  kpiVal: { color: colors.text, fontSize: 22, fontWeight: '800' },
  barTrack: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 8, overflow: 'hidden' },
});
