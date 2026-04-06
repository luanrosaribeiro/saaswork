import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Login from "./views/Login";
import CadastroUser from "./views/CadastroUser";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastrar Usuário" component={CadastroUser} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}