import { View, Text, StyleSheet, Button, TouchableOpacity, Pressable, Image, ScrollView, } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Video } from 'expo-av';
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDistanceToNow } from 'date-fns';
import { AntDesign } from '@expo/vector-icons';
import axios from "axios"
import { base_url } from '../helper/helper';
import { SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage"
import CommentComponent from '../components/CommentComponent';
import HeaderComponent from '../components/HeaderComponent';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { increaseViewsHandler } from '../actions/video.actions';
import { UserType } from '../context/UserContext';
import axiosInstance from '../helper/axiosInstance';

const AnimatiedLikeBtn = Animated.createAnimatedComponent(TouchableOpacity)
const VideoDetailScreen = ({ route }) => {
    const [channel, setChannel] = useState([])
    const navigation = useNavigation()
    const [user, setUser] = useContext(UserType);
    const { data } = route.params

    // console.log("data ::: ", data);
    const sections = [1]
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = React.useRef(null);
    const videoId = data?._id
    const [videoInfo, setVideoInfo] = useState([])
    const likeScale = useSharedValue(1)

    const animatedLikeStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: likeScale.value },
            ]
        }
    })
    const getChannel = async () => {
        let username = "";
        if (Object.keys(data).includes("userDetails")) { // if user comes from HomeScreen
            username = data.userDetails[0].username
        }
        else { // this condition will be true when user come from ProfileScreen
            username = user.username
        }

        try {
            const response = await axiosInstance.get(`users/c/${username}`)
            // console.log("response :: ", response.data.data);
            setChannel(response.data.data)

        } catch (error) {
            console.log("Error while getting user channel : ", error);
        }
    }

    // get video and videoDetails by video Id 
    const getVideoInfo = async () => {

        try {
            const response = await axiosInstance.get(`videos/${videoId}`)
            // console.log("response :: ", response.data.data[0]);
            setVideoInfo(response.data.data[0])

        } catch (error) {
            console.log("Error while getting user channel : ", error);
        }
    }

    useEffect(() => {
        getChannel()
        getVideoInfo()
    }, [])

    // handle subscribe toggle 
    const subscribeToggle = async () => {
        try {
            await axiosInstance.post(`subscriptions/c/${channel?._id}`)
            getChannel()
            // console.log("response : ", response);
        } catch (error) {
            console.log("Error while toggle subscribe : ", error);
        }
    }

    // handle like or dislike 
    const toggleVideoLikeHandler = async (videoId, action) => {
        if (action === "like") {
            likeScale.value = withTiming(1.3, { duration: 100 })
            setTimeout(() => {
                likeScale.value = withTiming(1, { duration: 100 })
            }, 100);
        }
        try {
            await axiosInstance.post(`likes/toggle/v/${videoId}`, { action })
            // console.log(response.data);
            getVideoInfo()
        } catch (error) {

        } finally {
        }
    }

    const handlePlaybackStatusUpdate = async (status) => {
        if (!status.isPlaying && status.didJustFinish) {
            // Video has ended
            setIsPlaying(false);
            videoRef.current.replayAsync();
        }

        // Send request to backend to track views when user watched full video
        try {
            if (status.didJustFinish) { // if video is finished
                // console.log("status.didJustFinish");
                if (videoId) {
                    await increaseViewsHandler(videoId)
                }
            }
        } catch (error) {
            console.log("Error while increased video views : ", error);
        }
    }

    return (
        <View style={{ borderWidth: 1, flex: 1, backgroundColor: "#111" }}>
            {/* header  */}
            <HeaderComponent />

            <ScrollView style={{ paddingHorizontal: 10, paddingVertical: 0 }}>
                {/* video  */}
                <Video
                    ref={videoRef}
                    source={{ uri: videoInfo.videoFile }}
                    style={{ height: 200, borderWidth: 1, borderWidth: 0.5, borderColor: "gray", }}
                    useNativeControls
                    resizeMode="contain"
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />

                {/* video info  */}
                <View style={{ marginTop: 10 }}>
                    <View style={{ borderWidth: 0.6, borderColor: "white", padding: 10, borderRadius: 10 }}>
                        <Text style={{ color: "white", fontSize: 22, fontWeight: 600 }}>{videoInfo?.title}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 7 }}>
                            {/* viewes */}
                            <Text style={{ color: "white" }}>{videoInfo.views} Views . </Text>
                            {/* uploaded time  */}
                            <Text style={{ color: "#dbdbdb", fontSize: 13, }} >
                                {/* {
                                    formatDistanceToNow(new Date(videoInfo.createdAt), {
                                        addSuffix: true,
                                    }).toString()
                                } */}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, }}>
                            {/* Like and dislike  */}
                            <View style={{ borderWidth: 0.6, borderColor: "white", flexDirection: 'row', alignItems: 'center', width: 160, borderRadius: 7 }}>
                                {/* like  */}
                                <AnimatiedLikeBtn onPress={() => toggleVideoLikeHandler(data._id, "like")} style={[{ flexDirection: 'row', gap: 5, paddingVertical: 7, paddingHorizontal: 15 }, animatedLikeStyle]}>
                                    {
                                        videoInfo.isLiked ? <AntDesign name="like1" size={21} color="white" /> : <AntDesign name="like2" size={21} color="white" />
                                    }

                                    <Text style={{ color: "white", fontSize: 16 }}>{videoInfo.likesCount}</Text>
                                </AnimatiedLikeBtn>
                                {/* dislike  */}
                                <TouchableOpacity onPress={() => toggleVideoLikeHandler(data._id, "dislike")} style={{ flexDirection: 'row', gap: 5, paddingVertical: 7, paddingHorizontal: 15, borderLeftWidth: 0.6, borderLeftColor: "gray" }}>
                                    {
                                        videoInfo.isDisliked ? <AntDesign name="dislike1" size={21} color="white" /> : <AntDesign name="dislike2" size={21} color="white" />
                                    }
                                    <Text style={{ color: "white", fontSize: 16 }}>{videoInfo.dislikesCount}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* save btn */}
                            <TouchableOpacity onPress={() => getChannel()} style={{ flexDirection: 'row', gap: 5, backgroundColor: "white", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 7, alignItems: 'center' }}>
                                <Feather name="folder-plus" size={23} color="gray" />
                                <Text style={{ color: "black", fontSize: 19, fontWeight: 300 }}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25 }}>
                            {/* channel  */}
                            <TouchableOpacity onPress={() => navigation.navigate("Channel", { channel: channel })} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }} >
                                <View>
                                    <Image source={{ uri: channel?.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                </View>
                                <View>
                                    <Text style={{ color: "white", fontSize: 18 }}>{channel?.username}</Text>
                                    <Text style={{ color: "#9e9e9e", }}>{channel?.subscribersCount} Subscribers</Text>
                                </View>
                            </TouchableOpacity>
                            {/* subscribe btn */}
                            <TouchableOpacity onPress={() => subscribeToggle()} style={{ backgroundColor: "#AE7AFF", paddingHorizontal: 12, paddingVertical: 8 }}>
                                {
                                    channel?.isSubscribed == true ? (
                                        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                            <SimpleLineIcons name="user-following" size={18} color="black" />
                                            <Text style={{ color: "black", fontSize: 18, fontWeight: 600 }}>Subscribed</Text>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }} >
                                            <SimpleLineIcons name="user-follow" size={18} color="black" />
                                            <Text style={{ color: "black", fontSize: 18, fontWeight: 600 }}>Subscribe</Text>
                                        </View>
                                    )
                                }
                            </TouchableOpacity>
                        </View>

                        {/* description */}
                        <View style={{ marginTop: 15, borderTopWidth: 0.6, borderTopColor: "gray", paddingVertical: 10 }} >
                            <Text style={{ color: "white", fontSize: 18, textAlign: 'center' }}>🚀{data?.description}</Text>
                        </View>
                    </View>
                </View>

                {/* comment component */}
                <CommentComponent videoId={videoId} />

            </ScrollView>
        </View>
    )
}

export default VideoDetailScreen
