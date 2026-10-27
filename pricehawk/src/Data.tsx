// Mock data for the prototype. A real version would fetch this from a backend / scraper.
import { colors } from './Theme';

// Deterministic price curve from `from` down to `to` (no random, so charts look the same every run)
const series = (from: number, to: number, n: number): number[] => {
  const out = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const base = from + (to - from) * Math.pow(t, 0.7);
    const noise = Math.sin(i * 12.9898 + from) * 0.012 * base * (1 - t * 0.6);
    return Math.round((base + noise) / 100) * 100;
  });
  out[n - 1] = to;
  return out;
};

const make = (id: string, name: string, original: number, price: number) => ({
  id,
  name,
  original,
  price,
  history: {
    '1M': series(price * 1.03, price, 15),
    '3M': series(price * 1.08, price, 24),
    '6M': series(price * 1.14, price, 30),
    '1Y': series(original, price, 40),
  },
});

export const PRODUCTS = [
  make('15pm', 'iPhone 15 Pro Max', 159900, 134900),
  make('15p', 'iPhone 15 Pro', 134900, 119900),
  make('15pl', 'iPhone 15 Plus', 89900, 79900),
  make('15', 'iPhone 15', 79900, 69900),
  make('14', 'iPhone 14', 69900, 59900),
  make('13', 'iPhone 13', 59900, 49900),
];

export const RANGES = ['1M', '3M', '6M', '1Y'] as const;

const round100 = (n: number) => Math.round(n / 100) * 100;

// Price of the same phone on different stores, cheapest first
export const storesFor = (price: number, original: number) =>
  [
    { name: 'Amazon', price, color: colors.amazon },
    { name: 'Flipkart', price: round100(price * 1.023), color: '#2874F0' },
    { name: 'Reliance', price: round100(price * 1.04), color: '#E74C3C' },
    { name: 'Croma', price: round100(price * 1.05), color: '#9B59B6' },
    { name: 'Apple Store', price: original, color: colors.muted },
  ].sort((a, b) => a.price - b.price);

export const SPEND = {
  total: 12000,
  budget: 15000,
  orders: 6,
  savedThisMonth: 1840,
  lifetimeSaved: 6240,
  daysLeft: 12,
  categories: [
    { name: 'Electronics', amount: 8400, color: colors.amazon },
    { name: 'Books', amount: 1800, color: colors.blue },
    { name: 'Clothing', amount: 1200, color: '#9B59B6' },
    { name: 'Stationery', amount: 600, color: colors.muted },
  ],
  recent: [
    { id: 1, emoji: '📚', name: 'NCERT Physics Class 12', date: 'Jul 10', price: 280 },
    { id: 2, emoji: '🎧', name: 'boAt Bassheads 100 Wired', date: 'Jul 7', price: 349 },
    { id: 3, emoji: '💡', name: 'Syska 9W LED Bulb (6-pack)', date: 'Jul 5', price: 399 },
    { id: 4, emoji: '🖊️', name: 'Classmate Notebook (10-pack)', date: 'Jul 3', price: 420 },
    { id: 5, emoji: '📱', name: 'Phone Case, Redmi Note 12', date: 'Jul 1', price: 199 },
    { id: 6, emoji: '⌨️', name: 'Logitech K380 Keyboard', date: 'Jun 28', price: 2499 },
  ],
  monthly: [
    { m: 'Feb', v: 7200 },
    { m: 'Mar', v: 9400 },
    { m: 'Apr', v: 6800 },
    { m: 'May', v: 11200 },
    { m: 'Jun', v: 9600 },
    { m: 'Jul', v: 12000 },
  ],
};
