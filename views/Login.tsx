import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Eye, EyeOff, Mail, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../assets/style/estilo";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigation = useNavigation<any>();

  const handleLogin = () => {
    console.log("Login:", { email, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>
              Encontre seu estágio ideal
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>

              <View style={styles.inputWrapper}>
                <Mail size={20} color="#9ca3af" />

                <TextInput
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>

              <View style={styles.inputWrapper}>
                <Lock size={20} color="#9ca3af" />

                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9ca3af" />
                  ) : (
                    <Eye size={20} color="#9ca3af" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Não tem uma conta?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Cadastrar Usuário")}>
                <Text style={styles.footerLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}