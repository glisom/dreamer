import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MysticBackground } from '../components/ui/MysticBackground';
import { CelestialCard } from '../components/ui/CelestialCard';
import { useTheme } from '../app/providers/ThemeProvider';
import { useExperience } from '../app/providers/ExperienceProvider';

const HomeScreen: React.FC = () => {
  const { colors, typography } = useTheme();
  const { configureSoundscape, speakMantra, scheduleReminder, database, isDatabaseReady } = useExperience();
  const [experienceCount, setExperienceCount] = useState<number>(0);

  useEffect(() => {
    void configureSoundscape();
  }, [configureSoundscape]);

  useEffect(() => {
    if (!isDatabaseReady) {
      return;
    }
    database.transaction((tx) => {
      tx.executeSql('SELECT COUNT(*) as count FROM experiences', [], (_, result) => {
        const count = result.rows.item(0)?.count ?? 0;
        setExperienceCount(count);
        return true;
      });
    });
  }, [database, isDatabaseReady]);

  const handleSpeak = useCallback(() => {
    speakMantra('Your dreams are guiding you toward luminous horizons.');
  }, [speakMantra]);

  const handleReminder = useCallback(async () => {
    const identifier = await scheduleReminder('Dream Check-in', 'Record your celestial journey.');
    if (!identifier) {
      Alert.alert('Notifications disabled', 'Enable notifications to receive reminders.');
      return;
    }
    Alert.alert('Reminder set', "We'll nudge you shortly.");
  }, [scheduleReminder]);

  return (
    <MysticBackground>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.heading,
            {
              color: colors.text,
              fontFamily: typography.headingFontFamily,
              fontSize: typography.sizes.xl
            }
          ]}
        >
          Welcome to Dreamer
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.mutedText,
              fontSize: typography.sizes.md,
              lineHeight: typography.sizes.md * typography.lineHeights.relaxed
            }
          ]}
        >
          Explore mystical realms, record ethereal experiences, and tune into cosmic
          rhythms.
        </Text>
        <CelestialCard
          title="Astral Journal"
          description="Capture the whispers of your nightly voyages among the stars."
        >
          <View style={styles.cardContent}>
            <Text style={[styles.cardText, { color: colors.text }]}>Entries stored: {experienceCount}</Text>
          </View>
        </CelestialCard>
        <CelestialCard
          title="Celestial Soundscapes"
          description="Immerse yourself in restorative frequencies and resonant harmonies."
        >
          <View style={styles.cardContent}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accent }]} onPress={handleSpeak}>
              <Text style={[styles.actionText, { color: colors.background }]}>Speak mantra</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.accentSecondary }]}
              onPress={handleReminder}
            >
              <Text style={[styles.actionText, { color: colors.background }]}>Set reminder</Text>
            </TouchableOpacity>
          </View>
        </CelestialCard>
      </ScrollView>
    </MysticBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 48
  },
  heading: {
    fontWeight: '700',
    marginBottom: 8
  },
  subtitle: {
    fontWeight: '400',
    marginBottom: 24
  },
  cardContent: {
    marginTop: 12
  },
  cardText: {
    fontWeight: '500'
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginBottom: 12
  },
  actionText: {
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default HomeScreen;
