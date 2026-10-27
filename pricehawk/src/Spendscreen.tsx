import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SPEND } from './Data';
import { colors, inr, ui } from './Theme';

export default function SpendScreen() {
  const used = Math.round((SPEND.total / SPEND.budget) * 100);
  const maxMonth = Math.max(...SPEND.monthly.map((m) => m.v));

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.content}>
      <View style={ui.kpiGrid}>
        <View style={ui.kpi}>
          <Text style={ui.label}>Spent in July</Text>
          <Text style={ui.kpiVal}>{inr(SPEND.total)}</Text>
          <Text style={ui.muted}>{inr(2400)} more than June</Text>
        </View>
        <View style={ui.kpi}>
          <Text style={ui.label}>Amazon orders</Text>
          <Text style={ui.kpiVal}>{SPEND.orders}</Text>
          <Text style={ui.muted}>{inr(SPEND.total / SPEND.orders)} per order</Text>
        </View>
      </View>

      <View style={ui.card}>
        <Text style={ui.title}>Student budget</Text>
        <View style={[ui.row, { justifyContent: 'space-between' }]}>
          <Text style={ui.muted}>Used {inr(SPEND.total)} of {inr(SPEND.budget)}</Text>
          <Text style={{ color: colors.accent, fontWeight: '800' }}>{inr(SPEND.budget - SPEND.total)} left</Text>
        </View>
        <View style={[ui.barTrack, { height: 10, marginTop: 8, flex: 0 }]}>
          <View style={{ width: `${used}%`, height: 10, backgroundColor: used > 85 ? colors.warn : colors.amazon }} />
        </View>
        <Text style={[ui.muted, { marginTop: 6 }]}>{used}% used, {SPEND.daysLeft} days left in the month</Text>
      </View>

      <View style={ui.card}>
        <Text style={ui.title}>Where it went</Text>
        {SPEND.categories.map((c) => (
          <View key={c.name} style={[ui.row, { marginBottom: 12 }]}>
            <Text style={[ui.text, { width: 92 }]}>{c.name}</Text>
            <View style={ui.barTrack}>
              <View style={{ width: `${(c.amount / SPEND.total) * 100}%`, height: 8, backgroundColor: c.color }} />
            </View>
            <Text style={{ color: colors.text, fontWeight: '700', width: 70, textAlign: 'right' }}>{inr(c.amount)}</Text>
          </View>
        ))}
      </View>

      <View style={ui.card}>
        <Text style={ui.title}>Last six months</Text>
        <View style={[ui.row, { height: 130, alignItems: 'flex-end', justifyContent: 'space-between' }]}>
          {SPEND.monthly.map((m, i) => {
            const latest = i === SPEND.monthly.length - 1;
            return (
              <View key={m.m} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <Text style={[ui.muted, { fontSize: 10, marginBottom: 4 }]}>{(m.v / 1000).toFixed(1)}k</Text>
                <View
                  style={{
                    width: '60%',
                    height: `${(m.v / maxMonth) * 70}%`,
                    borderRadius: 6,
                    backgroundColor: latest ? colors.amazon : colors.surface2,
                    borderWidth: 1,
                    borderColor: latest ? colors.amazon : colors.border,
                  }}
                />
                <Text style={[ui.muted, { marginTop: 4 }]}>{m.m}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={ui.card}>
        <Text style={ui.title}>Recent Amazon orders</Text>
        {SPEND.recent.map((o) => (
          <View key={o.id} style={[ui.row, { marginBottom: 12 }]}>
            <Text style={{ fontSize: 22, marginRight: 12 }}>{o.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={ui.text}>{o.name}</Text>
              <Text style={ui.muted}>{o.date}</Text>
            </View>
            <Text style={{ color: colors.amazon, fontWeight: '800' }}>{inr(o.price)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
