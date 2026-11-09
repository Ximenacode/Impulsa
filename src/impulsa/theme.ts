import { createMuiTheme } from '@material-ui/core';
import { esES } from '@material-ui/core/locale';

export const tokens = {
  color: { canvas: '#EEEDE9', surface: '#FFFFFF', ink: '#272925', muted: '#666960', nav: '#272925', primary: '#292D29', actionInk: '#FFFFFF', soft: '#E5EDE2', border: '#E1E3DC', controlBorder: '#868B80', error: '#A03B42' },
  radius: 14, space: 8,
};
export const theme = createMuiTheme({
  palette: {
    primary: { main: tokens.color.primary, dark: '#41483F', light: tokens.color.soft, contrastText: tokens.color.actionInk },
    secondary: { main: tokens.color.nav, contrastText: '#fff' }, error: { main: tokens.color.error },
    background: { default: tokens.color.canvas, paper: tokens.color.surface },
    text: { primary: tokens.color.ink, secondary: tokens.color.muted }, divider: tokens.color.border,
  },
  shape: { borderRadius: tokens.radius }, spacing: tokens.space,
  typography: { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 14,
    button: { textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', letterSpacing: '0' },
    h6: { fontSize: '1.375rem', fontWeight: 600, lineHeight: 1.4 },
  },
  props: { MuiButton: { disableElevation: true }, MuiTextField: { variant: 'outlined' } },
  overrides: {
    MuiButton: {
      root: { minHeight: 42, padding: '10px 18px', borderRadius: 13 }, text: { padding: '8px 10px' },
      containedPrimary: { '&:hover': { backgroundColor: '#41483F', color: '#fff' }, '&:active': { backgroundColor: '#1F241C', color: '#fff' } },
      textPrimary: { color: '#496343', '&:hover': { backgroundColor: '#EDF2E8' } },
      outlinedPrimary: { color: '#496343', borderColor: '#96A58A', '&:hover': { backgroundColor: '#EDF2E8', borderColor: '#496343' } },
    },
    MuiPaper: { outlined: { borderColor: tokens.color.border } },
    MuiOutlinedInput: { root: { backgroundColor: '#fff' }, notchedOutline: { borderColor: tokens.color.controlBorder } },
    MuiInputLabel: { root: { color: '#626B5C', '&$focused': { color: '#496343' } } },
    MuiFormHelperText: { root: { fontSize: 13, lineHeight: 1.5, marginTop: 7 } },
    MuiChip: { root: { borderRadius: 20, backgroundColor: '#EDF1E8', color: '#5D6D51', fontSize: 12, fontWeight: 400 }, sizeSmall: { height: 25 } },
    MuiTab: { root: { textTransform: 'none', minHeight: 46, fontWeight: 500, fontSize: 13 } },
    MuiTabs: { indicator: { height: 2, borderRadius: 2, backgroundColor: '#778D70' } },
    MuiDialog: { paper: { borderRadius: 20, border: `1px solid ${tokens.color.border}`, boxShadow: '0 14px 44px rgba(39,41,37,.12)' }, paperWidthSm: { maxWidth: 680 } },
    MuiDialogTitle: { root: { padding: '26px 28px 14px', borderBottom: `1px solid ${tokens.color.border}` } },
    MuiDialogContent: { root: { padding: '20px 28px 26px' } },
    MuiDialogActions: { root: { padding: '18px 28px', borderTop: `1px solid ${tokens.color.border}`, flexWrap: 'wrap', gap: 8, backgroundColor: '#FAFBF8' } },
    MuiSnackbarContent: { root: { backgroundColor: tokens.color.nav, color: '#fff', borderLeft: '4px solid #A8BE98' } },
    MuiAvatar: { colorDefault: { color: '#496343', backgroundColor: tokens.color.soft } },
  },
}, esES);
