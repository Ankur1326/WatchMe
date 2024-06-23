import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'expo-theme-switcher';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderComponent from '../components/HeaderComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaylistVideos } from '../store/slices/playlistVideoSlice';
import VideoComponent from '../components/VideoComponent';

const PlaylistVideosScreen = ({ route }) => {
    const { data } = route.params
    const navigation = useNavigation();
    const scrollViewRef = useRef(null)
    const { currentTheme } = useTheme()
    const dispatch = useDispatch()
    const videos = useSelector(state => state.playlistVideos.videos)

    useEffect(() => {
        dispatch(fetchPlaylistVideos({ playlistId: data._id }))
    }, [])

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.secondaryBackgroundColor }]}>
            <HeaderComponent />
            <ScrollView style={[styles.scrollView, { backgroundColor: currentTheme.primaryBackgroundColor }]} ref={scrollViewRef}>

            <Pressable onPress={() => { }} style={styles.playlistContainer}>
                    <Image source={{ uri: data?.playlistThumbnail }} style={styles.playlistImage} />
                    <View style={styles.overlay}>
                        <View style={styles.overlayContent}>
                            <Text style={styles.playlistName}>{data?.name}</Text>
                            <Text style={styles.playlistDetails}>{data?.videosCount} Videos</Text>
                        </View>
                        <Text style={styles.viewAllButton}>View All</Text>
                    </View>
                </Pressable>

                <View style={styles.videoList}>
                    {videos.map((item) => (
                        <VideoComponent key={item.id} item={item} scrollViewRef={scrollViewRef} />
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
        paddingHorizontal: 10,
    },
    playlistContainer: {
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
    },
    playlistImage: {
        height: 200,
        width: "100%",
        resizeMode: 'cover',
    },
    overlay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 15,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    overlayContent: {
        flex: 1,
    },
    playlistName: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
    },
    playlistDetails: {
        color: "white",
        fontSize: 16,
    },
    viewAllButton: {
        color: "#FFD700",
        fontSize: 16,
        fontWeight: "bold",
    },
    videoList: {
        marginTop: 20,
    },
    videoItem: {
        flexDirection: 'row',
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: "#333",
    },
    videoThumbnail: {
        height: 120,
        width: 160,
        resizeMode: 'cover',
    },
    videoInfo: {
        flex: 1,
        padding: 10,
    },
    videoTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    videoDuration: {
        color: "#ccc",
        fontSize: 14,
    },
});


export default PlaylistVideosScreen