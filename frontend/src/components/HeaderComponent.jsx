import { View, Text, Image, Pressable, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons";
import { useTheme } from 'expo-theme-switcher';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HeaderComponent = ({ onSearch }) => {
  const { currentTheme } = useTheme()
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: currentTheme.primaryBackgroundColor }]}>
      {/* Logo */}
      <Image style={styles.logo} source={require('../../assets/logo.jpg')} />
      <View style={styles.searchContainer}>
        {/* Search Input */}
        <TextInput
          placeholder="Search videos..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={[styles.searchInput, { backgroundColor: currentTheme.secondaryBackgroundColor, color: currentTheme.primaryTextColor }]}
          placeholderTextColor={currentTheme.secondaryTextColor}
        />
        {/* Search Icon */}
        <TouchableOpacity>

          <Feather name="search" size={20} color={currentTheme.primaryTextColor} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      {/* Menu Icon */}
      <Pressable onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
        <Feather name="menu" size={28} color={currentTheme.primaryTextColor} />
      </Pressable>
    </View>
  )
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: 'lightgray', // Replace with currentTheme.primaryBorderColor
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#444', // Replace with currentTheme.secondaryBackgroundColor
    borderRadius: 25,
    // paddingHorizontal: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: "gray"

  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 25,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 5,
  },
  menuIcon: {
    padding: 10,
  },
});

export default HeaderComponent