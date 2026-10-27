import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from './Appcontext';
import { PRODUCTS, SPEND } from './Data';
import { colors, inr, ui } from './Theme';

export default function DashboardScreen({ navigation }: { navigation: any }) {
  const { prices, alerts, setSelectedId } = useApp();
  const activeAlerts = alerts.filter((a) => !a.triggered).length;
  const hitAlerts = alerts.filter((a) => a.triggered).length;

  const openProduct = (id: string) => {
    setSelectedId(id);
    navigation.navigate('Product');
  };

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.content}>
      <View style={ui.kpiGrid}>
        <View style={ui.kpi}>
          <Text style={ui.label}>Total saved</Text>
          <Text style={[ui.kpiVal, { color: colors.accent }]}>{inr(SPEND.lifetimeSaved)}</Text>
          <Text style={ui.muted}>{inr(SPEND.savedThisMonth)} this month</Text>
        </View>
        <View style={ui.kpi}>
          <Text style={ui.label}>Active alerts</Text>
          <Text style={ui.kpiVal}>{activeAlerts}</Text>
          <Text style={ui.muted}>{hitAlerts} target{hitAlerts === 1 ? '' : 's'} reached</Text>
        </View>
        <View style={ui.kpi}>
          <Text style={ui.label}>Phones tracked</Text>
          <Text style={ui.kpiVal}>{PRODUCTS.length}</Text>
          <Text style={ui.muted}>all below launch price</Text>
        </View>
        <View style={ui.kpi}>
          <Text style={ui.label}>Amazon spend</Text>
          <Text style={ui.kpiVal}>{inr(SPEND.total)}</Text>
          <Text style={ui.muted}>this month</Text>
        </View>
      </View>

      <Text style={[ui.title, { marginTop: 6 }]}>Price drops today</Text>
      {PRODUCTS.map((p) => {
        const price = prices[p.id];
        const off = Math.round(((p.original - price) / p.original) * 100);
        return (
          <TouchableOpacity key={p.id} style={[ui.card, ui.row]} onPress={() => openProduct(p.id)} activeOpacity={0.7}>
            <Text style={{ fontSize: 28, marginRight: 12 }}>📱</Text>
            <View style={{ flex: 1 }}>
              <Text style={[ui.text, { fontWeight: '700' }]}>{p.name}</Text>
              <Text style={ui.muted}>Launch {inr(p.original)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 16 }}>{inr(price)}</Text>
              <Text style={ui.muted}>{off}% off</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
