import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Keyboard } from 'react-native';
import { useApp } from './Appcontext';
import { PRODUCTS } from './Data';
import { colors, inr, ui } from './Theme';

export default function AlertsScreen() {
  const { prices, alerts, selectedId, setSelectedId, addAlert, removeAlert, simulateDrop, resetDemo } = useApp();
  const [target, setTarget] = useState('');

  const product = PRODUCTS.find((p) => p.id === selectedId)!;
  const price = prices[product.id];
  const presets = [5000, 10000, 15000, 20000].map((d) => price - d);

  const submit = () => {
    const t = parseInt(target.replace(/\D/g, ''), 10);
    if (!t) return Alert.alert('Enter a target price', 'Type the price you want to be alerted at.');
    if (t >= price) return Alert.alert('Target is too high', `The current price is ${inr(price)}. Pick a lower price.`);
    addAlert(product.id, t);
    setTarget('');
    Keyboard.dismiss();
    Alert.alert('Alert set', `We will notify you when ${product.name} reaches ${inr(t)}.`);
  };

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled">
      <Text style={ui.label}>Choose an iPhone</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
        {PRODUCTS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={[ui.chip, p.id === selectedId && ui.chipActive]}
            onPress={() => setSelectedId(p.id)}
          >
            <Text style={[ui.chipText, p.id === selectedId && ui.chipTextActive]}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={ui.card}>
        <View style={ui.row}>
          <Text style={{ fontSize: 34, marginRight: 12 }}>📱</Text>
          <View>
            <Text style={[ui.text, { fontWeight: '800', fontSize: 16 }]}>{product.name}</Text>
            <Text style={ui.muted}>
              Current price <Text style={{ color: colors.accent, fontWeight: '800' }}>{inr(price)}</Text>
            </Text>
          </View>
        </View>

        <Text style={[ui.label, { marginTop: 16 }]}>Alert me when the price drops to</Text>
        <TextInput
          value={target}
          onChangeText={setTarget}
          keyboardType="number-pad"
          placeholder="e.g. 120000"
          placeholderTextColor={colors.muted}
          style={{
            backgroundColor: colors.surface2,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 12,
            padding: 14,
            color: colors.text,
            fontSize: 20,
            fontWeight: '800',
          }}
        />

        <View style={[ui.row, { flexWrap: 'wrap', marginTop: 12 }]}>
          {presets.map((p) => (
            <TouchableOpacity key={p} style={[ui.chip, { marginBottom: 8 }]} onPress={() => setTarget(String(p))}>
              <Text style={ui.chipText}>{inr(p)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[ui.btn, { marginTop: 6 }]} onPress={submit}>
          <Text style={ui.btnText}>Set price alert</Text>
        </TouchableOpacity>
      </View>

      <Text style={ui.title}>Your alerts</Text>
      {alerts.length === 0 && (
        <View style={ui.card}>
          <Text style={ui.muted}>No alerts yet. Pick an iPhone above and set the price you want.</Text>
        </View>
      )}
      {alerts.map((a) => {
        const p = PRODUCTS.find((x) => x.id === a.productId)!;
        const cur = prices[a.productId];
        return (
          <View key={a.id} style={[ui.card, ui.row, a.triggered && { borderColor: colors.accent }]}>
            <View style={{ flex: 1 }}>
              <Text style={[ui.text, { fontWeight: '700' }]}>{p.name}</Text>
              <Text style={ui.muted}>Target {inr(a.target)}  |  Now {inr(cur)}</Text>
              <Text style={{ color: a.triggered ? colors.accent : colors.muted, fontWeight: '700', fontSize: 12, marginTop: 4 }}>
                {a.triggered ? 'Target reached. You were notified.' : `Watching, ${inr(cur - a.target)} to go`}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeAlert(a.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={{ color: colors.warn, fontWeight: '700' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <View style={[ui.card, { marginTop: 6 }]}>
        <Text style={ui.title}>Test your alert</Text>
        <Text style={[ui.muted, { marginBottom: 12 }]}>
          The prototype has no live store feed, so simulate the price falling and watch the alert fire.
        </Text>
        <View style={ui.row}>
          <TouchableOpacity style={[ui.btnOutline, { flex: 1, marginRight: 8 }]} onPress={() => simulateDrop(product.id, 5000)}>
            <Text style={ui.btnOutlineText}>Drop ₹5,000</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ui.btnOutline, { flex: 1 }]} onPress={resetDemo}>
            <Text style={ui.btnOutlineText}>Reset prices</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
