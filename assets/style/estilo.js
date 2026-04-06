import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8edf2",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
  },

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
    color: "#374151",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 5,
    textAlign: "center",
  },

  form: {
    gap: 16,
  },

  inputGroup: {
    gap: 6,
  },

  label: {
    fontSize: 14,
    color: "#374151",
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
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

  buttonPrimary: {
    backgroundColor: "#1e3a4f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
  },

  buttonSecondary: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
  },

  buttonDisabled: {
    backgroundColor: "#ccc",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  buttonTextSecondary: {
    color: "#374151",
    fontWeight: "500",
  },

  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  stepIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  step: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 2,
  },

  stepActive: {
    backgroundColor: "#1e3a4f",
  },

  escolaridadeCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  escolaridadeText: {
    fontSize: 13,
    color: "#374151",
  },

  addButton: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  addButtonText: {
    color: "#374151",
    fontWeight: "500",
  },

  footer: {
    marginTop: 20,
    alignItems: "center",
  },

  footerText: {
    color: "#6b7280",
  },

  footerLink: {
    color: "#1e3a4f",
    fontWeight: "600",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center", 
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fff",
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

  forgotPassword: {
    alignItems: "flex-end",
    marginTop: 4,
  },

  forgotText: {
    fontSize: 14,
    color: "#1e3a4f",
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
    backgroundColor: "#e5e7eb",
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
    color: "#6b7280",
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
    backgroundColor: "#e5e7eb",
    zIndex: 0,
    transform: [{ translateX: -30 }],
  },

  connectorDone: {
    backgroundColor: "#1e3a4f",
  },

  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  circleActive: {
    backgroundColor: "#1e3a4f",
  },

  circleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9ca3af",
  },

  circleTextActive: {
    color: "#fff",
  },

  stepLabel: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 6,
    textAlign: "center",
  },

  stepLabelActive: {
    color: "#1e3a4f",
    fontWeight: "600",
  },

  yearDropdown: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fff",
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
    backgroundColor: "#e8edf2",
  },

  yearOptionText: {
    fontSize: 14,
    color: "#374151",
  },

  yearOptionTextActive: {
    color: "#1e3a4f",
    fontWeight: "600",
  },
});