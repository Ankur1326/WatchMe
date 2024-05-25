import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import PopupMessage from '../PopupMessage';
import CustomConfirmationDialog from '../../Modal/CustomConfirmationDialog';
import { deleteVideoHandler, getAllAnoterChannelVideosHandler } from '../../actions/video.actions';

const VideoTabComponent = ({ route }) => {
    const navigation = useNavigation()

    const [videos, setVideos] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
    const [showLoader, setShowLoader] = useState(false)
    const [optionsVisible, setOptionsVisible] = useState(null);
    const [editVideoModalVisible, setEditVideoModalVisible] = useState(false)
    const [publishStatus, setPublishStatus] = useState(true)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [isSuccess, setSuccess] = useState(false)
    const [isPopupMessageShow, setPopupMessageShow] = useState(false)
    const [videoId, setVideoId] = useState("")

    const userId = route.params.userId

    const handleGetAllVideos = async () => {
        try {
            const allVideos = await getAllAnoterChannelVideosHandler(userId)
            // console.log(allVideos.data);
            setVideos(allVideos)
        } catch (error) {
            console.log("error while gettting all videos", error);
        }
    }

    useEffect(() => {
        handleGetAllVideos()
    }, [closeModal])

    // Modal 

    const showModal = () => {
        setModalVisible(true)
    }
    const closeModal = () => {
        setModalVisible(false)
    }

    // three dots
    const videoModalVisible = (videoId) => {
        getVideo(videoId)
        setIsVideoModalVisible(true)
        setVideoId(videoId)
    }

    // onClose for editVideo
    const onClose = () => {
        setEditVideoModalVisible(false)
    }

    // getVideo based on videoId
    const getVideo = async (videoId) => {

        try {
            await getVideoByVideoIdHandler(videoId)
        } catch (error) {
            console.log("error while getting video : ", error);
        }
    }

    return (
        <View style={{ flex: 1 }} >

            {showLoader && (
                <ActivityIndicator style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "#00000084", zIndex: 99, }} size={65} color="#FFFFFF" />
            )}

            {/* success or faliure popup message  */}
            <PopupMessage isSuccess={isSuccess} title={isSuccess ? "Video delete successfully" : "Video is not being deleted"} isVisible={isPopupMessageShow} setVisible={setPopupMessageShow} />

            <ScrollView style={{ flex: 1, backgroundColor: "#121212", }}>
                {/* video content  */}
                <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10 }} >
                    {
                        videos?.length > 0 ? (
                            <View style={{ flexDirection: 'column', gap: 15, position: 'relative' }}>
                                {
                                    videos.map((item, index) => (
                                        <Pressable onPress={() => navigation.push("VideoDetail", { data: item })} key={index} style={{ borderBottomWidth: 0.4, borderBottomColor: "gray", paddingBottom: 15 }} >
                                            {/* < */}
                                            <View style={{ flexDirection: 'row', gap: 15, position: 'relative', alignItems: 'flex-start' }}>
                                                {/* thumbnail */}
                                                <Image source={{ uri: item?.thumbnail }} style={{ width: 170, height: 110, borderRadius: 6 }} />

                                                {/* video duration */}
                                                <Text style={{ color: "white", fontSize: 16, fontWeight: 600, position: 'absolute', bottom: 10, left: 110, backgroundColor: "#000000c3", fontWeight: 700, paddingHorizontal: 7, paddingVertical: 1, borderRadius: 5 }} >{(item?.duration / 60).toString().substring(0, 4)}</Text>

                                                {/* title and date */}
                                                <View>
                                                    <Text style={{ color: "white", fontSize: 15, fontWeight: 600 }} >
                                                        {item?.title?.length > 15 ? `${item?.title.slice(0, 15)}...` : item.title}
                                                    </Text>
                                                    {/* <Text>10k Views</Text> */}
                                                    <Text style={{ color: "#dbdbdb", fontSize: 13, }} >
                                                        {/* {
                                                            formatDistanceToNow(new Date(item.createdAt), {
                                                                addSuffix: true,
                                                            }).toString()
                                                        } */}
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


                                                    </View>
                                                </View>
                                            </Modal>

                                            {/* Conformation Dialog */}
                                            <CustomConfirmationDialog
                                                showConfirmation={showConfirmation}
                                                title="Delete Video"
                                                message="Are you sure you want to delete this Video"
                                                onCancel={() => {
                                                    setShowConfirmation(false)
                                                }} // Close the confirmation dialog if Cancel is pressed
                                                onConfirm={() => {
                                                    conformDeleteVideo(), // videoId
                                                        setShowConfirmation(false)
                                                }}
                                            />

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
            </ScrollView>
        </View>
    )
}

export default VideoTabComponent

const styles = StyleSheet.create({})