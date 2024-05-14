import { Image } from "react-native";
import React, { useContext } from "react";
import HomeScreen from "../screens/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ChannelScreen from "../screens/ChannelScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen";
import { UserType } from "../UserContext";
import { useTheme } from 'expo-theme-switcher';


const Tab = createBottomTabNavigator();
const BottomTabNavigation = () => {
    const { currentTheme } = useTheme()
    const [user, setUser] = useContext(UserType);

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: "Home",
                tabBarStyle: { backgroundColor: currentTheme?.secondaryBackgroundColor, height: 55, },
                tabBarLabelStyle: { fontSize: 12, fontWeight: "bold", color: currentTheme?.primaryTextColor },
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Ionicons name="home" size={27} color="#AE7AFF" />
                    ) : (
                        <Ionicons name="home-outline" size={24} color={currentTheme?.primaryTextColor} />
                    ),
            }}
            />
            <Tab.Screen name="Channel" component={ChannelScreen} options={{
                tabBarLabel: "Channel",
                tabBarStyle: { backgroundColor: currentTheme?.secondaryBackgroundColor, height: 55 },
                tabBarLabelStyle: { fontSize: 12, fontWeight: "bold", color: currentTheme?.primaryTextColor },
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <FontAwesome5 name="user-alt" size={24} color="#AE7AFF" />
                    ) : (
                        <FontAwesome5 name="user-alt" size={24} color={currentTheme?.primaryTextColor} />
                    ),
            }}
            />
            <Tab.Screen name="You" component={ProfileScreen} options={{
                tabBarLabel: "You",
                tabBarStyle: { backgroundColor: currentTheme?.secondaryBackgroundColor, height: 55 },
                tabBarLabelStyle: { fontSize: 12, fontWeight: "bold", color: currentTheme?.primaryTextColor },
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Image source={{ uri: user.avatar }} style={{ width: 33, height: 33, borderRadius: 25, borderWidth: 2, borderColor: "white" }} />
                    ) : (
                        <Image source={{ uri: user.avatar }} style={{ width: 33, height: 33, borderRadius: 25 }} />
                    ),
            }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation