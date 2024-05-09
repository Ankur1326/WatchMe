import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import DrawerNavigation from "./DrawerNavigation";
import VideoDetailScreen from "../screens/VideoDetailScreen";
import ChannelPlaylistVideoScreen from "../screens/ChannelPlaylistVideoScreen";

const Stack = createNativeStackNavigator();
const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Drawer" component={DrawerNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="VideoDetail" component={VideoDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChannelPlaylistVideosPage" component={ChannelPlaylistVideoScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;