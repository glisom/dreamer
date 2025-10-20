import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from './src/app/providers';
import { useTheme } from './src/app/providers/ThemeProvider';
import RootNavigator from './src/navigation/RootNavigator';

const AppNavigation: React.FC = () => {
  const { navigationTheme, statusBarStyle } = useTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={statusBarStyle} translucent backgroundColor="transparent" />
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App(): JSX.Element {
  return (
    <AppProviders>
      <AppNavigation />
    </AppProviders>
  );
}
