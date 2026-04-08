import { Home, Briefcase, User } from "lucide-react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import styles, { colors } from "../assets/style/estilo";

import Candidaturas from "./Candidaturas";
import HomeCandidato from "./HomeCandidato";

// Importe quando estiver pronta:
// import PerfilScreen from "./PerfilScreen";

// Placeholder temporário — remova quando criar a tela real
import { View } from "react-native";
const PerfilScreen = () => <View style={{ flex: 1, backgroundColor: colors.background }} />;

const Tab = createBottomTabNavigator();

export function BottomNav() {
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
            <Tab.Screen
                name="home"
                component={HomeCandidato}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ focused, color }) => (
                        <Home
                            size={24}
                            color={color}
                            fill={focused ? colors.primary : "transparent"}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="candidaturas"
                component={Candidaturas}
                options={{
                    tabBarLabel: "Candidaturas",
                    tabBarIcon: ({ focused, color }) => (
                        <Briefcase
                            size={24}
                            color={color}
                            fill={focused ? colors.primary : "transparent"}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="perfil"
                component={PerfilScreen}
                options={{
                    tabBarLabel: "Perfil",
                    tabBarIcon: ({ focused, color }) => (
                        <User
                            size={24}
                            color={color}
                            fill={focused ? colors.primary : "transparent"}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}