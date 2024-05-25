import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { MaterialIcons, Entypo } from "@expo/vector-icons"
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const PopupMessage = ({ isSuccess, title = "Please add titile message", isVisible, setVisible }) => {
    // if isSuccess false so this message show error
    const animateY = useSharedValue(-120)

    const animationStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: animateY.value }]
        }
    })

    useEffect(() => {
        if (isVisible) {
            animateY.value = withTiming(0, { duration: 300 })
        }
    }, [isVisible])

    setTimeout(() => {
        animateY.value = withTiming(-120, { duration: 500 })
        setTimeout(() => {
            setVisible(false)
        }, 10);
    }, 3500);

    return (
        <Animated.View style={[{ backgroundColor: isSuccess ? "#61BA61" : "#F01818", alignSelf: 'center', width: "90%", height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, borderRadius: 5, position: 'absolute', zIndex: 999, top: 70 }, animationStyle]}>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }} >

                {
                    isSuccess ?
                        <MaterialIcons name="gpp-good" size={26} color="white" /> : <MaterialIcons name="error-outline" size={24} color="white" fontWeight="200" />
                }

                <Text style={{ fontSize: 14, color: "white" }} >{title}</Text>
            </View>

            <TouchableOpacity onPress={() => {
                animateY.value = withTiming(-120, { duration: 500 })
                setTimeout(() => {
                    setVisible(false)
                }, 10);
            }} style={{}}>
                <Entypo name="cross" size={28} color="white" />
            </TouchableOpacity>

        </Animated.View>
    )
}

export default PopupMessage