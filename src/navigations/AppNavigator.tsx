import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { MovieDetailScreen } from "../screens/MovieDetailScreen";
import { useTheme } from "../themes/ThemeProvider";
import { SharedPosterProvider } from "./SharedPosterContext";
import { TabNavigator } from "./TabNavigator";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { colors, scheme } = useTheme();

  const navigationTheme: Theme = {
    ...(scheme === "light" ? DefaultTheme : DarkTheme),
    colors: {
      ...(scheme === "light" ? DefaultTheme.colors : DarkTheme.colors),
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <SharedPosterProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen
            name="MovieDetail"
            component={MovieDetailScreen}
            options={{
              animation: "fade",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SharedPosterProvider>
  );
}
