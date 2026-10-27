import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRODUCTS } from './Data';
import { inr } from './Theme';

const STORAGE_KEY = 'pricehawk:v1';
const basePrices = () => Object.fromEntries(PRODUCTS.map((p) => [p.id, p.price]));

type PriceMap = Record<string, number>;
type PriceAlert = { id: string; productId: string; target: number; triggered: boolean };
type AppContextValue = {
  prices: PriceMap;
  alerts: PriceAlert[];
  selectedId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
  addAlert: (productId: string, target: number) => void;
  removeAlert: (id: string) => void;
  simulateDrop: (productId: string, amount: number) => void;
  resetDemo: () => void;
};

const Ctx = createContext<AppContextValue | null>(null);
export function useApp(): AppContextValue {
  const context = useContext(Ctx);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}

export function AppProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [prices, setPrices] = useState<PriceMap>(basePrices());
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [selectedId, setSelectedId] = useState(PRODUCTS[0].id);

  // Load saved alerts + prices
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          setPrices({ ...basePrices(), ...saved.prices });
          setAlerts(saved.alerts || []);
        }
      } catch (e) {
        // first launch or storage unavailable
      }
      setReady(true);
    })();
  }, []);

  // Save whenever alerts or prices change
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ prices, alerts })).catch(() => {});
  }, [prices, alerts, ready]);

  // Core feature: when a price reaches an alert's target, fire the notification once
  useEffect(() => {
    if (!ready) return;
    const hit = alerts.filter((a) => !a.triggered && prices[a.productId] <= a.target);
    if (!hit.length) return;
    setAlerts((prev) => prev.map((a) => (hit.some((h) => h.id === a.id) ? { ...a, triggered: true } : a)));
    hit.forEach((a) => {
      const p = PRODUCTS.find((x) => x.id === a.productId)!;
      Alert.alert('Price alert: ' + p.name, 'Now ' + inr(prices[a.productId]) + ', at or below your target of ' + inr(a.target));
    });
  }, [prices, alerts, ready]);

  const addAlert = (productId: string, target: number) =>
    setAlerts((prev) => [{ id: String(Date.now()), productId, target, triggered: false }, ...prev]);

  const removeAlert = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  // Demo helpers: no live store data in the prototype, so we simulate price movement
  const simulateDrop = (productId: string, amount: number) =>
    setPrices((prev) => ({ ...prev, [productId]: Math.max(1000, prev[productId] - amount) }));

  const resetDemo = () => {
    setPrices(basePrices());
    setAlerts((prev) => prev.map((a) => ({ ...a, triggered: false })));
  };

  return (
    <Ctx.Provider
      value={{ prices, alerts, selectedId, setSelectedId, addAlert, removeAlert, simulateDrop, resetDemo }}
    >
      {children}
    </Ctx.Provider>
  );
}
