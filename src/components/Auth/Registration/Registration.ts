import { StyleSheet } from 'react-native';
import { ACCENT, DARK_PANEL, IS_WIDE } from './RegistrationUtils';

// ─── Layout / screen styles ───────────────────────────────────────────────────

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ACCENT,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: IS_WIDE ? 'row' : 'column',
    borderRadius: 20,
    overflow: 'visible',
    width: IS_WIDE ? '92%' : '96%',
    maxWidth: 1100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  // ── Left dark panel ──────────────────────────────────────────
  leftPanel: {
    width: IS_WIDE ? 280 : undefined,
    backgroundColor: DARK_PANEL,
    padding: IS_WIDE ? 36 : 24,
    justifyContent: 'space-between',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: IS_WIDE ? 20 : 0,
    borderTopRightRadius: IS_WIDE ? 0 : 20,
  },
  leftTitle: {
    fontSize: IS_WIDE ? 22 : 18,
    fontWeight: '700',
    color: '#fff',
    lineHeight: IS_WIDE ? 30 : 26,
    marginBottom: 10,
  },
  leftSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    marginBottom: 28,
  },
  stepSection: {
    paddingTop: 24,
  },
  stepLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  // ── Right white panel ────────────────────────────────────────
  rightPanel: {
    flex: 1,
    backgroundColor: '#fff',
    padding: IS_WIDE ? 40 : 24,
    borderTopRightRadius: IS_WIDE ? 20 : 0,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: IS_WIDE ? 0 : 20,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a237e',
    letterSpacing: 1,
    marginBottom: 4,
  },
  pageHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151515',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#838383',
    marginBottom: 20,
  },
  // ── Buttons ──────────────────────────────────────────────────
  primaryBtn: {
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 28,
    alignItems: 'center',
    minWidth: 160,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 28,
    alignItems: 'center',
    minWidth: 120,
  },
  outlineBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: ACCENT,
  },
  disabledBtn: {
    backgroundColor: '#c5cae9',
  },
  // ── Footer ───────────────────────────────────────────────────
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: '#838383',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '600',
    color: ACCENT,
  },
  // ── Declaration ──────────────────────────────────────────────
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#aaa',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  checkLabel: {
    flex: 1,
    fontSize: 13,
    color: '#444',
  },
  errorText: {
    fontSize: 11,
    color: '#e53935',
    marginBottom: 8,
  },
  apiError: {
    fontSize: 13,
    color: '#e53935',
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  btnRowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
});

// ─── Step indicator styles ────────────────────────────────────────────────────

export const stepStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  item: {
    alignItems: 'center',
    width: 90,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circleActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  circleText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  circleTextActive: {
    color: ACCENT,
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  labelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  line: {
    flex: 1,
    height: 2,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  lineActive: {
    backgroundColor: '#fff',
  },
});

// ─── Section heading styles ───────────────────────────────────────────────────

export const sectionStyles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f5',
    paddingBottom: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a237e',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});

export const radioStyles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    gap: 20,
    height: 50,
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  circleActive: {
    borderColor: ACCENT,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ACCENT,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  labelActive: {
    color: ACCENT,
    fontWeight: '600',
  },
});
