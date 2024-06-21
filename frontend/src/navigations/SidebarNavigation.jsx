import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { base_url } from '../helper/helper';
import { ThemeSwitcherBtn, useTheme } from 'expo-theme-switcher';
import { useNavigation } from '@react-navigation/native';

const SidebarNavigation = ({ navigation }) => {
  const { currentTheme } = useTheme()
  // const navigation = useNavigation()

  const logoutHandleer = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const accessToken = await AsyncStorage.getItem("accessToken")

      // Include the token in the Authorization header
      await axios.post(`${base_url}/users/logout`, {}, {
        headers: {
          Authorization: `${accessToken}`,
        }
      })

      // Remove the token from AsyncStorage

      await AsyncStorage.removeItem("accessToken")
      // Navigate to the Login screen
      navigation.replace("Login")
    } catch (error) {
      console.log("error while logout user : ", error);
    }
  }

  return (
    <View style={{ backgroundColor: currentTheme.primaryBackgroundColor, flex: 1 }} >
      {/* header  */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 9, borderBottomWidth: 1.5, borderBottomColor: currentTheme.primaryBorderColor }} >
        {/* Logo  */}
        <Image style={{ width: 40, height: 40 }} source={require("../../assets/logo.jpg")} />
        <Pressable>
          <MaterialIcons onPress={() => navigation.closeDrawer()} name="highlight-remove" size={30} color={currentTheme?.primaryTextColor} />
        </Pressable>
      </View>

      <View style={{ flexDirection: "column", gap: 10, marginTop: 16 }}>
        <Pressable onPress={() => navigation.navigate("AdminDashboardScreen")} style={{ borderWidth: 0.4, borderColor: currentTheme?.primaryBorderColor, marginHorizontal: 16, paddingVertical: 8, paddingHorizontal: 10, flexDirection: "row", alignItems: 'center', gap: 13 }} >
          <AntDesign name="dashboard" size={22} color={currentTheme.primaryTextColor} />
          <Text style={{ color: currentTheme.primaryTextColor, fontSize: 15 }} >Dashboard</Text>
        </Pressable>
        <Pressable style={{ borderWidth: 0.4, borderColor: currentTheme?.primaryBorderColor, marginHorizontal: 16, paddingVertical: 8, paddingHorizontal: 10, flexDirection: "row", alignItems: 'center', gap: 13 }} >
          <AntDesign name="like2" size={22} color={currentTheme.primaryTextColor} />
          <Text style={{ color: currentTheme.primaryTextColor, fontSize: 15 }} >Liked Video</Text>
        </Pressable>
        <Pressable style={{ borderWidth: 0.4, borderColor: currentTheme?.primaryBorderColor, marginHorizontal: 16, paddingVertical: 8, paddingHorizontal: 10, flexDirection: "row", alignItems: 'center', gap: 13 }} >
          <Feather name="video" size={22} color={currentTheme.primaryTextColor} />
          <Text style={{ color: currentTheme.primaryTextColor, fontSize: 15 }} >My Content</Text>
        </Pressable>
        <Pressable style={{ borderWidth: 0.4, borderColor: currentTheme?.primaryBorderColor, marginHorizontal: 16, paddingVertical: 8, paddingHorizontal: 10, flexDirection: "row", alignItems: 'center', gap: 13 }} >
          <AntDesign name="questioncircleo" size={22} color={currentTheme.primaryTextColor} />
          <Text style={{ color: currentTheme.primaryTextColor, fontSize: 15 }} >Support</Text>
        </Pressable>
        <Pressable style={{ borderWidth: 0.4, borderColor: currentTheme?.primaryBorderColor, marginHorizontal: 16, paddingVertical: 8, paddingHorizontal: 10, flexDirection: "row", alignItems: 'center', gap: 13 }} >
          <Ionicons name="settings-outline" size={22} color={currentTheme.primaryTextColor} />
          <Text style={{ color: currentTheme.primaryTextColor, fontSize: 15 }} >Setting</Text>
        </Pressable>

        {/* <ToggleDarkModeTheme /> */}
        {/* <View style={{ paddingHorizontal: 20, borderWidth: 1, borderColor: "yellow" }}> */}
          <ThemeSwitcherBtn  />
        {/* </View> */}
      </View>

      <TouchableOpacity onPress={() => logoutHandleer()} style={{ backgroundColor: currentTheme.secondaryBackgroundColor, marginHorizontal: 16, paddingVertical: 8, paddingHorizontal: 10, flexDirection: "row", alignItems: 'center', gap: 13, position: 'absolute', bottom: 20, width: "90%" }} >
        <SimpleLineIcons name="logout" size={22} color="white" />
        <Text style={{ color: "white", fontSize: 15 }} >LogOut</Text>
      </TouchableOpacity>

    </View>
  )
}

export default SidebarNavigation