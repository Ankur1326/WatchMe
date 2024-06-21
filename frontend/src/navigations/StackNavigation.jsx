import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import DrawerNavigation from "./DrawerNavigation";
import VideoDetailScreen from "../screens/VideoDetailScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChannelScreen from "../screens/ChannelScreen";
import PlaylistVideosScreen from "../screens/PlaylistVideosScreen";

const Stack = createNativeStackNavigator();
const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Drawer" component={DrawerNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="VideoDetail" component={VideoDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChannelPlaylistVideosPage" component={PlaylistVideosScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Channel" component={ChannelScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;