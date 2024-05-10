import 'react-native-gesture-handler';
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import StackNavigation, { MenuDrawer } from "./navigations/StackNavigation";
import { UserContext } from "./UserContext";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigation from './navigations/DrawerNavigation';
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ThemeProvider } from 'expo-theme-switcher';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { ThemeProvider } from "../npm-package/ThemeSwitcherProvider.ts"


export default function App() {
  // const navigation = useNavigation()


  // light theme colors
  const lightTheme = {
    primaryBackgroundColor: "white",
    secondaryBackgroundColor: "#c7c7c7",
    primaryTextColor: "#000",
    secondaryTextColor: "",
    primaryBorderColor: "black",
    secondaryBorderColor: "gray",
  }

  // dark theme colors
  const darkTheme = {
    primaryBackgroundColor: "#020617",
    secondaryBackgroundColor: "#121212",
    primaryTextColor: "#fff",
    secondaryTextColor: "#cccccc",
    primaryBorderColor: "white",
    secondaryBorderColor: "gray",
  }

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}} >
        <UserContext>
          <ThemeProvider light={lightTheme} dark={darkTheme}>
            <StatusBar barStyle="light-content" />
            <StackNavigation />
          </ThemeProvider>
        </UserContext>
      </GestureHandlerRootView>
    </>
  );
}
