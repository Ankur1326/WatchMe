import { ActivityIndicator, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import { getVideoByVideoIdHandler, updateVideoHandler } from '../actions/video.actions';

const EditVideo = ({ isVisible, videoId, onClose, getAllVideos }) => {
    const [video, setVideo] = useState({})
    const [title, setTitle] = useState(video?.title)
    const [description, setDescription] = useState(video?.description)
    const [thumbnail, setThumbnail] = useState(video?.thumbnail)
    const [thumbnailImage, setThumbnailImage] = useState(video?.thumbnail)
    const [loader, setLoader] = useState(false)

    // Fetch video data based on videoId when the modal becomes visible
    useEffect(() => {
        if (isVisible && videoId) {
            getVideo(videoId);
        }
    }, [isVisible, videoId]);

    // getVideo based on videoId
    const getVideo = async (videoId) => {
        try {
            const video = await getVideoByVideoIdHandler(videoId)
            // console.log("video : ", video?.thumbnail);
            setVideo(video)
            setTitle(video.title)
            setDescription(video.description)
            setThumbnailImage(video.thumbnail)
            // getAllVideos() // refresh videos when user update one video
        } catch (error) {
            console.log("error while getting video : ", error);
        }
    }

    // pick thumbnail 
    const pickThumbnail = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'image/*',
        });
        if (!result.canceled) {
            // set Image url 
            setThumbnail(result.assets[0])
            setThumbnailImage(result.assets[0].uri)
        }
    };

    const handleViderUpdate = async () => {
        try {
            setLoader(true)
            const videoId = video._id

            const formData = new FormData()
            formData.append("title", title);
            formData.append("description", description);

            if (thumbnail?.uri) {
                formData.append("thumbnail", { uri: thumbnail.uri, name: thumbnail.name.trim(), type: "image/jpg", })
            }

            await updateVideoHandler(videoId, formData)

            setLoader(false)
            onClose()
        } catch (error) {
            console.log("Error while updating video : ", error);
        } finally { setLoader(false) }
    }

    const handleClose = () => {
        // Clear state on close
        setVideo({});
        setTitle('');
        setDescription('');
        setThumbnail(null);
        setThumbnailImage('');
        onClose();
    };

    return (
        <View style={{}} >
            <Modal
                animationType='slide'
                transparent={true}
                visible={isVisible}
                //   onRequestClose={onClose}
                style={{}}
            >
                <View style={{ height: "80%", marginTop: 45, width: "93%", backgroundColor: "#121212", alignSelf: "center", borderWidth: 1, borderColor: "white", paddingHorizontal: 10 }} >
                    {/* header  */}
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "gray" }} >
                        <View style={{ flexDirection: 'column', gap: 7 }}>
                            <View style={{ flexDirection: 'row', gap: 30 }} >
                                <Text style={{ fontSize: 20, color: "white", fontWeight: 'bold' }}>Edit Video</Text>
                                {
                                    loader == true ? (
                                        <ActivityIndicator size={30} color="white" />
                                    ) : (
                                        <Feather name="edit-2" size={26} color="white" />
                                    )
                                }
                            </View>
                            <Text style={{ fontSize: 12, color: "gray", }}>Share where you've worked on your profile.</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleClose()} style={{ marginRight: 6 }}>
                            <Entypo name="cross" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={true} style={{}}>

                        {/* thumbnail  */}
                        <View style={{ marginTop: 15, alignSelf: 'center', width: "93%" }} >
                            <Text style={{ color: "white", marginBottom: 6 }} >Thumbnail*</Text>
                            <TouchableOpacity onPress={() => pickThumbnail()} style={{ position: 'relative', borderWidth: 1, borderStyle: 'dashed', borderColor: "white", height: 200, padding: 10 }} >
                                <Image src={`${thumbnailImage}`} style={{ width: "100%", height: "100%" }} />

                                {/* <TouchableOpacity style={{ backgroundColor: "#AE7AFF", paddingVertical: 15, paddingHorizontal: 15, position: 'absolute', borderRadius: 100, right: 15, top: 15 }}>
                                    <Feather name="edit-2" size={25} color="white" />
                                </TouchableOpacity> */}

                            </TouchableOpacity>
                        </View>

                        {/* title  */}
                        <View style={{ marginTop: 15, alignSelf: 'center', width: "93%" }} >
                            <Text style={{ color: "white", }} >Title*</Text>

                            <TextInput value={title} onChangeText={(text) => setTitle(text)} style={{ borderWidth: 1, borderColor: "white", marginTop: 4, paddingVertical: 4, paddingHorizontal: 8, color: "white" }} />
                        </View>

                        {/* description  */}
                        <View style={{ marginTop: 15, alignSelf: 'center', width: "93%", marginBottom: 20 }} >
                            <Text style={{ color: "white", }} > Description*</Text>
                            <TextInput multiline value={description} onChangeText={(text) => setDescription(text)} style={{ borderWidth: 1, borderColor: "white", marginTop: 4, paddingVertical: 8, paddingHorizontal: 8, color: "white", height: 200, textAlignVertical: 'top' }} />
                        </View>

                        {/* Cancel and Update */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, width: "93%", alignSelf: 'center' }} >
                            <TouchableOpacity onPress={handleClose} style={{ borderWidth: 1, borderColor: "white", paddingHorizontal: "15%", paddingVertical: 8 }} >
                                <Text style={{ color: "white" }} >Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleViderUpdate()} style={{ paddingHorizontal: "15%", paddingVertical: 8, backgroundColor: "#AE7AFF" }} >
                                <Text style={{ color: "black" }} >Update</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>

                </View>
            </Modal>
        </View>
    )
}

export default EditVideo