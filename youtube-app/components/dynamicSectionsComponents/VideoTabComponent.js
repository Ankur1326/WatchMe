import { Alert, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { UserType } from '../../UserContext';
import { base_url } from '../../helper/helper';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import VideoUpload from '../../Modal/VideoUpload';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import EditVideo from '../../Modal/EditVideo';
import { useNavigation } from "@react-navigation/native";

const VideoTabComponent = () => {
    const navigation = useNavigation()

    const [user, setUser] = useContext(UserType);
    const [videos, setVideos] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
    const [showLoader, setShowLoader] = useState(false)

    const getAllVideos = async () => {
        const params = {
            page: 1,
            limit: 10,
            // query: 'someQuery',
            sortBy: 'createdAt',
            sortType: 'desc',
            userId: user._id
        }
        try {
            const accessToken = await AsyncStorage.getItem("accessToken")
            const response = await axios.get(`${base_url}/videos/`, {
                params,
                headers: {
                    Authorization: `${accessToken}`,
                }
            })
            // console.log(response.data.videos);
            setVideos(response.data.videos)
        } catch (error) {
            console.log("error while gettting all videos", error);
        }
    }

    useEffect(() => {
        getAllVideos()
    }, [closeModal])

    // Modal 

    const showModal = () => {
        setModalVisible(true)
    }
    const closeModal = () => {
        setModalVisible(false)
    }

    const [optionsVisible, setOptionsVisible] = useState(null);
    // const handleOptionVisible = (videoId) => {
    //     setOptionsVisible((prevState) => (prevState == videoId ? null : videoId))
    // }

    const [videoId, setVideoId] = useState("")
    // three dots
    const videoModalVisible = (videoId) => {
        getVideo(videoId)
        setIsVideoModalVisible(true)
        setVideoId(videoId)
        // console.log(" dele : ", videoId);
    }

    const deleteVideoHandler = (videod) => {

        // console.log("deleteVideoId : ", videoId);
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this Video?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => conformDeleteVideo(videoId)
                }
            ]
        )
    }

    const conformDeleteVideo = async (videoId) => {
        try {
            // console.log("videoId : ", videoId);
            setIsVideoModalVisible(false)
            setShowLoader(true)

            const accessToken = await AsyncStorage.getItem("accessToken")
            await axios.delete(`${base_url}/videos/${videoId}`,
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    }
                }
            )
            // console.log("response : ", response);
            getAllVideos()
            setDeleteVideoId("")
        } catch (error) {
            console.log("Error while deleting video: ", error);
            setShowLoader(true)
            setDeleteVideoId("")
        } finally {
            setShowLoader(false)
        }
    }

    const [editVideoModalVisible, setEditVideoModalVisible] = useState(false)

    // onClose for editVideo
    const onClose = () => {
        setEditVideoModalVisible(false)
    }

    const editVideoHandler = async () => {
        setIsVideoModalVisible(false)
        setEditVideoModalVisible(true)
    }

    // publish and unpumbish toggle ************
    const togglePublishStatus = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("accessToken")
            const response = await axios.patch(`${base_url}/videos/toggle/publish/${videoId}`,
                {},
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    }
                }
            )
            setPublishStatus(response.data.data.isPublished)

        } catch (error) {
            console.log("Error while toggle publish status : ", error);
        }
    }


    const [publishStatus, setPublishStatus] = useState(true)
    // getVideo based on videoId
    const getVideo = async (videoId) => {

        try {
            const accessToken = await AsyncStorage.getItem("accessToken")
            const response = await axios.get(`${base_url}/videos/${videoId}`,
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    }
                }
            )
            setPublishStatus(response.data.data.isPublished)
        } catch (error) {
            console.log("error while getting video : ", error);
        }
    }

    return (
        <View style={{ flex: 1 }} >

            {showLoader && (
                <ActivityIndicator style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "#00000084", zIndex: 99, }} size={65} color="#FFFFFF" />
            )}

            {/* add btn  */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: "#E4D3FF", paddingHorizontal: 10, paddingVertical: 8, position: 'absolute', bottom: 20, right: 20, zIndex: 99, borderRadius: 50 }}>
                <FontAwesome6 name="add" size={28} color="#AE7AFF" />
            </TouchableOpacity>

            <ScrollView style={{ flex: 1, backgroundColor: "#121212", }}>
                {/* video content  */}
                <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10 }} >
                    {
                        videos.length > 0 ? (
                            <View style={{ flexDirection: 'column', gap: 15, position: 'relative' }}>
                                {
                                    videos.map((item, index) => (
                                        <Pressable onPress={() => navigation.navigate("VideoDetail", { data: item })} key={index} style={{ borderBottomWidth: 0.4, borderBottomColor: "gray", paddingBottom: 15 }} >
                                            {/* < */}
                                            <View style={{ flexDirection: 'row', gap: 15, position: 'relative', alignItems: 'flex-start' }}>
                                                {/* thumbnail */}
                                                <Image source={{ uri: item?.thumbnail }} style={{ width: 170, height: 110, borderRadius: 6 }} />

                                                {/* video duration */}
                                                <Text style={{ color: "white", fontSize: 16, fontWeight: 600, position: 'absolute', bottom: 10, left: 110, backgroundColor: "#000000c3", fontWeight: 700, paddingHorizontal: 7, paddingVertical: 1, borderRadius: 5 }} >{(item?.duration / 60).toString().substring(0, 4)}</Text>

                                                {/* title and date */}
                                                <View>
                                                    <Text style={{ color: "white", fontSize: 15, fontWeight: 600 }} >

                                                        {item?.title.length > 15 ? `${item?.title.slice(0, 15)}...` : item.title}
                                                    </Text>
                                                    {/* <Text>10k Views</Text> */}
                                                    <Text style={{ color: "#dbdbdb", fontSize: 13, }} >
                                                        {
                                                            formatDistanceToNow(new Date(item.createdAt), {
                                                                addSuffix: true,
                                                            }).toString()
                                                        }
                                                    </Text>
                                                </View>

                                                {/* dots */}
                                                <Pressable onPress={() => videoModalVisible(item._id)} style={[
                                                    { borderColor: "white", paddingHorizontal: 7, paddingVertical: 7, borderRadius: 0, borderBottomWidth: 0, position: "absolute", right: 5 },
                                                    item._id == optionsVisible && { backgroundColor: "#333", }
                                                ]}>
                                                    <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                                                </Pressable>
                                            </View>
                                            {/* toggle dots */}
                                            {/* {item._id == optionsVisible && (
                                                <View style={{ position: "absolute", right: 5, top: 40, backgroundColor: "#333", borderColor: "#c9c9c9", borderRadius: 0 }}>
                                                    <TouchableOpacity style={{ paddingHorizontal: 30, paddingVertical: 12, borderBlockColor: "#c9c9c9", borderBottomWidth: 0.5 }} >
                                                        <Text style={{ color: "white", textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>Unpublish</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{ paddingHorizontal: 30, paddingVertical: 12 }}>
                                                        <Text style={{ color: "white", textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>Delete</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )} */}

                                            <Modal
                                                animationType='slide'
                                                transparent={true}
                                                visible={isVideoModalVisible}
                                            >
                                                <View style={{ width: "95%", flex: 1, alignSelf: 'center', justifyContent: 'flex-end', }}>
                                                    <View style={{ backgroundColor: "#222", flex: 1 / 3, alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 15, width: "95%", alignSelf: 'center', borderRadius: 15, paddingBottom: 10 }}>
                                                        <TouchableOpacity onPress={() => setIsVideoModalVisible(false)} style={{ position: 'absolute', zIndex: 99, right: 10, top: 10 }} >
                                                            <Entypo name="cross" size={34} color="white" />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => togglePublishStatus()} style={{ width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                                                            {
                                                                publishStatus == true ? (
                                                                    <View style={{ flexDirection: 'row', gap: 15 }}>
                                                                        <MaterialCommunityIcons name="earth-off" size={24} color="white" />
                                                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Unpublish</Text>
                                                                        <Text style={{ fontSize: 12, color: "green", borderWidth: 0.5, borderColor: "green", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15 }} >Publish</Text>
                                                                    </View>

                                                                ) : (
                                                                    <View style={{ flexDirection: 'row', gap: 15 }} >

                                                                        <Fontisto name="world-o" size={24} color="white" />
                                                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Publish</Text>
                                                                        <Text style={{ fontSize: 12, color: "red", borderWidth: 0.5, borderColor: "red", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15 }} >Unpublish</Text>
                                                                    </View>
                                                                )
                                                            }
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => editVideoHandler()} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                                                            <Feather name="edit" size={24} color="white" />
                                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Edit</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => deleteVideoHandler()} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                                                            <AntDesign name="delete" size={24} color="white" />
                                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Delete</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </Modal>

                                        </Pressable>
                                    ))
                                }
                            </View>
                        ) : (
                            // Empty video page
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginTop: 30, gap: 15, paddingHorizontal: 20 }} >
                                <View style={{ backgroundColor: "#E4D3FF", paddingVertical: 15, paddingHorizontal: 15, borderRadius: 50, }} >
                                    <Ionicons name="play-outline" size={28} color="#AE7AFF" />
                                </View>

                                <Text style={{ fontSize: 20, color: "white", fontWeight: 600 }} >No videos uploaded</Text>
                                <Text style={{ fontSize: 16, color: "white", textAlign: 'center' }} >This page has yet to upload a video. Search another page in order to find more videos.</Text>

                                <TouchableOpacity onPress={() => showModal()} style={{ backgroundColor: "#AE7AFF", paddingVertical: 10, flexDirection: 'row', gap: 4, paddingLeft: 10, paddingRight: 13 }} >
                                    <Feather name="plus" size={24} color="black" />
                                    <Text style={{ fontSize: 16 }} >New Video</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>

                <VideoUpload isVisible={isModalVisible} onClose={closeModal} getAllVideos={getAllVideos} />
                <EditVideo isVisible={editVideoModalVisible} videoId={videoId} onClose={onClose} getAllVideos={getAllVideos} />
            </ScrollView>
        </View>
    )
}

export default VideoTabComponent

const styles = StyleSheet.create({})