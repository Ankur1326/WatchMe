import { View, Image, Pressable, Text } from "react-native";
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'expo-theme-switcher';
import { useNavigation } from "@react-navigation/native";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const VideoComponent = ({ item, scrollViewRef }) => {
    const { currentTheme } = useTheme()
    const animation = useSharedValue(0)
    const navigation = useNavigation();

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

    const downloadEmail = () => {
        console.log("called downloadEnail function");
    }

    return (
        <PanGestureHandler key={item._id} onGestureEvent={gesturehandler} simultaneousHandlers={scrollViewRef}>
            <Animated.View>
                <AnimatedPressable onPress={() => navigation.navigate("VideoDetail", { data: item })} style={{ borderBottomWidth: 1, borderBottomColor: currentTheme?.primaryBorderColor, paddingBottom: 26, flexDirection: "row" }} >

                    <AnimatedPressable onPress={() => downloadEmail()} style={[{ marginLeft: 35, position: "absolute", top: "40%" }, animatedLeftIconStyle]}>
                        <MaterialCommunityIcons name="progress-download" size={24} color="white" />
                    </AnimatedPressable>

                    <AnimatedPressable onPress={() => downloadEmail()} style={[{ position: "absolute", right: 20, top: "40%" }, animatedRigntIconStyle]}>
                        <MaterialCommunityIcons name="progress-download" size={24} color="white" />
                    </AnimatedPressable>

                    <Animated.View style={[{ flexDirection: 'column', gap: 10, width: "100%" }, animatedStyle]}>
                        {/* thumbnail */}
                        <Image source={{ uri: item?.thumbnail }} style={{ width: "100%", height: 190 }} />

                        {/* video duration */}
                        <Text style={{ color: "snow", fontSize: 16, fontWeight: 600, position: 'absolute', bottom: 80, right: 10, backgroundColor: "#000000c3", fontWeight: 700, paddingHorizontal: 7, paddingVertical: 1, borderRadius: 2 }} >{(item?.duration / 60).toString().substring(0, 4)}</Text>

                        {/* title and date */}
                        <View>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: 5 }}>
                                {/* channel avatar image */}
                                <Image source={{ uri: item.userDetails[0].avatar }} style={{ width: 42, height: 42, borderRadius: 25, marginBottom: 10 }} />
                                <View>
                                    {/* titile */}
                                    <Text style={{ color: currentTheme?.primaryTextColor, fontSize: 18, fontWeight: 600 }} >
                                        {item?.title}
                                    </Text>
                                    {/* views and time ago */}
                                    <View style={{ flexDirection: "row", alignItems: "center", }}>
                                        <Text style={{ color: currentTheme?.secondaryTextColor, fontSize: 13, }}>{item.views} Views • </Text>
                                        <Text style={{ color: currentTheme?.secondaryTextColor, fontSize: 13, }} >
                                            {
                                                formatDistanceToNow(new Date(item.createdAt), {
                                                    addSuffix: true,
                                                }).toString()
                                            }
                                        </Text>
                                    </View>
                                    <Text style={{ color: currentTheme?.secondaryTextColor, fontSize: 13, }}>{item.userDetails[0]?.username}</Text>

                                </View>

                            </View>

                        </View>

                    </Animated.View>

                </AnimatedPressable>
            </Animated.View>
        </PanGestureHandler>
    )
}

export default VideoComponent