import { Text, TouchableOpacity, View, Modal, Pressable, Alert, ScrollView } from 'react-native'
import React, { memo, useCallback, useContext, useEffect, useState } from 'react'
import { PanGestureHandler, TextInput } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons, MaterialIcons, EvilIcons, Entypo, Octicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { base_url } from '../helper/helper';
import { useDispatch, useSelector } from 'react-redux';
import { UserType } from '../context/UserContext';
import { fetchPlaylists, createPlaylist } from '../store/slices/playlistSlice';
import BottomSlideModal from './BottomSlideModal';
import CreatePlaylist from './CreatePlaylist';
import PopupMessage from '../components/PopupMessage';

const BottomSlideModalToHomePage = ({ isVideoModalVisible, setIsVideoModalVisible, videoId, setPopupMessageShow }) => {
    const dispatch = useDispatch()
    const animation = useSharedValue(0)
    const [isSaveVideoModalVisible, setSaveVideoModalVisible] = useState(false)
    const [isCreateNewPlaylistModalVisible, setCreateNewPlaylistModalVisible] = useState(false)
    const [title, setTitle] = useState("")
    const [privacyStatus, setPrivacyStatus] = useState("")
    const [isSuccessfullyCreatedMessageVisible, setSuccessfullyCreatedMessageVisible] = useState(false)
    const [user, setUser] = useContext(UserType);
    // const [playlists, setPlaylists] = useState([])
    const [selectedPlaylist, setSelectedPlakylist] = useState("")
    // const playlists

    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)
    const playlists = useSelector((state) => state.playlists.playlists)
    // console.log("playlists ::", playlists);
    const isSuccess = useSelector((state) => state.playlists.isSuccess)

    useEffect(() => {
        dispatch(fetchPlaylists(user._id))
    }, [dispatch, user._id])

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
            dispatch(createPlaylist({ title, privacyStatus, videoId }))

        } catch (error) {
            Alert.alert("Playlist is not created", error.message)
            console.log("Error while creating new Playlist : ", error);
        } finally {
            setPopupMessageShow(true)
            setTimeout(() => {
                setPopupMessageShow(false)
            }, 2000);
        }
    }

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
            }
        } catch (error) {
            console.log("error while adding video in that playlist", error);

        } finally {
            setPopupMessageShow(true)
            setTimeout(() => {
                setPopupMessageShow(false)
            }, 3000);
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
            console.log("error while removing video from playlist", error);
        } finally {
            setPopupMessageShow(true)
            setTimeout(() => {
                setPopupMessageShow(false)
            }, 3000);
        }
    }

    return (
        <View >
            <BottomSlideModal setVisible={setIsVideoModalVisible} isVisible={isVideoModalVisible}>
                <TouchableOpacity onPress={() => saveToPlaylistHandler()} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, paddingHorizontal: 15, flexDirection: 'row', gap: 25, alignItems: 'center' }}>
                    <Octicons name="bookmark" size={24} color="white" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Save to Playlist</Text>
                </TouchableOpacity>
            </BottomSlideModal>

            {/* save video to modal */}
            <BottomSlideModal setVisible={setSaveVideoModalVisible} isVisible={isSaveVideoModalVisible}>
                <View style={{ backgroundColor: "#222", width: "95%", alignSelf: 'center', borderRadius: 15, paddingBottom: 10, paddingHorizontal: 8, height: 300 }}>

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
                        <View style={{ flexDirection: 'column', gap: 15, borderRightWidth: 1, borderColor: 'white', paddingVertical: 15 }}>
                            {
                                playlists.map((playlist) => (
                                    <Pressable
                                        onPress={() => setSelectedPlaylistId(playlist?._id)} key={playlist._id}
                                        style={{
                                            width: "100%",
                                            // paddingVertical: 15,
                                            flexDirection: 'row', gap: 25,
                                            paddingHorizontal: 10,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: selectedPlaylistId === playlist._id ? '#333' : "#222",
                                        }}>

                                        {/* selection box */}
                                        <View
                                            style={{
                                                flexDirection: 'row', gap: 25,
                                            }}
                                        >
                                            <View style={{
                                                width: 18,
                                                height: 18,
                                                borderWidth: 0.8,
                                                borderColor: selectedPlaylistId === playlist._id ? "white" : "gray",
                                                backgroundColor: selectedPlaylistId === playlist._id ? "#06BCEE" : "transparent"
                                            }}></View>

                                            <Text style={{ fontSize: 13, color: "white" }} >
                                                {playlist?.name.length > 25 ? `${playlist.name.substring(0, 25)}...` : playlist.name}
                                            </Text>
                                        </View>
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
            </BottomSlideModal>


            {/* create New Playlist Modal  */}

            <CreatePlaylist isVisible={isCreateNewPlaylistModalVisible} setVisible={setCreateNewPlaylistModalVisible} />


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



        </View >
    )
}

export default memo(BottomSlideModalToHomePage)