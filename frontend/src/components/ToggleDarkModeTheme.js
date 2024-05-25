import { View, Text, Pressable } from 'react-native'
import React, { useRef } from 'react'

const ToggleDarkModeTheme = () => {
    const handleThemeToggle = () => {
        
    }
    return (
        <View style={{ borderWidth: 0.4, borderColor: "white", marginHorizontal: 16, paddingVertical: 8, paddingHorizontal: 10, flexDirection: "row", alignItems: 'center', gap: 13, marginTop: 10, backgroundColor: "green" }}>
            <Pressable onPress={handleThemeToggle} style={{ backgroundColor: "#adadad", width: 47, paddingVertical: 2, paddingHorizontal: 2, borderRadius: 30 }}>
                <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: "#F2F2F2"}} ></View>
            </Pressable>
        </View>
    )
}

export default ToggleDarkModeTheme