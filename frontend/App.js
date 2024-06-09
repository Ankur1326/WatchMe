import 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ThemeProvider } from 'expo-theme-switcher';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useSelector } from "react-redux"
import StackNavigation from './src/navigations/StackNavigation';
import { UserContext } from './src/context/UserContext';
import { store } from './src/store/store';
// import { ThemeProvider } from "../npm-package/ThemeSwitcherProvider.ts"
import { ModalPortal } from "react-native-modals";
import PopupMessage from './src/components/PopupMessage';
import { useState } from 'react';

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
      <GestureHandlerRootView style={{ flex: 1 }} >
        <UserContext>
          <ThemeProvider light={lightTheme} dark={darkTheme}>
            <StatusBar barStyle="light-content" />
            <Provider store={store}>
              <StackNavigation />
              <ModalPortal />
            </Provider>
          </ThemeProvider>
        </UserContext>
      </GestureHandlerRootView>
    </>
  );
}
