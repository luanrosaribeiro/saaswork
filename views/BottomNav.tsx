// views/BottomNav.tsx
import { useEffect, useState } from "react";
import { Home, Briefcase, User, PlusCircle } from "lucide-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, Text, View } from "react-native";
import styles, { colors } from "../assets/style/estilo";
import { useUser } from "../context/UserContext";
import { AuthService } from "../services/AuthService";

import HomeCandidato from "./HomeCandidato";
import HomeInstituicao from "./HomeInstituicao";
import Candidaturas from "./Candidaturas";
import CadastroVaga from "./CadastroVaga";

const PerfilScreen = () => <View style={{ flex: 1, backgroundColor: colors.background }} />;

const Tab = createBottomTabNavigator();

export function BottomNav() {
  const { usuario, setUsuario } = useUser();
  const [loadingPerfil, setLoadingPerfil] = useState(!usuario);

  useEffect(() => {
    async function carregarPerfil() {
      if (usuario) {
        setLoadingPerfil(false);
        return;
      }

      const usuarioAtual = AuthService.usuarioAtual();

      if (!usuarioAtual?.uid) {
        setLoadingPerfil(false);
        return;
      }

      try {
        const perfil = await AuthService.buscarPerfil(usuarioAtual.uid);
        setUsuario(perfil);
      } finally {
        setLoadingPerfil(false);
      }
    }

    carregarPerfil();
  }, [setUsuario, usuario]);

  if (loadingPerfil || !usuario) {
    return (
      <View
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center", gap: 12 },
        ]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.emptySubtitle}>Carregando perfil...</Text>
      </View>
    );
  }

  const isAluno = usuario?.tipo === "aluno";

  return (
    <Tab.Navigator
      key={usuario.tipo}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {isAluno ? (
        <>
          <Tab.Screen
            name="home-candidato"
            component={HomeCandidato}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ focused, color }) => (
                <Home size={24} color={color} fill={focused ? colors.primary : "transparent"} />
              ),
            }}
          />
          <Tab.Screen
            name="candidaturas"
            component={Candidaturas}
            options={{
              tabBarLabel: "Candidaturas",
              tabBarIcon: ({ focused, color }) => (
                <Briefcase size={24} color={color} fill={focused ? colors.primary : "transparent"} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="home-instituicao"
            component={HomeInstituicao}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ focused, color }) => (
                <Home size={24} color={color} fill={focused ? colors.primary : "transparent"} />
              ),
            }}
          />
          <Tab.Screen
            name="CadastroVaga"
            component={CadastroVaga}
            options={{
              tabBarLabel: "Nova Vaga",
              tabBarIcon: ({ focused, color }) => (
                <PlusCircle size={24} color={color} fill={focused ? colors.primary : "transparent"} />
              ),
            }}
          />
        </>
      )}

      {/* Perfil — igual para todos */}
      <Tab.Screen
        name="perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ focused, color }) => (
            <User size={24} color={color} fill={focused ? colors.primary : "transparent"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
