export type FontWeights = {
  regular: '400';
  medium: '500';
  semiBold: '600';
  bold: '700';
};

export type TypographyScale = {
  fontFamily: string;
  headingFontFamily: string;
  weights: FontWeights;
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  lineHeights: {
    tight: number;
    snug: number;
    relaxed: number;
  };
  letterSpacings: {
    normal: number;
    wide: number;
  };
};

export const typography: TypographyScale = {
  fontFamily: 'System',
  headingFontFamily: 'System',
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700'
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36
  },
  lineHeights: {
    tight: 1.1,
    snug: 1.3,
    relaxed: 1.6
  },
  letterSpacings: {
    normal: 0,
    wide: 0.8
  }
};
