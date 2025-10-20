import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { MysticBackground } from '../components/ui/MysticBackground';
import { CelestialCard } from '../components/ui/CelestialCard';
import { useSettings } from '../app/providers/settingsProvider';
import { useTheme } from '../app/providers/ThemeProvider';

const SettingsScreen: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const { colors, typography } = useTheme();

  const toggleTheme = useCallback(() => {
    void updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark');
  }, [settings.theme, updateSetting]);

  const toggleNotifications = useCallback(() => {
    void updateSetting('notificationsEnabled', !settings.notificationsEnabled);
  }, [settings.notificationsEnabled, updateSetting]);

  const toggleSound = useCallback(() => {
    void updateSetting('soundEnabled', !settings.soundEnabled);
  }, [settings.soundEnabled, updateSetting]);

  return (
    <MysticBackground>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
          Settings
        </Text>
        <CelestialCard title="Appearance" description="Shape how Dreamer reflects your aura.">
          <View style={styles.row}>
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Dark mode</Text>
              <Text style={[styles.caption, { color: colors.mutedText }]}>Toggle celestial glow.</Text>
            </View>
            <Switch
              value={settings.theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ true: colors.accent, false: colors.overlay }}
              thumbColor={colors.card}
            />
          </View>
        </CelestialCard>
        <CelestialCard
          title="Mindful Notifications"
          description="Stay attuned with gentle reminders and cosmic nudges."
        >
          <View style={styles.row}>
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Notifications</Text>
              <Text style={[styles.caption, { color: colors.mutedText }]}>Receive astral updates.</Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ true: colors.accent, false: colors.overlay }}
              thumbColor={colors.card}
            />
          </View>
        </CelestialCard>
        <CelestialCard
          title="Harmonics"
          description="Control immersive resonances and subtle vibrations."
        >
          <View style={styles.row}>
            <View>
              <Text style={[styles.label, { color: colors.text }]}>Soundscape</Text>
              <Text style={[styles.caption, { color: colors.mutedText }]}>Enable audio rituals.</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ true: colors.accentSecondary, false: colors.overlay }}
              thumbColor={colors.card}
            />
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
    marginBottom: 12
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    fontWeight: '600',
    marginBottom: 4
  },
  caption: {
    fontWeight: '400'
  }
});

export default SettingsScreen;
