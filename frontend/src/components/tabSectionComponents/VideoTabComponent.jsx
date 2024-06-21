import { Alert, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PopupMessage from '../PopupMessage';
import { deleteVideoHandler, getAllAnoterChannelVideosHandler, getAllVideosHandler, togglePublishStatusHander } from '../../actions/video.actions';
import CustomConfirmationDialog from '../../Modal/CustomConfirmationDialog';
import VideoUpload from '../../Modal/VideoUpload';
import EditVideo from '../../Modal/EditVideo';
import { UserType } from '../../context/UserContext';
import BottomSlideModal from '../../Modal/BottomSlideModal';

const VideoTabComponent = ({ route }) => {
    const navigation = useNavigation()

    const [user, setUser] = useContext(UserType);
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

    const userId = route?.params?.userId || user._id;

    const handleGetAllVideos = async () => {
        const params = {
            page: 1,
            limit: 10,
            // query: 'someQuery',
            sortBy: 'createdAt',
            sortType: 'desc',
            userId: user._id
        }
        try {
            let allVideos;
            if (userId === user._id) {
                allVideos = await getAllVideosHandler(params)
            } else {
                allVideos = await getAllAnoterChannelVideosHandler(userId)
            }
            // console.log(response.data.videos);
            // console.log("allVideos : ", allVideos);
            setVideos(allVideos)
        } catch (error) {
            console.log("error while gettting all videos", error);
        }
    }
    useFocusEffect(
        useCallback(() => {
            handleGetAllVideos();
        }, [])
    );

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

        // console.log(" dele : ", videoId);
    }

    const conformDeleteVideo = async () => {
        try {
            console.log("videoId : ", videoId);
            setIsVideoModalVisible(false)
            setShowLoader(true)

            await deleteVideoHandler(videoId) // action

            handleGetAllVideos()
            // setDeleteVideoId("")
            setSuccess(true)
        } catch (error) {
            console.log("Error while deleting video: ", error);
            setShowLoader(true)
            // setDeleteVideoId("")
            setSuccess(false)
        } finally {
            setShowLoader(false)
            setPopupMessageShow(true)
            setTimeout(() => setPopupMessageShow(false), 3000);
        }
    }

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
            const isPublished = await togglePublishStatusHander(videoId)
            setPublishStatus(isPublished)

        } catch (error) {
            console.log("Error while toggle publish status : ", error);
        }
    }


    // getVideo based on videoId
    const getVideo = async (videoId) => {

        try {
            await getVideoByVideoIdHandler(videoId)
            setPublishStatus(response.isPublished)
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


            <View style={{ flex: 1, backgroundColor: "#121212", }}>
                {/* video content  */}
                <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10 }} >
                    <FlatList
                        data={videos}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => navigation.push("VideoDetail", { data: item })} style={{ borderBottomWidth: 0.4, borderBottomColor: "gray", paddingBottom: 15 }} >
                                {/* < */}
                                <View style={{ flexDirection: 'row', gap: 15, position: 'relative', alignItems: 'flex-start' }}>
                                    {/* thumbnail */}
                                    <Image source={{ uri: item?.thumbnail }} style={{ width: 170, height: 110, borderRadius: 6 }} />

                                    {/* video duration */}
                                    <Text style={{ color: "white", fontSize: 16, fontWeight: 600, position: 'absolute', bottom: 10, left: 110, backgroundColor: "#000000c3", fontWeight: 700, paddingHorizontal: 7, paddingVertical: 1, borderRadius: 5 }} >{(item?.duration / 60)?.toString()?.substring(0, 4)}</Text>

                                    {/* title and date */}
                                    <View>
                                        <Text style={{ color: "white", fontSize: 15, fontWeight: 600 }} >

                                            {item?.title.length > 15 ? `${item?.title.slice(0, 15)}...` : item?.title}
                                        </Text>
                                        {/* <Text>10k Views</Text> */}
                                        <Text style={{ color: "#dbdbdb", fontSize: 13, }} >
                                            {
                                                formatDistanceToNow(new Date(item?.createdAt), {
                                                    addSuffix: true,
                                                })?.toString()
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
                                {/* <Modal
                                    animationType='slide'
                                    transparent={true}
                                    visible={isVideoModalVisible}
                                >
                                </Modal> */}

                                <BottomSlideModal isVisible={isVideoModalVisible} setVisible={setIsVideoModalVisible}>
                                    {
                                        userId === user._id ?
                                            (
                                                <View style={{ width: "100%" }}>
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
                                                    <TouchableOpacity onPress={() => {
                                                        setShowConfirmation(true)
                                                        setIsVideoModalVisible(false)
                                                    }} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                                                        <AntDesign name="delete" size={24} color="white" />
                                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Delete</Text>
                                                    </TouchableOpacity>

                                                </View>
                                            )
                                            :
                                            (
                                                <View style={{ width: "100%", }}>
                                                    <TouchableOpacity style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Add Buttons over here ...</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                    }

                                </BottomSlideModal>


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
                        )}
                        keyExtractor={item => item._id}
                        ListEmptyComponent={() => (
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
                        )}
                    />
                </View>

                {/* add btn  */}
                {
                    userId === user._id &&
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: "#E4D3FF", paddingHorizontal: 10, paddingVertical: 8, position: 'absolute', bottom: 20, right: 20, zIndex: 99, borderRadius: 50 }}>
                        <FontAwesome6 name="add" size={28} color="#AE7AFF" />
                    </TouchableOpacity>
                }

                <VideoUpload isVisible={isModalVisible} setVisible={setModalVisible} getAllVideos={handleGetAllVideos} />
                <EditVideo isVisible={editVideoModalVisible} videoId={videoId} onClose={onClose} getAllVideos={handleGetAllVideos} />
            </View>
        </View>
    )
}

export default VideoTabComponent

const styles = StyleSheet.create({})