import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ChannelScreen from "../screens/ChannelScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { UserType } from "../UserContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StackNavigation = () => {



  function BottomTab() {
    const [user, setUser] = useContext(UserType);

    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarLabel: "Home",
          tabBarStyle: { backgroundColor: "black", height: 55},
          tabBarLabelStyle: {fontSize: 12, fontWeight: "bold"},
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="home" size={27} color="#AE7AFF" />
            ) : (
              <Ionicons name="home-outline" size={24} color="white" />
            ),
        }}
        />
        <Tab.Screen name="Channel" component={ChannelScreen} options={{
          tabBarLabel: "Channel",
          tabBarStyle: { backgroundColor: "black", height: 55},
          tabBarLabelStyle: {fontSize: 12, fontWeight: "bold"},
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome5 name="user-alt" size={24} color="#AE7AFF" />
            ) : (
              <FontAwesome5 name="user-alt" size={24} color="white" />
            ),
        }}
        />
        <Tab.Screen name="You" component={ProfileScreen} options={{
          tabBarLabel: "You",
          tabBarStyle: { backgroundColor: "black", height: 55},
          tabBarLabelStyle: {fontSize: 12, fontWeight: "bold"},
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image source={{ uri: user.avatar }} style={{ width: 33, height: 33, borderRadius: 25, borderWidth: 2, borderColor: "white" }} />
              
              // <FontAwesome5 name="user-alt" size={24} color="#AE7AFF" />
              ) : (
                <Image source={{ uri: user.avatar }} style={{ width: 33, height: 33, borderRadius: 25 }} />
            ),
        }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTab} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
