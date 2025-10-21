import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../app/providers/ThemeProvider';

type CelestialCardProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export const CelestialCard: React.FC<CelestialCardProps> = ({ title, description, children }) => {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.accentSecondary
        }
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            fontFamily: typography.headingFontFamily,
            fontSize: typography.sizes.lg,
            letterSpacing: typography.letterSpacings.wide
          }
        ]}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            styles.description,
            {
              color: colors.mutedText,
              fontSize: typography.sizes.sm,
              lineHeight: typography.sizes.sm * typography.lineHeights.relaxed
            }
          ]}
        >
          {description}
        </Text>
      ) : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 16
  },
  title: {
    fontWeight: '700',
    marginBottom: 8
  },
  description: {
    fontWeight: '400'
  }
});
