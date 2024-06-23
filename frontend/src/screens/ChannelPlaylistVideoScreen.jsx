import { View, Image, Pressable, Text, StyleSheet } from "react-native";
import { useRef, useState } from "react";
import { useTheme } from 'expo-theme-switcher';
import HeaderComponent from "../components/HeaderComponent.jsx";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import VideoComponent from "../components/VideoComponent.jsx";
import axiosInstance from "../helper/axiosInstance.js";

const ChannelPlaylistVideoScreen = ({ route }) => {
    const { data } = route.params
    const navigation = useNavigation();
    const { currentTheme } = useTheme()
    const scrollViewRef = useRef(null)

    const conformDeleteVideo = async (videoId) => {
        // console.log("called conformDeleteVideo", videoId);
        const playlistId = data._id
        try {
            await axiosInstance.delete(`playlist/${playlistId}` / `${videoId}`)
        } catch (error) {
            console.log("Error while deleting playlist: ", error);
        } finally {
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.secondaryBackgroundColor }]}>
            <HeaderComponent />
            <ScrollView style={[styles.scrollView, { backgroundColor: currentTheme.primaryBackgroundColor }]} ref={scrollViewRef}>
                <Pressable onPress={() => { }} style={styles.mainPressable}>
                    <View style={styles.topBar}></View>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: data?.videos[0].thumbnail }} style={styles.image} />
                        <View style={styles.overlay}>
                            <View>
                                <Text style={styles.playlistName}>{data?.name}</Text>
                                <Text style={styles.playlistDetails}>100K View . 2 hours ago</Text>
                            </View>
                            <Text style={styles.videoCount}>{data?.videosLength} Videos</Text>
                        </View>
                    </View>
                </Pressable>

                <Pressable onPress={() => navigation.navigate("Channel")} style={styles.channelPressable}>
                    <View>
                        <Image source={{ uri: data?.channel[0]?.avatar }} style={styles.channelAvatar} />
                    </View>
                    <View>
                        <Text style={styles.channelUsername}>{data?.channel[0]?.username}</Text>
                        <Text style={styles.channelSubscribers}>{data?.channel[0]?.subscribersCount} Subscribers</Text>
                    </View>
                </Pressable>

                <View style={styles.videoList}>
                    {data.videos.map((item) => (
                        <VideoComponent key={item.id} item={item} scrollViewRef={scrollViewRef} conformDeleteVideo={conformDeleteVideo} />
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        paddingHorizontal: 5,
    },
    mainPressable: {
        width: "100%",
        alignItems: 'center',
        marginTop: 10,
    },
    topBar: {
        width: "82%",
        height: 10,
        marginBottom: 5,
        backgroundColor: "#a992ad",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        height: 200,
        width: "90%",
        overflow: 'hidden',
        borderRadius: 20,
    },
    image: {
        height: "100%",
        width: "100%",
    },
    overlay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 15,
        width: "100%",
        height: 60,
        position: 'absolute',
        backgroundColor: "#aeaeaeca",
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: "white",
    },
    playlistName: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
    },
    playlistDetails: {
        color: "white",
        fontSize: 12,
    },
    videoCount: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
    },
    channelPressable: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 15,
        marginLeft: 25,
    },
    channelAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    channelUsername: {
        color: "white",
        fontSize: 18,
    },
    channelSubscribers: {
        color: "#9e9e9e",
    },
    videoList: {
        flexDirection: 'column',
        gap: 25,
        position: 'relative',
    },
});

export default ChannelPlaylistVideoScreen