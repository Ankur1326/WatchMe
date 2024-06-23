import { View, Text, Image, Pressable, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons";
import { useTheme } from 'expo-theme-switcher';

const HeaderComponent = ({ onSearch }) => {
    const { currentTheme } = useTheme()
    const navigation = useNavigation()
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <View style={[styles.headerContainer, {backgroundColor: currentTheme.primaryBackgroundColor}]}>
        {/* Logo */}
        <Image
          style={styles.logo}
          source={require('../../assets/logo.jpg')}
        />
        <View style={styles.searchContainer}>
          {/* Search Input */}
          <TextInput
            placeholder="Search videos..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            style={styles.searchInput}
          />
          {/* Search Icon */}
          <Feather name="search" size={20} color={currentTheme?.primaryTextColor} />
          {/* Menu Icon */}
          <Pressable onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
            <Feather name="menu" size={28} color={currentTheme?.primaryTextColor} />
          </Pressable>
        </View>
      </View>
    )
}
const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderBottomWidth: 1.5,
      borderBottomColor: 'lightgray', // Replace with currentTheme.primaryBorderColor
      backgroundColor: 'white', // Replace with currentTheme.primaryBackgroundColor
    },
    logo: {
      width: 35,
      height: 35,
    },
    searchContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      marginRight: 5,
    },
    searchInput: {
      padding: 10,
      backgroundColor: 'lightgray', // Replace with a color from currentTheme if available
      borderRadius: 5,
      width: '75%',
    },
    menuIcon: {
      padding: 10,
    },
  });

export default HeaderComponent