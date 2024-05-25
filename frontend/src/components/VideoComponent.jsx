import { View, Image, Pressable, Text } from "react-native";
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'expo-theme-switcher';
import { useNavigation } from "@react-navigation/native";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useState } from "react";
import CustomConfirmationDialog from "../Modal/CustomConfirmationDialog";
import { useSelector } from "react-redux";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const VideoComponent = ({ item, scrollViewRef,  }) => {

    const { currentTheme } = useTheme()
    const animation = useSharedValue(0)
    const navigation = useNavigation();
    const [showConfirmation, setShowConfirmation] = useState(false); // State to control the visibility of the confirmation dialog
    const loading = useSelector(state => state.playlistVideos.loading)

    const gesturehandler = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.startX = animation.value
        },
        onActive: (event, context) => {
            animation.value = context.startX + event.translationX;
        },
        onEnd: (event, context) => {
            if (animation.value > 70) {
                animation.value = withTiming(100, { duration: 300 })
            }
            else if (animation.value < -70) {
                animation.value = withTiming(-100, { duration: 300 })
            }
            else {
                animation.value = withTiming(0, { duration: 300 })
            }
        },
    })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: animation.value }]
        }
    })


    const animatedLeftIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: animation.value > 70 ? withSpring(2) : withSpring(1) }]
        }
    })

    const animatedRigntIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: animation.value > -70 ? withSpring(1) : withSpring(2) }]
        }
    })

    const deleteVideoHandler = (playlistId) => {
        setShowConfirmation(true); // Show the confirmation dialog when delete is pressed
    };

    
    console.log("item ", item);
    console.log("item.videoDetails[0].userDetails[0] ", item.videoDetails[0]);

    return (
        <PanGestureHandler key={item?._id} onGestureEvent={gesturehandler} simultaneousHandlers={scrollViewRef}>
            <Animated.View>
                <AnimatedPressable onPress={() => navigation.navigate("VideoDetail", { data: item?.videoDetails[0] })} style={{ borderBottomWidth: 1, borderBottomColor: currentTheme?.primaryBorderColor, paddingBottom: 26, flexDirection: "row" }} >

                    <Pressable style={{ width: "50%", position: "absolute", backgroundColor: "green", height: "73%", left: 0 }} >
                        <AnimatedPressable onPress={() => removeVideoFromPlaylist()} style={[{ marginLeft: 35, position: "absolute", top: "40%" }, animatedLeftIconStyle]}>
                            <MaterialCommunityIcons name="progress-download" size={24} color="white" />
                        </AnimatedPressable>
                    </Pressable>

                    <Pressable style={{ width: "50%", position: "absolute", backgroundColor: "red", height: "73%", right: 0 }} >
                        <AnimatedPressable onPress={() => setShowConfirmation(true)} style={[{ position: "absolute", right: 40, top: "45%", justifyContent: "flex-end" }, animatedRigntIconStyle]}>
                            <MaterialIcons name="delete-outline" size={24} color="white" />
                        </AnimatedPressable>
                    </Pressable>

                    <Animated.View style={[{ flexDirection: 'column', gap: 10, width: "100%" }, animatedStyle]}>
                        {/* thumbnail */}
                        <Image source={{ uri: item.videoDetails[0]?.thumbnail }} style={{ width: "100%", height: 190 }} />

                        {/* video duration */}
                        <Text style={{ color: "snow", fontSize: 14, fontWeight: 600, position: 'absolute', bottom: 80, right: 10, backgroundColor: "#000000c3", fontWeight: 700, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 2 }} >{(item?.videoDetails[0]?.duration / 60).toString().substring(0, 4)}</Text>

                        {/* title and date */}
                        <View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: 5 }}>
                                {/* channel avatar image */}
                                <Image source={{ uri: item?.videoDetails[0].userDetails[0]?.avatar }} style={{ width: 42, height: 42, borderRadius: 25, marginBottom: 10 }} />
                                <View>
                                    {/* titile */}
                                    <Text style={{ color: currentTheme?.primaryTextColor, fontSize: 18, fontWeight: 600 }} >
                                        {item?.videoDetails[0]?.title}
                                    </Text>
                                    {/* views and time ago */}
                                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                                        <Text style={{ color: currentTheme?.secondaryTextColor, fontSize: 13, }}>{item?.videoDetails[0].views} Views • </Text>
                                        <Text style={{ color: currentTheme?.secondaryTextColor, fontSize: 13, }} >
                                            {
                                                formatDistanceToNow(new Date(item?.videoDetails[0]?.createdAt), {
                                                    addSuffix: true,
                                                }).toString()
                                            }
                                        </Text>
                                    </View>
                                    <Text style={{ color: currentTheme?.secondaryTextColor, fontSize: 13, }}>{item?.videoDetails[0].userDetails[0]?.username}</Text>

                                </View>

                            </View>

                        </View>

                    </Animated.View>


                </AnimatedPressable>
                <CustomConfirmationDialog
                    showConfirmation={showConfirmation}
                    title="Delete Video"
                    message="Are you sure you want to delete this Video from Playlist?"
                    onCancel={() => {
                        setShowConfirmation(false)
                        animation.value = withTiming(0, {duration: 300})
                    }} // Close the confirmation dialog if Cancel is pressed
                    onConfirm={() => {
                        conformDeleteVideo(item._id),
                            setShowConfirmation(false)
                            animation.value = withTiming(-400, {duration: 200})
                            setTimeout(() => {
                                animation.value = withTiming(0, {duration: 100})
                            }, 1000);
                    }}
                />
            </Animated.View>
        </PanGestureHandler>
    )
}

export default VideoComponent