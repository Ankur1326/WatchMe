import { Image, Pressable, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
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

  const logoutHandler = async () => {
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

      await AsyncStorage.clear()
      // Navigate to the Login screen
      navigation.replace("Login")
    } catch (error) {
      console.log("error while logout user : ", error);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.primaryBackgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.primaryBorderColor }]}>
        {/* Logo */}
        <Image style={styles.logo} source={require("../../assets/logo.jpg")} />
        <Pressable onPress={() => navigation.closeDrawer()}>
          <MaterialIcons name="highlight-remove" size={30} color={currentTheme.primaryTextColor} />
        </Pressable>
      </View>

      <View style={styles.menu}>
        <MenuItem
          onPress={() => navigation.navigate("AdminDashboardScreen")}
          icon={<AntDesign name="dashboard" size={22} color={currentTheme.primaryTextColor} />}
          text="Dashboard"
          textColor={currentTheme.primaryTextColor}
        />
        <MenuItem
          icon={<AntDesign name="like2" size={22} color={currentTheme.primaryTextColor} />}
          text="Liked Video"
          textColor={currentTheme.primaryTextColor}
        />
        <MenuItem
          icon={<Feather name="video" size={22} color={currentTheme.primaryTextColor} />}
          text="My Content"
          textColor={currentTheme.primaryTextColor}
        />
        <MenuItem
          icon={<AntDesign name="questioncircleo" size={22} color={currentTheme.primaryTextColor} />}
          text="Support"
          textColor={currentTheme.primaryTextColor}
        />
        <MenuItem
          icon={<Ionicons name="settings-outline" size={22} color={currentTheme.primaryTextColor} />}
          text="Setting"
          textColor={currentTheme.primaryTextColor}
        />
        
        {/* Theme Switcher */}
        <ThemeSwitcherBtn />
      </View>

      <TouchableOpacity 
        onPress={logoutHandler} 
        style={[
          styles.logoutButton, 
          { backgroundColor: currentTheme.secondaryBackgroundColor }
        ]}
      >
        <SimpleLineIcons name="logout" size={22} color="white" />
        <Text style={styles.logoutText}>LogOut</Text>
      </TouchableOpacity>
    </View>
  )
}

const MenuItem = ({ onPress, icon, text, textColor }) => (
  <Pressable onPress={onPress} style={[styles.menuItem, { borderColor: textColor }]}>
    {icon}
    <Text style={[styles.menuItemText, { color: textColor }]}>{text}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  menu: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
});


export default SidebarNavigation