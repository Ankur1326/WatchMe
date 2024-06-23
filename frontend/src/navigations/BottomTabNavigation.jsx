import { Image, Text, StyleSheet } from "react-native";
import React, { useContext } from "react";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5, FontAwesome6, Feather, AntDesign } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen";
import { useTheme } from 'expo-theme-switcher';
import { UserType } from "../context/UserContext";
import VideoUpload from "../Modal/VideoUpload";

const Tab = createBottomTabNavigator();
const BottomTabNavigation = () => {
    const { currentTheme } = useTheme()
    const [user, setUser] = useContext(UserType);

    return (
        <Tab.Navigator
            screenOptions={() => ({
                tabBarStyle: [
                    styles.tabBar,
                    { backgroundColor: currentTheme?.secondaryBackgroundColor }
                ],
                tabBarActiveTintColor: "#AE7AFF",
                tabBarInactiveTintColor: currentTheme?.primaryTextColor,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIconStyle: styles.tabBarIcon,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text style={[styles.labelText, { color: focused ? "#AE7AFF" : currentTheme?.primaryTextColor }]}>
                            Home
                        </Text>
                    ),
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Ionicons name="home" size={24} color="#AE7AFF" />
                        ) : (
                            <Ionicons name="home-outline" size={24} color={currentTheme?.primaryTextColor} />
                        ),
                }}
            />
            <Tab.Screen
                name="Upload"
                component={VideoUpload}
                options={{
                    tabBarLabel: () => <Text style={styles.hiddenLabel}></Text>,
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <AntDesign name="pluscircle" size={40} color="#AE7AFF" style={styles.uploadIcon} />
                        ) : (
                            <AntDesign name="pluscircleo" size={40} color={currentTheme?.primaryTextColor} style={styles.uploadIcon} />
                        ),
                }}
            />
            <Tab.Screen
                name="You"
                component={ProfileScreen}
                initialParams={{ isOwner: true }}
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text style={[styles.labelText, { color: focused ? "#AE7AFF" : currentTheme?.primaryTextColor }]}>
                            You
                        </Text>
                    ),
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <Image source={{ uri: user.avatar }} style={[styles.avatar, styles.avatarFocused]} />
                        ) : (
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        ),
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
      height: 60,
      paddingVertical: 8,
      borderTopWidth: 0,
      elevation: 5,
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      shadowOffset: { width: 0, height: 2 },
    },
    tabBarLabel: {
      fontSize: 12,
      fontWeight: "bold",
      marginBottom: 4,
    },
    tabBarIcon: {
      marginTop: 5,
    },
    labelText: {
      fontSize: 12,
      fontWeight: "bold",
    },
    hiddenLabel: {
      color: "transparent",
    },
    uploadIcon: {
      height: 40,
      marginTop: 10,
    },
    avatar: {
      width: 26,
      height: 26,
      borderRadius: 13,
    },
    avatarFocused: {
      borderWidth: 2,
      borderColor: "#AE7AFF",
    },
  });

export default BottomTabNavigation