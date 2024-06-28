import { View, Image, Pressable, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons";
import { useTheme } from 'expo-theme-switcher';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HeaderComponent = ({ onSearch }) => {
  const { currentTheme } = useTheme()
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState('');
  const [isCloseShow, setCloseShow] = useState(false);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    onSearch(query);
    setCloseShow(true)
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
          onChangeText={(text) => setSearchQuery(text)}
          style={[styles.searchInput, { backgroundColor: currentTheme.secondaryBackgroundColor, color: currentTheme.primaryTextColor }]}
          placeholderTextColor={currentTheme.secondaryTextColor}
        />
        {/* Search Icon */}
        {/* {
          searchQuery ? */}
        {/* <TouchableOpacity onPress={() => {
              setSearchQuery("")
              handleSearchChange()
            }}>
              <Ionicons name="close" size={28} color={currentTheme.primaryTextColor} />
            </TouchableOpacity> */}
        {/* : */}
        <TouchableOpacity onPress={() => handleSearchChange(searchQuery)}>
          <Feather name="search" size={22} color={currentTheme.primaryTextColor} style={styles.searchIcon} />
        </TouchableOpacity>
        {/* 
        } */}



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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    elevation: 5,
    shadowColor: '#000',
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
    backgroundColor: '#444',
    borderRadius: 25,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 15,
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