import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "./context/UserContext";
import { BottomNav } from "./views/BottomNav";
import Login from "./views/Login";
import CadastroUser from "./views/CadastroUser";
import HomeCandidato from "./views/HomeCandidato";
import HomeInstituicao from "./views/HomeInstituicao";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastrar Usuário" component={CadastroUser} />
            <Stack.Screen
              name="HomeCandidato"
              component={HomeCandidato}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="HomeInstituicao"
              component={HomeInstituicao}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="Main"
              component={BottomNav}
              options={{ gestureEnabled: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}
