import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './Appcontext';
import { colors } from './Theme';
import DashboardScreen from './Dashboardscreen';
import ProductScreen from './Productscreen';
import AlertsScreen from './Alertsscreen';
import SpendScreen from './Spendscreen';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.surface,
    border: colors.border,
    primary: colors.accent,
    text: colors.text,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar barStyle="light-content" />
          <Tab.Navigator
            screenOptions={() => ({
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: '800' },
              tabBarActiveTintColor: colors.accent,
              tabBarInactiveTintColor: colors.muted,
              tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
            })}
          >
            <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'PriceHawk' }} />
            <Tab.Screen name="Product" component={ProductScreen} options={{ title: 'Price history' }} />
            <Tab.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Price alerts' }} />
            <Tab.Screen name="Spend" component={SpendScreen} options={{ title: 'Spend Lens' }} />
          </Tab.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
