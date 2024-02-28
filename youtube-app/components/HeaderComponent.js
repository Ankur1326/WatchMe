import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons";


const HeaderComponent = () => {
    const navigation = useNavigation()
    
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 9, borderBottomWidth: 1.5, borderBottomColor: "white" }} >
            {/* Logo  */}
            <Image style={{ width: 40, height: 40 }} source={require("../assets/logo.jpg")} />
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginRight: 5 }} >
                <Feather name="search" size={24} color="white" />
                <Pressable onPress={() => navigation.openDrawer()} >
                    <Feather name="menu" size={34} color="white" />
                </Pressable>
            </View>
        </View>
    )
}

export default HeaderComponent