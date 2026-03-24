import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    width: 200,
    height: 100,
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 10,
  },

  form: {
    gap: 20,
  },

  inputGroup: {
    gap: 6,
  },

  label: {
    fontSize: 14,
    color: "#374151",
  },

  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingLeft: 45,
    paddingRight: 45,
    backgroundColor: "#fff",
  },

  iconLeft: {
    position: "absolute",
    left: 12,
  },

  iconRight: {
    position: "absolute",
    right: 12,
  },

  forgotPassword: {
    alignItems: "flex-end",
  },

  forgotText: {
    fontSize: 14,
    color: "#1c3649",
  },

  button: {
    backgroundColor: "#1c3649",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },

  dividerText: {
    color: "#6b7280",
  },

  socialButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  signup: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  signupText: {
    color: "#6b7280",
  },

  signupLink: {
    color: "#1c3649",
    fontWeight: "600",
  },
});