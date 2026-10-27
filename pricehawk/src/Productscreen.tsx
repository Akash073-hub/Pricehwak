import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from './Appcontext';
import { PRODUCTS, RANGES, storesFor } from './Data';
import PriceChart from './Pricechart';
import { colors, inr, ui } from './Theme';

export default function ProductScreen({ navigation }: { navigation: any }) {
  const { prices, selectedId, setSelectedId, simulateDrop } = useApp();
  const [range, setRange] = useState<(typeof RANGES)[number]>('3M');

  const product = PRODUCTS.find((p) => p.id === selectedId)!;
  const price = prices[product.id];

  // Replace the last point with the live price so simulated drops show on the chart
  const data = [...product.history[range].slice(0, -1), price];
  const allTimeLow = Math.min(...product.history['1Y'], price);
  const avg = Math.round(product.history['3M'].reduce((a, b) => a + b, 0) / product.history['3M'].length);
  const off = Math.round(((product.original - price) / product.original) * 100);
  const nearLow = price <= allTimeLow * 1.02;

  const stores = storesFor(price, product.original);
  const maxStore = Math.max(...stores.map((s) => s.price));

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.content}>
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
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>{product.name}</Text>
        <View style={[ui.row, { marginTop: 10, flexWrap: 'wrap' }]}>
          <Text style={{ color: colors.accent, fontSize: 32, fontWeight: '800', marginRight: 10 }}>{inr(price)}</Text>
          <Text style={{ color: colors.muted, fontSize: 16, textDecorationLine: 'line-through', marginRight: 10 }}>
            {inr(product.original)}
          </Text>
          <Text style={{ color: colors.accent, fontWeight: '700' }}>{off}% off</Text>
        </View>
        <View
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 10,
            backgroundColor: nearLow ? 'rgba(0,229,160,0.1)' : 'rgba(255,107,53,0.1)',
          }}
        >
          <Text style={{ color: nearLow ? colors.accent : colors.warn, fontWeight: '700', fontSize: 13 }}>
            {nearLow ? 'Near its lowest price. Good time to buy.' : 'Price is above its lowest. Consider waiting or setting an alert.'}
          </Text>
        </View>
        <View style={[ui.row, { marginTop: 14 }]}>
          <TouchableOpacity style={[ui.btn, { flex: 1, marginRight: 8 }]} onPress={() => navigation.navigate('Alerts')}>
            <Text style={ui.btnText}>Set price alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ui.btnOutline, { flex: 1 }]} onPress={() => simulateDrop(product.id, 2000)}>
            <Text style={ui.btnOutlineText}>Simulate ₹2,000 drop</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={ui.card}>
        <View style={[ui.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
          <Text style={[ui.title, { marginBottom: 0 }]}>Price history</Text>
          <View style={ui.row}>
            {RANGES.map((r) => (
              <TouchableOpacity
                key={r}
                style={[ui.chip, { marginRight: 4, paddingHorizontal: 10, paddingVertical: 5 }, r === range && ui.chipActive]}
                onPress={() => setRange(r)}
              >
                <Text style={[ui.chipText, r === range && ui.chipTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <PriceChart data={data} />
      </View>

      <View style={ui.kpiGrid}>
        <View style={ui.kpi}>
          <Text style={ui.label}>Lowest in a year</Text>
          <Text style={[ui.kpiVal, { fontSize: 18, color: colors.accent }]}>{inr(allTimeLow)}</Text>
        </View>
        <View style={ui.kpi}>
          <Text style={ui.label}>Average, last 3 months</Text>
          <Text style={[ui.kpiVal, { fontSize: 18 }]}>{inr(avg)}</Text>
        </View>
      </View>

      <View style={ui.card}>
        <Text style={ui.title}>Compare stores</Text>
        {stores.map((s, i) => (
          <View key={s.name} style={[ui.row, { marginBottom: 12 }]}>
            <Text style={[ui.text, { width: 84 }]}>{s.name}</Text>
            <View style={ui.barTrack}>
              <View style={{ width: `${(s.price / maxStore) * 100}%`, height: 8, backgroundColor: s.color }} />
            </View>
            <Text style={{ color: i === 0 ? colors.accent : colors.text, fontWeight: '700', width: 84, textAlign: 'right' }}>
              {inr(s.price)}
            </Text>
          </View>
        ))}
        <Text style={ui.muted}>Cheapest right now: {stores[0].name}</Text>
      </View>
    </ScrollView>
  );
}
