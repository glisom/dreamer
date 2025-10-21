export const mysticPalette = {
  abyss: '#05040f',
  eclipse: '#0d0a1f',
  twilight: '#1b1740',
  nebula: '#2f295b',
  aurora: '#5b4f9f',
  starlight: '#c1b4ff',
  moonstone: '#f5f2ff',
  comet: '#ffd166',
  pulsar: '#ff6f91',
  nova: '#00d3ff',
  verdant: '#4ade80',
  warning: '#facc15',
  ember: '#f87171'
} as const;

export type Palette = typeof mysticPalette;

export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  overlay: string;
  text: string;
  mutedText: string;
  accent: string;
  accentSecondary: string;
  border: string;
  highlight: string;
  success: string;
  warning: string;
  error: string;
  palette: Palette;
};

export const darkThemeColors: ThemeColors = {
  background: mysticPalette.abyss,
  surface: 'rgba(13, 10, 31, 0.8)',
  card: mysticPalette.twilight,
  overlay: 'rgba(5, 4, 15, 0.6)',
  text: mysticPalette.moonstone,
  mutedText: mysticPalette.starlight,
  accent: mysticPalette.comet,
  accentSecondary: mysticPalette.pulsar,
  border: 'rgba(193, 180, 255, 0.24)',
  highlight: mysticPalette.aurora,
  success: mysticPalette.verdant,
  warning: mysticPalette.warning,
  error: mysticPalette.ember,
  palette: mysticPalette
};

export const lightThemeColors: ThemeColors = {
  background: '#f8f8ff',
  surface: 'rgba(255, 255, 255, 0.85)',
  card: '#ffffff',
  overlay: 'rgba(225, 223, 255, 0.65)',
  text: mysticPalette.eclipse,
  mutedText: '#4b4b77',
  accent: mysticPalette.aurora,
  accentSecondary: mysticPalette.pulsar,
  border: 'rgba(91, 79, 159, 0.3)',
  highlight: mysticPalette.nova,
  success: mysticPalette.verdant,
  warning: mysticPalette.warning,
  error: mysticPalette.ember,
  palette: mysticPalette
};
