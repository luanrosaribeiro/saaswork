// views/BottomNav.tsx
import { Home, Briefcase, User, PlusCircle } from "lucide-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import styles, { colors } from "../assets/style/estilo";
import { useUser } from "../context/UserContext";

import HomeCandidato from "./HomeCandidato";
import HomeInstituicao from "./HomeInstituicao";
import Candidaturas from "./Candidaturas";
import CadastroVaga from "./CadastroVaga";

const PerfilScreen = () => <View style={{ flex: 1, backgroundColor: colors.background }} />;

const Tab = createBottomTabNavigator();

export function BottomNav() {
  const { usuario } = useUser();
  const isAluno = usuario?.tipo === "aluno";

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {/* Home muda conforme o tipo */}
      <Tab.Screen
        name="home"
        component={isAluno ? HomeCandidato : HomeInstituicao}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Home size={24} color={color} fill={focused ? colors.primary : "transparent"} />
          ),
        }}
      />

      {/* Aba condicional */}
      {isAluno ? (
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
      ) : (
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