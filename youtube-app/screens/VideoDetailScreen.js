import { View, Text, StyleSheet, Button, TouchableOpacity, Pressable, Image, ScrollView, } from 'react-native'
import React, { useRef, useState } from 'react'
import { Video } from 'expo-av';
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDistanceToNow } from 'date-fns';
import { AntDesign } from '@expo/vector-icons';
import axios from "axios"
import { base_url } from '../helper/helper';

const VideoDetailScreen = ({ route }) => {
    const navigation = useNavigation()
    const [channel, setChannel] = useState({})


    const { data } = route.params
    // console.log(data);

    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = React.useRef(null);

    const togglePlay = async () => {
        if (videoRef.current) {
            if (isPlaying) {
                await videoRef.current.pauseAsync();
            } else {
                await videoRef.current.playAsync();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const getChannel = async () => {
        const userId = data.owner
        try {
            const response = await axios.get(`${base_url}/users/get-user-channel/${userId}`)
            console.log("response :: ", response.data.data);
            setChannel(response.data.data)
        } catch (error) {
            console.log("Error while getting user channel : ", error);
        }
    }

    return (
        <View style={{ borderWidth: 1, flex: 1, backgroundColor: "#222" }}>
            {/* header  */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 9, borderBottomWidth: 1.5, borderBottomColor: "white" }}>
                <Image
                    style={{ width: 40, height: 40 }}
                    // source={require("../assets/6372187-middle.png")}
                    source={require("../assets/logo.jpg")}
                />
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginRight: 5 }} >
                    <Feather name="search" size={24} color="white" />
                    <Pressable onPress={() => navigation.openDrawer()} >
                        <Feather name="menu" size={34} color="white" />
                    </Pressable>
                </View>
            </View>

            <ScrollView style={{ paddingHorizontal: 10, paddingVertical: 12 }}>

                <Video
                    ref={videoRef}
                    source={{ uri: data.videoFile }}
                    style={{ height: 200, borderWidth: 1, borderWidth: 0.5, borderColor: "gray" }}
                    useNativeControls
                    resizeMode="contain"
                    onPlaybackStatusUpdate={(status) => {
                        if (!status.isPlaying && status.didJustFinish) {
                            // Video has ended
                            setIsPlaying(false);
                            videoRef.current.replayAsync();
                        }
                    }}
                />

                <View style={{ marginTop: 10 }}>
                    <View style={{ borderWidth: 0.6, borderColor: "white", padding: 10, borderRadius: 10 }}>
                        <Text style={{ color: "white", fontSize: 22, fontWeight: 600 }}>{data.title}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 7 }}>
                            {/* viewes */}
                            <Text style={{ color: "white" }}>14000Views . </Text>
                            {/* uploaded time  */}
                            <Text style={{ color: "#dbdbdb", fontSize: 13, }} >
                                {
                                    formatDistanceToNow(new Date(data.createdAt), {
                                        addSuffix: true,
                                    }).toString()
                                }
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                            {/* Like and dislike  */}
                            <View style={{ borderWidth: 0.6, borderColor: "white", flexDirection: 'row', alignItems: 'center', width: 160, borderRadius: 7 }}>
                                <Pressable style={{ flexDirection: 'row', gap: 5, paddingVertical: 7, paddingHorizontal: 15 }}>
                                    <AntDesign name="like2" size={21} color="white" />
                                    <Text style={{ color: "white", fontSize: 16 }}>123</Text>
                                </Pressable>
                                <Pressable style={{ flexDirection: 'row', gap: 5, paddingVertical: 7, paddingHorizontal: 15, borderLeftWidth: 0.6, borderLeftColor: "gray" }}>
                                    <AntDesign name="dislike2" size={21} color="white" />
                                    <Text style={{ color: "white", fontSize: 16 }}>43</Text>
                                </Pressable>
                            </View>

                            {/* save btn */}
                            <TouchableOpacity onPress={() => getChannel()} style={{ flexDirection: 'row', gap: 5, backgroundColor: "white", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 7, alignItems: 'center' }}>
                                <Feather name="folder-plus" size={23} color="gray" />
                                <Text style={{ color: "black", fontSize: 19, fontWeight: 300 }}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {/* channel  */}
                        <Pressable>
                                <View>
                                    <Image source={{uri: channel?.avatar}} style={{width: 50, height: 50, borderRadius: 25}} />
                                </View>
                                <View>
                                    <Text style={{ color: "white", }}>{channel?.username}</Text>
                                    <Text style={{ color: "white", }}>{channel?.username}</Text>
                                </View>
                        </Pressable>
                    </View>
                </View>

            </ScrollView>
        </View>
    )
}

export default VideoDetailScreen
