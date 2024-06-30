import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import CustomDeleteDialog from '../../Modal/CustomDeleteDialog';
import EditVideo from '../../Modal/EditVideo';
import BottomSlideModal from '../../Modal/BottomSlideModal';
import axiosInstance from '../../helper/axiosInstance';

const VideoTabComponent = ({ route, initialParams, showMessage }) => {
    const navigation = useNavigation()
    const [videos, setVideos] = useState([]);
    const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
    const [showLoader, setShowLoader] = useState(false)
    const [optionsVisible, setOptionsVisible] = useState(null);
    const [editVideoModalVisible, setEditVideoModalVisible] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [videoId, setVideoId] = useState("")
    const { isOwner, userId } = initialParams

    const handleGetAllVideos = useCallback(async () => {
        try {
            let allVideos;
            if (isOwner) {
                const params = {
                    page: 1,
                    limit: 10,
                    // query: 'someQuery',
                    sortBy: 'createdAt',
                    sortType: 'desc',
                    userId
                }
                const response = await axiosInstance.get(`videos/`, { params })
                allVideos = response.data.videos
            } else {
                const response = await axiosInstance.get(`videos/getAll-anoter-channel-videos/${userId}`)
                allVideos = response.data.data
            }
            setVideos(allVideos)
        } catch (error) {
            console.log("error while gettting all videos", error);
        }
    }, [isOwner, userId])

    useEffect(() => {
        handleGetAllVideos();
    }, [handleGetAllVideos]);

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

            await axiosInstance.delete(`videos/${videoId}`)

            handleGetAllVideos()
            // setDeleteVideoId("")
        } catch (error) {
            console.log("Error while deleting video: ", error);
            setShowLoader(true)
            // setDeleteVideoId("")
        } finally {
            setShowLoader(false)
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
            const response = await axiosInstance.patch(`videos/toggle/publish/${videoId}`, {})
            if (response.data.statusCode === 200) {
                handleGetAllVideos()
                showMessage({
                    message: "Success",
                    description: response.data.message,
                    type: "success",
                })
            }
        } catch (error) {
            console.log("Error while toggle publish status : ", error);
            showMessage({
                message: "Error",
                description: "Error while toggle video status",
                type: "danger",
            })

        }
    }

    // getVideo based on videoId
    const getVideo = async (videoId) => {
        try {
            await axiosInstance.get(`videos/${videoId}`)
        } catch (error) {
            console.log("error while getting video : ", error);
        }
    }

    const renderListItem = ({ item }) => (
        <Pressable onPress={() => navigation.push("VideoDetail", { data: item })} style={{ borderBottomWidth: 0.4, borderBottomColor: "gray", paddingVertical: 15 }}>
            <View style={{ flexDirection: 'row', gap: 15, position: 'relative', alignItems: 'flex-start' }}>
                <Image source={{ uri: item?.thumbnail }} style={styles.thumbnail} />
                <Text style={styles.durationText}>{(item?.duration / 60)?.toString()?.substring(0, 4)}</Text>
                <View>
                    <Text style={styles.videoTitle}>{item?.title.length > 15 ? `${item?.title.slice(0, 15)}...` : item?.title}</Text>
                    <Text style={styles.videoDate}>
                        {formatDistanceToNow(new Date(item?.createdAt), {
                            addSuffix: true,
                        })}
                    </Text>
                </View>
                <Pressable onPress={() => videoModalVisible(item._id)} style={[styles.dotsButton, item._id == optionsVisible && { backgroundColor: "#333" }]}>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                </Pressable>
            </View>

            <BottomSlideModal isVisible={isVideoModalVisible} setVisible={setIsVideoModalVisible}>
                {isOwner ? (
                    <View style={styles.confirmationDialogContainer}>
                        <TouchableOpacity onPress={() => togglePublishStatus()} style={styles.confirmationButton}>
                            {item.isPublished ? (
                                <View style={{ flexDirection: 'row', gap: 15 }}>
                                    <MaterialCommunityIcons name="earth-off" size={24} color="white" />
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }}>Unpublish</Text>
                                    <Text style={{ fontSize: 12, color: "green", borderWidth: 0.5, borderColor: "green", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15 }}>Publish</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', gap: 15 }}>
                                    <Fontisto name="world-o" size={24} color="white" />
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }}>Publish</Text>
                                    <Text style={{ fontSize: 12, color: "red", borderWidth: 0.5, borderColor: "red", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 15 }}>Unpublish</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => editVideoHandler()} style={styles.confirmationButton}>
                            <Feather name="edit" size={24} color="white" />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            setShowConfirmation(true);
                            setIsVideoModalVisible(false);
                        }} style={styles.confirmationButton}>
                            <AntDesign name="delete" size={24} color="white" />
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.confirmationDialogContainer}>
                        <TouchableOpacity style={styles.confirmationButton}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }}>Add Buttons over here ...</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </BottomSlideModal>

            <CustomDeleteDialog
                showConfirmation={showConfirmation}
                title="Delete Video"
                message="Are you sure you want to delete this Video"
                onCancel={() => {
                    setShowConfirmation(false);
                }}
                onConfirm={() => {
                    conformDeleteVideo();
                    setShowConfirmation(false);
                }}
            />
        </Pressable>
    )
    const emptyListItem = () => (
        <View style={styles.emptyListComponent}>
            <View style={{ backgroundColor: "#E4D3FF", paddingVertical: 15, paddingHorizontal: 15, borderRadius: 50 }}>
                <Ionicons name="play-outline" size={28} color="#AE7AFF" />
            </View>
            <Text style={{ fontSize: 20, color: "white", fontWeight: 600 }}>No videos uploaded</Text>
            <Text style={{ fontSize: 16, color: "white", textAlign: 'center' }}>This page has yet to upload a video. Search another page in order to find more videos.</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            {showLoader && (
                <ActivityIndicator style={styles.absoluteFill} size={65} color="#FFFFFF" />
            )}

            <View style={styles.videoItemContainer}>
                <FlatList
                    data={videos}
                    keyExtractor={item => item._id.toString()}
                    renderItem={renderListItem}
                    ListEmptyComponent={emptyListItem}
                />
                <EditVideo isVisible={editVideoModalVisible} videoId={videoId} onClose={onClose} getAllVideos={handleGetAllVideos} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    absoluteFill: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#00000084",
        zIndex: 99,
    },
    videoItemContainer: {
        backgroundColor: "#121212",
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    thumbnail: {
        width: 170,
        height: 110,
        borderRadius: 6,
    },
    durationText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        position: 'absolute',
        bottom: 10,
        left: 110,
        backgroundColor: "#000000c3",
        paddingHorizontal: 7,
        paddingVertical: 1,
        borderRadius: 5,
    },
    videoTitle: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
    videoDate: {
        color: "#dbdbdb",
        fontSize: 13,
    },
    dotsButton: {
        paddingHorizontal: 7,
        paddingVertical: 7,
        position: "absolute",
        right: 5,
    },
    confirmationDialogContainer: {
        width: "100%",
    },
    confirmationButton: {
        width: "100%",
        borderBottomWidth: 0.5,
        borderColor: "gray",
        paddingVertical: 15,
        flexDirection: 'row',
        gap: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    addVideoButton: {
        backgroundColor: "#E4D3FF",
        paddingHorizontal: 10,
        paddingVertical: 8,
        position: 'absolute',
        // bottom: 20,
        top: 20,
        right: 20,
        zIndex: 99,
        borderRadius: 50,
    },
    emptyListComponent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginTop: 30,
        gap: 15,
        paddingHorizontal: 20,
    },
    emptyVideoButton: {
        backgroundColor: "#AE7AFF",
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 4,
        paddingLeft: 10,
        paddingRight: 13,
    },
});

export default memo(VideoTabComponent)