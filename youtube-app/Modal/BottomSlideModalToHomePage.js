import { Text, TouchableOpacity, View, Modal, Pressable, Alert, ScrollView } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { PanGestureHandler, TextInput } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons, MaterialIcons, EvilIcons, Entypo, Octicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { base_url } from '../helper/helper';
import { UserType } from '../UserContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
const BottomSlideModalToHomePage = ({ isVideoModalVisible, setIsVideoModalVisible, videoId }) => {
    const animation = useSharedValue(0)
    const [isSaveVideoModalVisible, setSaveVideoModalVisible] = useState(false)
    const [isCreateNewPlaylistModalVisible, setCreateNewPlaylistModalVisible] = useState(false)
    const [title, setTitle] = useState("")
    const [privacyStatus, setPrivacyStatus] = useState("")
    const [isSuccessfullyCreatedMessageVisible, setSuccessfullyCreatedMessageVisible] = useState(false)
    const [user, setUser] = useContext(UserType);
    const [playlists, setPlaylists] = useState([])
    const [selectedPlaylist, setSelectedPlakylist] = useState("")
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)
    const [isSuccessfullyAddVideoMessageVisible, setSuccessfullyAddVideoMessageVisible] = useState(false)
    const [isShowErrormessage, setShowErrormessage] = useState(false)


    const gestureHandler = useAnimatedGestureHandler({
        onStart: (event, context) => {
            // console.log(event);
            context.startY = animation.value
        },
        onActive: (event, context) => {
            // console.log(event);
            if (event.translationY > 0) {
                animation.value = context.startY + event.translationY
            }
        },
        onEnd: (event, context) => {
            if (event.translationY > 50 || event.translationY < -50) {
                setIsVideoModalVisible(false)
            } else {
                animation.value = withTiming(0, { duration: 200 })
            }
        }
    })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: animation.value }]
        }
    })

    const saveToPlaylistHandler = () => {
        setIsVideoModalVisible(false)
        setSaveVideoModalVisible(true)
    }
    const createNewPlaylistModals = () => {
        setSaveVideoModalVisible(false)
        setCreateNewPlaylistModalVisible(true)
    }

    // create new playlist 
    const createNewPlaylistHandler = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("accessToken")

            if (title === "" && privacyStatus === "" && videoId === "") {
                // console.log("All fiend is required", "title : ", title, privacyStatus, videoId);
            } else {
                const createdPlaylist = await axios.post(`${base_url}/playlist`,
                    { name: title, isPublish: privacyStatus === "Public" ? true : false, videoId },
                    {
                        headers: {
                            Authorization: accessToken
                        }
                    }
                )
                setCreateNewPlaylistModalVisible(false)
                setSuccessfullyCreatedMessageVisible(true)
                setTimeout(() => {
                    setSuccessfullyCreatedMessageVisible(false)
                }, 2000);
                // console.log("createdPlaylist : ", createdPlaylist);
            }
        } catch (error) {
            Alert.alert("Playlist is not created", error.message)
            console.log("Error while creating new Playlist : ", error);
        } finally { }
    }

    const getUserPlaylists = useCallback(async () => {
        try {
            const userId = user._id;
            const fetchedPlaylist = await axios.get(`${base_url}/playlist/user/${userId}`)
            setPlaylists(fetchedPlaylist.data.data)
        } catch (error) {
            console.log("error while getting playlist with userID ", error);
        }
    })
    
    useEffect(() => {
        getUserPlaylists()
    }, [isSaveVideoModalVisible])

    const addVideoToPlaylistHandler = async () => {
        const accessToken = await AsyncStorage.getItem("accessToken")

        try {
            if (videoId && selectedPlaylistId) {
                const response = await axios.post(`${base_url}/playlist/${selectedPlaylistId}/${videoId}`, {}, {
                    headers: {
                        Authorization: accessToken
                    }
                })
                setSaveVideoModalVisible(false)
                setSuccessfullyAddVideoMessageVisible(true)
                setTimeout(() => {
                    setSuccessfullyAddVideoMessageVisible(false)
                }, 3000);
            }

        } catch (error) {
            console.log("error while getting playlist with userID ", error);
            setShowErrormessage(true)
            setTimeout(() => {
                setShowErrormessage(false)
            }, 4000);
        }
    }

    const removeVideoFromPlaylistHandler = async () => {
        const accessToken = await AsyncStorage.getItem("accessToken")

        try {
            if (videoId && selectedPlaylistId) {
                const response = await axios.post(`${base_url}/playlist/${selectedPlaylistId}/${videoId}`, {}, {
                    headers: {
                        Authorization: accessToken
                    }
                })
                console.log(response);
            }

        } catch (error) {
            console.log("error while getting playlist with userID ", error);
        }
    }

    return (
        <View >
            <Modal
                animationType='slide'
                transparent={true}
                visible={isVideoModalVisible}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', }}>
                    <PanGestureHandler onGestureEvent={gestureHandler}>
                        <Animated.View style={[{ width: "95%", flex: 1, alignSelf: 'center', justifyContent: 'flex-end', }, animatedStyle]}>
                            <View style={{ backgroundColor: "#222", flex: 1 / 3, alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 15, width: "95%", alignSelf: 'center', borderRadius: 15, paddingBottom: 10 }}>

                                {/* <PanGestureHandler onGestureEvent={gestureHandler}>
                                <AnimatedTouchableOpacity onPress={() => { }} style={{ position: 'absolute', top: 5, left: "43%" }} >
                                    <View style={{ width: 55, height: 4, backgroundColor: "#444", borderRadius: 10 }} ></View>
                                </AnimatedTouchableOpacity>
                            </PanGestureHandler> */}

                                <TouchableOpacity onPress={() => setIsVideoModalVisible(false)} style={{ position: 'absolute', top: 10, right: 20 }}>
                                    <Entypo name="cross" size={24} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => saveToPlaylistHandler()} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 25, paddingHorizontal: 20, alignItems: 'center' }}>
                                    <Octicons name="bookmark" size={24} color="white" />
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Save to Playlist</Text>
                                </TouchableOpacity>

                            </View>
                        </Animated.View>
                    </PanGestureHandler>
                </View>
            </Modal>

            {/* save video to modal */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={isSaveVideoModalVisible}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', }}>
                    <PanGestureHandler onGestureEvent={gestureHandler}>
                        <Animated.View style={{ width: "95%", flex: 1, alignSelf: 'center', justifyContent: 'flex-end', }}>

                            <View style={{ backgroundColor: "#222", marginBottom: 15, width: "95%", alignSelf: 'center', borderRadius: 15, paddingBottom: 10, paddingTop: 30, paddingHorizontal: 8, height: 300 }}>

                                {/* cross bnt  */}
                                <TouchableOpacity onPress={() => setSaveVideoModalVisible(false)} style={{ position: 'absolute', top: 10, right: 20 }}>
                                    <Entypo name="squared-cross" size={24} color="white" />
                                </TouchableOpacity>

                                {/* header  */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 7 }}>

                                    <Text style={{ fontSize: 16, color: "white" }} >Save Video to...</Text>

                                    <TouchableOpacity onPress={() => createNewPlaylistModals()} style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
                                        <Entypo name="plus" size={20} color="#06BCEE" />
                                        <Text style={{ fontSize: 15, color: "#06BCEE" }} >New Playlist</Text>
                                    </TouchableOpacity>
                                </View>


                                {/* Playlist lists */}
                                <ScrollView indicatorStyle=''>
                                    <View style={{ borderRightWidth: 1, borderColor: 'white', height: 200 }}>
                                        {
                                            playlists.map((playlist) => (
                                                <Pressable
                                                    onPress={() => setSelectedPlaylistId(playlist?._id)} key={playlist._id}
                                                    style={{
                                                        width: "100%",
                                                        paddingVertical: 15,
                                                        flexDirection: 'row', gap: 25,
                                                        paddingHorizontal: 10,
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        backgroundColor: selectedPlaylistId === playlist._id ? '#333' : "#222"
                                                    }}>

                                                    {/* selection box */}
                                                    <View style={{
                                                        width: 20,
                                                        height: 20,
                                                        borderWidth: 0.8,
                                                        borderColor: "white",
                                                        backgroundColor: selectedPlaylistId === playlist._id ? "#06BCEE" : "transparent"
                                                    }}></View>

                                                    <Text style={{ fontSize: 18, color: "white" }} >{playlist?.name}</Text>
                                                    <View style={{ marginLeft: 50 }}>
                                                        {
                                                            playlist.isPublish ? <EvilIcons name="lock" size={28} color="white" /> : <Ionicons name="earth" size={22} color="white" />
                                                        }

                                                    </View>
                                                </Pressable>

                                            ))
                                        }
                                    </View>
                                </ScrollView>

                                {/* Done btn  */}
                                <TouchableOpacity onPress={() => addVideoToPlaylistHandler()} style={{ paddingHorizontal: 10, paddingTop: 13, borderTopWidth: 0.8, borderTopColor: "gray", flexDirection: 'row', gap: 10, alignItems: 'center' }} >
                                    <Ionicons name="checkmark" size={30} color="white" />
                                    <Text style={{ color: "white" }}>Done</Text>
                                </TouchableOpacity>

                            </View>
                        </Animated.View>
                    </PanGestureHandler>
                </View>
            </Modal>

            {/* create New Playlist Modal  */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={isCreateNewPlaylistModalVisible}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ height: "37%", marginTop: 45, backgroundColor: "#333", width: "88%", paddingHorizontal: 10, borderRadius: 4 }}  >

                        {/* header  */}
                        <View style={{ borderBottomWidth: 1, borderBottomColor: "white", flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', paddingVertical: 11 }} >
                            <Text style={{ fontSize: 15, color: "white" }}>Create New Playlist</Text>
                            {/* cross btn */}
                            <TouchableOpacity onPress={() => setCreateNewPlaylistModalVisible(false)} style={{ backgroundColor: "#AE7AFF", paddingHorizontal: 7, paddingVertical: 4 }}>
                                <Entypo name="squared-cross" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'column', gap: 15 }}>
                            {/* title  */}
                            <View style={{ marginTop: 15, width: "100%" }} >
                                <TextInput onChangeText={(text) => setTitle(text)} placeholder="Title" placeholderTextColor="white" style={{ borderBottomWidth: 1, borderColor: "gray", marginTop: 4, paddingVertical: 4, paddingHorizontal: 8, color: "white" }} />
                            </View>

                            {/* Privacy */}
                            <View style={{ position: 'relative', zIndex: 98 }}>
                                <Text style={{ color: "white", fontSize: 16 }}>Privacy</Text>
                                <TouchableOpacity onPress={() => setPrivacyStatus("")} style={{ borderBottomWidth: 1, borderColor: "gray", marginTop: 4, paddingVertical: 4, paddingHorizontal: 8, color: "white", flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }} >
                                        {privacyStatus == "Public" ? <Ionicons name="earth" size={22} color="#ffffffd2" /> : <EvilIcons name="lock" size={28} color="#ffffffd2" />}
                                        <Text style={{ color: "white", fontSize: 17 }}>{privacyStatus}</Text>
                                    </View>

                                    {/* Bottom arrow */}
                                    <MaterialIcons name="keyboard-arrow-down" size={24} color="#ffffffd2" />

                                </TouchableOpacity>

                                {/* Privacy options  */}
                                {
                                    privacyStatus == "" ? (
                                        <Pressable onPress={() => privacyOptionSelector()} style={{ backgroundColor: "#222", borderWidth: 1, position: 'absolute', zIndex: 99, top: 30, left: 10, width: "94%", borderRadius: 5 }}>
                                            <Pressable onPress={() => { setPrivacyStatus("Public") }} style={{ flexDirection: 'row', gap: 10, alignItems: "start", paddingVertical: 12, paddingHorizontal: 10, backgroundColor: privacyStatus === "Public" ? "#333" : "#222" }}>
                                                <Ionicons name="earth" size={22} color="#ffffffd2" />
                                                <View>
                                                    <Text style={{ color: "white", fontSize: 18 }}> Public</Text>
                                                    <Text style={{ color: "gray" }}> Anyone can search for and view</Text>
                                                </View>
                                            </Pressable>
                                            <Pressable onPress={() => { setPrivacyStatus("Private") }} style={{ flexDirection: 'row', gap: 10, alignItems: "start", paddingVertical: 12, paddingHorizontal: 10, backgroundColor: privacyStatus === "Private" ? "#333" : "#222" }}>
                                                <EvilIcons name="lock" size={28} color="#ffffffd2" />
                                                <View>
                                                    <Text style={{ color: "white", fontSize: 18 }}>Private</Text>
                                                    <Text style={{ color: "gray" }}>Only you can view</Text>
                                                </View>
                                            </Pressable>
                                        </Pressable>
                                    ) : ("")
                                }

                            </View>


                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 15 }}>
                                <Pressable style={{}}>
                                    <Text style={{ color: "#06BCEE", fontWeight: 'bold', fontSize: 17 }}>Cancel</Text>
                                </Pressable>
                                <Pressable disabled={title === "" || privacyStatus === "" ? true : false} onPress={() => createNewPlaylistHandler()} style={{}}>
                                    <Text style={{ color: title === "" ? "gray" : "#06BCEE", fontWeight: 'bold', fontSize: 17 }}>Create</Text>
                                </Pressable>
                            </View>

                        </View>

                    </View>
                </View>
            </Modal>

            {/* playlist created message Modal  */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={isSuccessfullyCreatedMessageVisible}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', width: "100%", }}>

                    <View style={{ backgroundColor: "#F2F2F2", marginBottom: 65, alignSelf: 'center', borderRadius: 10, width: "90%", height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>

                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: "black" }} >Playlist created</Text>

                        <TouchableOpacity onPress={() => { }} style={{}}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: "#06a4ee" }} >see list</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            {/* succesfully add video message */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={isSuccessfullyAddVideoMessageVisible}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', width: "100%", }}>

                    <View style={{ backgroundColor: "#F2F2F2", marginBottom: 65, alignSelf: 'center', borderRadius: 10, width: "90%", height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>

                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: "black" }} >Video added successFully</Text>

                        <TouchableOpacity onPress={() => { }} style={{}}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: "#06a4ee" }} >see all videos</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            {/* modal to show error message */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={isShowErrormessage}
                // visible={true}
            >
                <View style={{ flex: 1, justifyContent: 'center', width: "100%", }}>

                    <View style={{ backgroundColor: "#F65B5B", alignSelf: 'center', marginTop: 50, width: "90%", height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }} >
                            <MaterialIcons name="error-outline" size={24} color="white" fontWeight="200" />
                            <Text style={{ fontSize: 14, color: "white" }} >Video is already added in this playlist</Text>
                        </View>

                        <TouchableOpacity onPress={() => { setShowErrormessage(false) }} style={{}}>
                            <Entypo name="cross" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default BottomSlideModalToHomePage

