import { createTheme, PaletteMode } from '@mui/material';

// Twitter-inspired colors
const colors = {
  primary: {
    main: '#1DA1F2', // Twitter blue
    light: '#71C9F8',
    dark: '#0C7ABF',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#794BC4', // Purple
    light: '#9B7AD5',
    dark: '#5F3B9E',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#17BF63', // Twitter green
    light: '#55D08B',
    dark: '#0F9A4F',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#E0245E', // Twitter red
    light: '#E95C87',
    dark: '#B01C4A',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FFAD1F', // Twitter orange/amber
    light: '#FFC55C',
    dark: '#D18900',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#1DA1F2', // Twitter blue
    light: '#71C9F8',
    dark: '#0C7ABF',
    contrastText: '#FFFFFF',
  },
};

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode
          primary: colors.primary,
          secondary: colors.secondary,
          success: colors.success,
          error: colors.error,
          warning: colors.warning,
          info: colors.info,
          background: {
            default: '#F7F9FA',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#14171A',
            secondary: '#657786',
          },
          divider: 'rgba(0, 0, 0, 0.12)',
        }
      : {
          // Dark mode
          primary: colors.primary,
          secondary: colors.secondary,
          success: colors.success,
          error: colors.error,
          warning: colors.warning,
          info: colors.info,
          background: {
            default: '#15202B',
            paper: '#192734',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#8899A6',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
        }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0px 2px 4px rgba(0, 0, 0, 0.05)' 
            : '0px 2px 4px rgba(0, 0, 0, 0.2)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: mode === 'light' 
              ? '0px 4px 8px rgba(0, 0, 0, 0.1)' 
              : '0px 4px 8px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 50,
          padding: '6px 16px',
          fontWeight: 500,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
  },
});

export const createAppTheme = (mode: PaletteMode) => {
  return createTheme(getDesignTokens(mode));
};

export default createAppTheme;