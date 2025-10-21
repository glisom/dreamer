import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '../../app/providers/ThemeProvider';

type MysticBackgroundProps = {
  children?: React.ReactNode;
};

type Star = {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
};

const STAR_MAP: Star[] = [
  { cx: 8, cy: 12, r: 1.8, opacity: 0.65 },
  { cx: 28, cy: 45, r: 1.2, opacity: 0.5 },
  { cx: 55, cy: 30, r: 1.4, opacity: 0.7 },
  { cx: 72, cy: 18, r: 2, opacity: 0.6 },
  { cx: 86, cy: 55, r: 1.5, opacity: 0.55 },
  { cx: 18, cy: 68, r: 1.1, opacity: 0.45 },
  { cx: 60, cy: 80, r: 1.6, opacity: 0.6 },
  { cx: 92, cy: 32, r: 1.3, opacity: 0.5 }
];

export const MysticBackground: React.FC<MysticBackgroundProps> = ({ children }) => {
  const { colors } = useTheme();

  const gradientColors = useMemo(
    () => [colors.background, colors.overlay, colors.surface],
    [colors.background, colors.overlay, colors.surface]
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        {STAR_MAP.map((star, index) => (
          <Circle
            key={`star-${index}`}
            cx={`${star.cx}%`}
            cy={`${star.cy}%`}
            r={star.r}
            fill={colors.mutedText}
            opacity={star.opacity}
          />
        ))}
      </Svg>
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  }
});
