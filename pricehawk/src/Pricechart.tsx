import React, { useState } from 'react';
import { View, Text, type GestureResponderEvent } from 'react-native';
import Svg, { Polyline, Polygon, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, inr, ui } from './Theme';

// Touch and drag on the chart to read the price at any point
type PriceChartProps = { data: number[]; height?: number };

export default function PriceChart({ data, height = 180 }: PriceChartProps) {
  const [w, setW] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const pad = 10;

  const min = Math.min(...data) - 2000;
  const max = Math.max(...data) + 2000;
  const x = (i: number) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const y = (v: number) => height - pad - ((v - min) / (max - min)) * (height - pad * 2);

  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const area = `${x(0)},${height} ${points} ${x(data.length - 1)},${height}`;

  const pick = (e: GestureResponderEvent) => {
    const i = Math.round(((e.nativeEvent.locationX - pad) / (w - pad * 2)) * (data.length - 1));
    setActive(Math.max(0, Math.min(data.length - 1, i)));
  };

  const shown = active === null ? data[data.length - 1] : data[active];

  return (
    <View>
      <Text style={[ui.muted, { marginBottom: 6 }]}>
        {active === null ? 'Touch and drag the chart. Latest price:' : 'Price at this point:'}{' '}
        <Text style={{ color: colors.accent, fontWeight: '800' }}>{inr(shown)}</Text>
      </Text>

      <View
        style={{ height }}
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={pick}
        onResponderMove={pick}
        onResponderRelease={() => setActive(null)}
      >
        {w > 0 && (
          <View pointerEvents="none">
            <Svg width={w} height={height}>
              <Defs>
                <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={colors.accent} stopOpacity="0.25" />
                  <Stop offset="1" stopColor={colors.accent} stopOpacity="0" />
                </LinearGradient>
              </Defs>
              {[0.25, 0.5, 0.75].map((f) => (
                <Line
                  key={f}
                  x1={pad}
                  x2={w - pad}
                  y1={pad + f * (height - pad * 2)}
                  y2={pad + f * (height - pad * 2)}
                  stroke={colors.border}
                  strokeDasharray="4,4"
                />
              ))}
              <Polygon points={area} fill="url(#fill)" />
              <Polyline points={points} fill="none" stroke={colors.accent} strokeWidth="2.5" strokeLinejoin="round" />
              {active !== null && (
                <>
                  <Line x1={x(active)} x2={x(active)} y1={0} y2={height} stroke={colors.muted} strokeDasharray="3,3" />
                  <Circle cx={x(active)} cy={y(data[active])} r="5" fill={colors.bg} stroke={colors.accent} strokeWidth="2" />
                </>
              )}
            </Svg>
          </View>
        )}
      </View>

      <View style={[ui.row, { justifyContent: 'space-between', marginTop: 6 }]}>
        <Text style={ui.muted}>Low {inr(Math.min(...data))}</Text>
        <Text style={ui.muted}>High {inr(Math.max(...data))}</Text>
      </View>
    </View>
  );
}
