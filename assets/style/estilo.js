import { StyleSheet } from "react-native";

// ─── Design tokens ────────────────────────────────────────────────────────────
export const colors = {
  primary: "#1e3a4f",
  primaryLight: "#2d4f68",
  background: "#e8edf2",
  white: "#fff",
  border: "#e5e7eb",
  labelDark: "#374151",
  labelMuted: "#6b7280",
  placeholder: "#9ca3af",
  tabInactive: "#9ca3af",
  cardBg: "#f9fafb",
  inputBg: "#f3f4f6",
};

export default StyleSheet.create({
  // ── Layout base ─────────────────────────────────────────────────────────────

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
  },

  // ── Logo / cabeçalho ─────────────────────────────────────────────────────────

  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    width: 160,
    height: 80,
    resizeMode: "contain",
  },

  title: {
    fontSize: 20,
    textAlign: "center",
    color: colors.labelDark,
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 14,
    color: colors.labelMuted,
    marginTop: 5,
    textAlign: "center",
  },

  // ── Formulário ───────────────────────────────────────────────────────────────

  form: {
    gap: 16,
  },

  inputGroup: {
    gap: 6,
  },

  label: {
    fontSize: 14,
    color: colors.labelDark,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: colors.white,
  },

  inputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },

  inputHalf: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    overflow: "hidden",
  },

  iconLeft: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },

  iconRight: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },

  // ── Botões ───────────────────────────────────────────────────────────────────

  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
  },

  buttonSecondary: {
    backgroundColor: colors.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
  },

  buttonDisabled: {
    backgroundColor: "#ccc",
  },

  buttonText: {
    color: colors.white,
    fontWeight: "600",
  },

  buttonTextSecondary: {
    color: colors.labelDark,
    fontWeight: "500",
  },

  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  // ── Step indicator ───────────────────────────────────────────────────────────

  stepIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  step: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },

  stepActive: {
    backgroundColor: colors.primary,
  },

  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  stepItem: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },

  connector: {
    flex: 1,
    position: "absolute",
    top: 18,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.border,
    zIndex: 0,
    transform: [{ translateX: -30 }],
  },

  connectorDone: {
    backgroundColor: colors.primary,
  },

  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  circleActive: {
    backgroundColor: colors.primary,
  },

  circleText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.placeholder,
  },

  circleTextActive: {
    color: colors.white,
  },

  stepLabel: {
    fontSize: 11,
    color: colors.placeholder,
    marginTop: 6,
    textAlign: "center",
  },

  stepLabelActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  // ── Dropdowns (Year / Nivel / Estado) ────────────────────────────────────────

  yearDropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginTop: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  yearOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  yearOptionActive: {
    backgroundColor: colors.background,
  },

  yearOptionText: {
    fontSize: 14,
    color: colors.labelDark,
  },

  yearOptionTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  // ── Escolaridade ─────────────────────────────────────────────────────────────

  escolaridadeCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },

  escolaridadeText: {
    fontSize: 13,
    color: colors.labelDark,
  },

  addButton: {
    backgroundColor: colors.inputBg,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

  addButtonText: {
    color: colors.labelDark,
    fontWeight: "500",
  },

  removeButton: {
    padding: 4,
    marginTop: 2,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.labelDark,
    marginBottom: 4,
  },

  // ── UserTypeSelection ────────────────────────────────────────────────────────

  userTypeContainer: {
    gap: 16,
    paddingVertical: 8,
  },

  userTypeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.labelDark,
    textAlign: "center",
    marginBottom: 4,
  },

  userTypeSubtitle: {
    fontSize: 14,
    color: colors.labelMuted,
    textAlign: "center",
    marginBottom: 8,
  },

  userTypeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    backgroundColor: "#fafafa",
  },

  userTypeIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  userTypeCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 2,
  },

  userTypeCardDesc: {
    fontSize: 13,
    color: colors.labelMuted,
  },

  // ── Misc ─────────────────────────────────────────────────────────────────────

  footer: {
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  footerText: {
    color: colors.labelMuted,
  },

  footerLink: {
    color: colors.primary,
    fontWeight: "600",
  },

  forgotPassword: {
    alignItems: "flex-end",
    marginTop: 4,
  },

  forgotText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
    color: colors.labelMuted,
  },

  // ── Bottom Tab Bar ────────────────────────────────────────────────────────────

  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },

  tabBarItem: {
    gap: 2,
  },

  tabBarLabel: {
    fontSize: 11,
    fontWeight: "500",
  },

  // ── Screen header (telas internas) ───────────────────────────────────────────

  screenHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  screenHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.labelDark,
  },

  screenHeaderSubtitle: {
    fontSize: 13,
    color: colors.labelMuted,
    marginTop: 2,
  },

  screenContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // ── Estado vazio ─────────────────────────────────────────────────────────────

  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.labelDark,
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 13,
    color: colors.labelMuted,
    textAlign: "center",
  },

  // ── Card de candidatura ───────────────────────────────────────────────────────

  candidaturaCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  candidaturaCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },

  candidaturaTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.labelDark,
  },

  candidaturaMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  candidaturaMetaText: {
    fontSize: 13,
    color: colors.labelMuted,
  },

  candidaturaMetaMuted: {
    fontSize: 13,
    color: colors.placeholder,
  },

  candidaturaCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  candidaturaDate: {
    fontSize: 12,
    color: colors.placeholder,
  },

  candidaturaDetailLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },

  // ── Badge de status ───────────────────────────────────────────────────────────

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // ── HomeScreen header ─────────────────────────────────────────────────────────

  homeHeader: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  homeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bellButton: {
    position: "relative",
    padding: 4,
  },

  bellBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ef4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  bellBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.labelDark,
  },

  // ── JobCard ───────────────────────────────────────────────────────────────────

  jobCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    gap: 10,
  },

  jobCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  jobTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.labelDark,
  },

  jobMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  jobMetaText: {
    fontSize: 13,
    color: colors.labelMuted,
  },

  jobDescription: {
    fontSize: 13,
    color: colors.labelMuted,
    lineHeight: 19,
  },

  jobTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  jobTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  jobTagText: {
    fontSize: 11,
    color: colors.labelMuted,
  },

  jobCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  jobPublishedAt: {
    fontSize: 12,
    color: colors.placeholder,
  },

  candidatarButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },

  candidatarButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },

  // ── App header (header global escuro com marca) ───────────────────────────────

  appHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  appHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 2,
  },

  appHeaderSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },

  // ── Page title card (card branco de título de tela) ───────────────────────────

  pageTitleCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
});