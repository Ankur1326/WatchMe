import { View, Text, Pressable, Image } from 'react-native'
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


    // console.log("data ::: ", data);
    // console.log("videos ::: ", videos);
    useEffect(() => {
        dispatch(fetchPlaylistVideos({ playlistId: data._id }))
    }, [])


    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.secondaryBackgroundColor, }} >
            <HeaderComponent />
            <ScrollView style={{ paddingHorizontal: 5, backgroundColor: currentTheme.primaryBackgroundColor }} ref={scrollViewRef} >

                <Pressable onPress={() => { }} style={{ width: "100%", alignItems: 'center', marginTop: 10 }}>
                    <View style={{ width: "82%", height: 10, marginBottom: 5, backgroundColor: "#a992ad", borderTopLeftRadius: 25, borderTopRightRadius: 25, }} ></View>

                    <View style={{ position: 'relative', alignItems: 'center', height: 200, width: "90%", overflow: 'hidden', borderRadius: 20, }} >
                        <Image source={{ uri: data?.playlistThumbnail }} style={{ height: "100%", width: "100%" }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 12, paddingVertical: 15, width: "100%", height: 60, position: 'absolute', backgroundColor: "#aeaeaeca", bottom: 0, borderTopWidth: 1, borderTopColor: "white" }}>
                            <View>
                                {/* playlist name */}
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }} >{data?.name}</Text>
                                <Text style={{ color: "white", fontSize: 12, }} >100K View . 2 hours age</Text>
                            </View>
                            <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }} >{data?.videosCount} Videos</Text>
                        </View>
                    </View>
                </Pressable>

                <View style={{ flexDirection: 'column', gap: 25, position: 'relative', marginTop: 20 }}>
                    {videos.map((item) => (
                        <VideoComponent item={item} scrollViewRef={scrollViewRef}/>
                    ))}
                </View>

            </ScrollView>
        </View>
    )
}

export default PlaylistVideosScreen