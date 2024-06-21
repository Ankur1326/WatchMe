import { View, Text, Image, Pressable, TextInput } from 'react-native'
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
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 5, borderBottomWidth: 1.5, borderBottomColor: currentTheme.primaryBorderColor, backgroundColor: currentTheme.primaryBackgroundColor }} >
            {/* Logo  */}
            <Image style={{ width: 35, height: 35 }} source={require("../../assets/logo.jpg")} />
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginRight: 5 }} >
                <TextInput
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    style={{padding: 10, backgroundColor: 'lightgray', borderRadius: 5, width: "75%"}}
                />
                <Feather name="search" size={20} color={currentTheme?.primaryTextColor} />
                <Pressable onPress={() => navigation.openDrawer()} >
                    <Feather name="menu" size={28} color={currentTheme?.primaryTextColor} />
                </Pressable>
            </View>
        </View>
    )
}

export default HeaderComponent