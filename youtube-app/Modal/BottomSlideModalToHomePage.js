import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
const BottomSlideModalToHomePage = ({ isVideoModalVisible, setIsVideoModalVisible, videoId }) => {
    const [publishStatus, setPublishStatus] = useState(true)
    // console.log(isVideoModalVisible, setIsVideoModalVisible);
    const animation = useSharedValue(0)

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event, context) => {
            console.log(event);
            context.startY = animation.value
        },
        onActive: (event, context) => {
            console.log(event);
            if (event.translationY > 0) {
                animation.value = context.startY + event.translationY
            }
        },
        onEnd: (event, context) => {
            if (event.translationY > 50 || event.translationY < -50) {
                setIsVideoModalVisible(false)
            } else {
                animation.value = withTiming(0, { duration: 200 })
            }
        }
    })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: animation.value }]
        }
    })

    return (
        <View>
            <View>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={isVideoModalVisible}
                >
                    <View style={{ flex: 1, justifyContent: 'flex-end', }}>
                        <PanGestureHandler onGestureEvent={gestureHandler}>
                            <Animated.View style={[{ width: "95%", flex: 1, alignSelf: 'center', justifyContent: 'flex-end', }, animatedStyle]}>
                                <View style={{ backgroundColor: "#222", flex: 1 / 3, alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 15, width: "95%", alignSelf: 'center', borderRadius: 15, paddingBottom: 10 }}>

                                    {/* <PanGestureHandler onGestureEvent={gestureHandler}>
                                <AnimatedTouchableOpacity onPress={() => { }} style={{ position: 'absolute', top: 5, left: "43%" }} >
                                    <View style={{ width: 55, height: 4, backgroundColor: "#444", borderRadius: 10 }} ></View>
                                </AnimatedTouchableOpacity>
                            </PanGestureHandler> */}

                                    <TouchableOpacity onPress={() => setIsVideoModalVisible(false)} style={{ position: 'absolute', top: 10, right: 20 }}>
                                        <Entypo name="cross" size={24} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => { }} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 25, paddingHorizontal: 20, alignItems: 'center' }}>
                                        <Octicons name="bookmark" size={24} color="white" />
                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Save to Playlist</Text>
                                    </TouchableOpacity>

                                </View>
                            </Animated.View>
                        </PanGestureHandler>
                    </View>
                </Modal>
            </View>

            {/* save video to modal  */}
        </View>
    )
}

export default BottomSlideModalToHomePage

