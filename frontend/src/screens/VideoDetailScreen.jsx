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

const AnimatedLikeButton = Animated.createAnimatedComponent(TouchableOpacity);
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
    const likeScale = useSharedValue(1);

    const animatedLikeStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: likeScale.value }],
        };
    });

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
            console.error("Error while toggling like: ", error);
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
        <View style={styles.container}>
            <HeaderComponent />

            <ScrollView style={styles.scrollView}>
                <Video
                    ref={videoRef}
                    source={{ uri: videoInfo.videoFile }}
                    style={styles.video}
                    useNativeControls
                    resizeMode="contain"
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />

                <View style={styles.videoInfoContainer}>
                    <Text style={styles.videoTitle}>{videoInfo?.title}</Text>
                    <View style={styles.videoStats}>
                        <Text style={styles.videoViews}>{videoInfo.views} Views</Text>
                        {/* <Text style={styles.videoUploadedTime}>
                                {
                                    formatDistanceToNow(new Date(videoInfo?.createdAt), {
                                        addSuffix: true,
                                    })?.toString()
                                }
                            </Text> */}
                    </View>

                    <View style={styles.likeDislikeSaveContainer}>
                        <View style={styles.likeDislikeContainer}>
                            <AnimatedLikeButton
                                onPress={() => toggleVideoLikeHandler(data._id, "like")}
                                style={[styles.likeButton, animatedLikeStyle]}
                            >
                                <AntDesign name={videoInfo.isLiked ? "like1" : "like2"} size={21} color="white" />
                                <Text style={styles.likeText}>{videoInfo.likesCount}</Text>
                            </AnimatedLikeButton>
                            <TouchableOpacity
                                onPress={() => toggleVideoLikeHandler(data._id, "dislike")}
                                style={styles.dislikeButton}
                            >
                                <AntDesign name={videoInfo.isDisliked ? "dislike1" : "dislike2"} size={21} color="white" />
                                <Text style={styles.likeText}>{videoInfo.dislikesCount}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={getChannel} style={styles.saveButton}>
                            <Feather name="folder-plus" size={18} color="gray" />
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.channelContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Channel", { channel })}
                            style={styles.channelInfo}
                        >
                            <Image source={{ uri: channel?.avatar }} style={styles.channelAvatar} />
                            <View>
                                <Text style={styles.channelName}>{channel?.username}</Text>
                                <Text style={styles.channelSubscribers}>{channel?.subscribersCount} Subscribers</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={subscribeToggle} style={styles.subscribeButton}>
                            <SimpleLineIcons name={channel?.isSubscribed ? "user-following" : "user-follow"} size={18} color="black" />
                            <Text style={styles.subscribeText}>{channel?.isSubscribed ? "Subscribed" : "Subscribe"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>🚀{data?.description}</Text>
                    </View>
                </View>

                <CommentComponent videoId={videoId} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d0d0d",
    },
    scrollView: {
        paddingHorizontal: 10,
    },
    video: {
        height: 220,
        borderRadius: 10,
        // marginBottom: 15,
    },
    videoInfoContainer: {
        padding: 15,
        backgroundColor: "#181818",
        borderRadius: 10,
        marginBottom: 20,
    },
    videoTitle: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
    },
    videoStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    videoViews: {
        color: "white",
        fontSize: 13,
    },
    videoUploadedTime: {
        color: "gray",
        fontSize: 14,
    },
    likeDislikeSaveContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 20,
    },
    likeDislikeContainer: {
        flexDirection: 'row',
        backgroundColor: "#333",
        borderRadius: 7,
        overflow: 'hidden',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    dislikeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderLeftWidth: 1,
        borderLeftColor: "#333333",
    },
    likeText: {
        color: "white",
        fontSize: 16,
        marginLeft: 5,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#333333",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 7,
    },
    saveButtonText: {
        color: "#ffffff",
        fontSize: 16,
        marginLeft: 5,
    },
    channelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    channelInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    channelAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    channelName: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    channelSubscribers: {
        color: "gray",
        fontSize: 13,
    },
    subscribeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#AE7AFF",
        borderRadius: 7,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    subscribeText: {
        color: "#000000",
        fontSize: 16,
        marginLeft: 5,
    },
    descriptionContainer: {
        borderTopWidth: 0.5,
        borderTopColor: "#333333",
        paddingTop: 10,
        marginTop: 8
    },
    descriptionText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: 'center',
    },
});

export default VideoDetailScreen
