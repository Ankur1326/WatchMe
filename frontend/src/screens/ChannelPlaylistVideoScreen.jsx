import { View, Image, Pressable, Text } from "react-native";
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
        <View style={{ flex: 1, backgroundColor: currentTheme.secondaryBackgroundColor, }} >
            <HeaderComponent />
            <ScrollView style={{ paddingHorizontal: 5, backgroundColor: currentTheme.primaryBackgroundColor }} ref={scrollViewRef}>

                <Pressable onPress={() => { }} style={{ width: "100%", alignItems: 'center', marginTop: 10 }}>
                    <View style={{ width: "82%", height: 10, marginBottom: 5, backgroundColor: "#a992ad", borderTopLeftRadius: 25, borderTopRightRadius: 25, }} ></View>

                    <View style={{ position: 'relative', alignItems: 'center', height: 200, width: "90%", overflow: 'hidden', borderRadius: 20, }} >
                        <Image source={{ uri: data?.videos[0].thumbnail }} style={{ height: "100%", width: "100%" }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 12, paddingVertical: 15, width: "100%", height: 60, position: 'absolute', backgroundColor: "#aeaeaeca", bottom: 0, borderTopWidth: 1, borderTopColor: "white" }}>
                            <View>
                                {/* playlist name */}
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }} >{data?.name}</Text>
                                <Text style={{ color: "white", fontSize: 12, }} >100K View . 2 hours age</Text>
                            </View>
                            <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }} >{data?.videosLength} Videos</Text>
                        </View>
                    </View>
                </Pressable>

                {/* channel  */}
                <Pressable onPress={() => navigation.navigate("Channel")} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 10, marginBottom: 15, marginLeft: 25 }} >
                    <View>
                        <Image source={{ uri: data?.channel[0]?.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                    </View>
                    <View>
                        <Text style={{ color: "white", fontSize: 18 }}>{data?.channel[0]?.username}</Text>
                        <Text style={{ color: "#9e9e9e", }}>{data?.channel[0]?.subscribersCount} Subscribers</Text>
                    </View>
                </Pressable>

                <View style={{ flexDirection: 'column', gap: 25, position: 'relative' }}>
                    {data.videos.map((item) => (
                        <VideoComponent item={item} scrollViewRef={scrollViewRef} conformDeleteVideo={conformDeleteVideo} />
                    ))}
                </View>

            </ScrollView>
        </View>
    )
}

export default ChannelPlaylistVideoScreen