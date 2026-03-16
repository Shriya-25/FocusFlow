export const BRAND = {
  bgStart: '#1B1338',
  bgEnd: '#3B1E6D',
  violet: '#815cf0',
  magenta: '#ff4b8b',
  peach: '#ff9068',
  textDim: '#D1D5DB',
  white20: 'rgba(255, 255, 255, 0.2)',
} as const;

export const getThemeBrand = (darkMode: boolean) => {
  if (darkMode) {
    return BRAND;
  }

  return {
    ...BRAND,
    bgStart: '#31245C',
    bgEnd: '#583D8A',
  } as const;
};
