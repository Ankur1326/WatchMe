import { View, Image, Pressable, Text, Button } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useTheme } from 'expo-theme-switcher';
import HeaderComponent from "../components/HeaderComponent.js";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import VideoComponent from "../components/VideoComponent.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import PopupMessage from "../components/PopupMessage.jsx";
import { base_url } from "../helper/helper.js";

const ChannelPlaylistVideoScreen = ({ route }) => {
    // const { playlistData } = route.params
    const [playlistData, setPlaylistData] = useState(route.params.data);
    const navigation = useNavigation();
    const { currentTheme } = useTheme()
    const scrollViewRef = useRef(null)
    const [isSuccess, setSuccess] = useState(false)
    const [isPopupMessageShow, setPopupMessageShow] = useState(false)

    const conformDeleteVideo = async (videoId) => {
        console.log("called conformDeleteVideo", videoId);
        const playlistId = playlistData._id;
        
        try {
            const accessToken = await AsyncStorage.getItem("accessToken")
            const response = await axios.delete(`${base_url}/playlist/${playlistId}/${videoId}`,
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    }
                }
            )
            setSuccess(true)
            setPopupMessageShow(true)
            console.log("response.data : ", response.data);
            // Update playlist data after deletion
            setPlaylistData(prevData => ({
                ...prevData,
                videos: prevData.videos.filter(video => video._id !== videoId)
            }));

        } catch (error) {
            setSuccess(false)
            setPopupMessageShow(true)

            console.log("Error while deleting playlist: ", error);
        } finally {
        }
    };

    // useEffect to update playlistData when route params change
    useEffect(() => {
        setPlaylistData(route.params.data);
    }, [route.params.data]);

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme.secondaryBackgroundColor, }} >
            <HeaderComponent />

            {/* success or failuar popup message */}
            <PopupMessage isSuccess={isSuccess} title={isSuccess ? "Video delete successfully" : "Video is not being deleted"} isVisible={isPopupMessageShow} setVisible={setPopupMessageShow} />

            <ScrollView style={{ paddingHorizontal: 5, backgroundColor: currentTheme.primaryBackgroundColor }} ref={scrollViewRef}>

                <Pressable onPress={() => { }} style={{ width: "100%", alignItems: 'center', marginTop: 10 }}>
                    <View style={{ width: "82%", height: 10, marginBottom: 5, backgroundColor: "#a992ad", borderTopLeftRadius: 25, borderTopRightRadius: 25, }} ></View>

                    <View style={{ position: 'relative', alignItems: 'center', height: 200, width: "90%", overflow: 'hidden', borderRadius: 20, }} >
                        <Image source={{ uri: playlistData?.videos[0]?.thumbnail }} style={{ height: "100%", width: "100%" }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 12, paddingVertical: 15, width: "100%", height: 60, position: 'absolute', backgroundColor: "#aeaeaeca", bottom: 0, borderTopWidth: 1, borderTopColor: "white" }}>
                            <View>
                                {/* playlist name */}
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }} >{playlistData?.name}</Text>
                                <Text style={{ color: "white", fontSize: 12, }} >100K View . 2 hours age</Text>
                            </View>
                            <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }} >{playlistData?.videosLength} Videos</Text>
                        </View>
                    </View>
                </Pressable>

                {/* channel  */}
                <Pressable onPress={() => navigation.navigate("Channel")} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 10, marginBottom: 15, marginLeft: 25 }} >
                    <View>
                        <Image source={{ uri: playlistData?.channel[0]?.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                    </View>
                    <View>
                        <Text style={{ color: "white", fontSize: 18 }}>{playlistData?.channel[0]?.username}</Text>
                        <Text style={{ color: "#9e9e9e", }}>{playlistData?.channel[0]?.subscribersCount} Subscribers</Text>
                    </View>
                </Pressable>

                <View style={{ flexDirection: 'column', gap: 25, position: 'relative' }}>
                    {playlistData.videos.map((item) => (
                        <VideoComponent item={item} scrollViewRef={scrollViewRef} conformDeleteVideo={conformDeleteVideo} />
                    ))}
                </View>

            </ScrollView>
        </View>
    )
}

export default ChannelPlaylistVideoScreen