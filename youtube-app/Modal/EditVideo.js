import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { base_url } from '../helper/helper';
import AsyncStorage from "@react-native-async-storage/async-storage"
import UploadingVideo from './UploadingVideo';
import { Entypo } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';

const EditVideo = ({ isVisible, videoId, onClose, getAllVideos }) => {

    const [video, setVideo] = useState("")
    const [title, setTitle] = useState(video?.title)
    const [description, setDescription] = useState(video?.description)
    const [thumbnail, setThumbnail] = useState(video?.thumbnail)
    const [thumbnailImage, setThumbnailImage] = useState("")
    const [loader, setLoader] = useState(false)
    // console.log("thumbnailImage : ", thumbnailImage);

    // getVideo based on videoId
    const getVideo = async (videoId) => {

        try {
            const accessToken = await AsyncStorage.getItem("accessToken")
            console.log("Hiii");
            const response = await axios.get(`${base_url}/videos/${videoId}`,
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    }
                }
            )

            setVideo(response.data.data)
            setTitle(video.title)
            setDescription(video.description)
            setThumbnailImage(video.thumbnail)
            getAllVideos() // refresh videos when user update one video
        } catch (error) {
            console.log("error while getting video : ", error);
        }
    }

    useEffect(() => {
        getVideo(videoId)
    }, [isVisible, videoId])

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

    const updateHandler = async () => {
        try {
            setLoader(true)
            const accessToken = await AsyncStorage.getItem("accessToken")
            const videoId = video._id

            const formData = new FormData()
            formData.append("title", title);
            formData.append("description", description);
            formData.append("thumbnail", { uri: thumbnail.uri, name: thumbnail.name.trim(), type: "image/jpg", })

            await axios.patch(`${base_url}/videos/${videoId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: accessToken
                    }
                }
            )
            setLoader(false)
            onClose()
        } catch (error) {
            console.log("Error while updating video : ", error);
        } finally { setLoader(false) }
    }

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
                        <TouchableOpacity onPress={() => onClose()} style={{ marginRight: 6 }}>
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
                            <TextInput value={description} onChangeText={(text) => setDescription(text)} style={{ borderWidth: 1, borderColor: "white", marginTop: 4, paddingVertical: 4, paddingHorizontal: 8, color: "white", height: 200 }} />
                        </View>

                        {/* Cancel and Update */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, width: "93%", alignSelf: 'center' }} >
                            <TouchableOpacity onPress={onClose} style={{ borderWidth: 1, borderColor: "white", paddingHorizontal: "15%", paddingVertical: 8 }} >
                                <Text style={{ color: "white" }} >Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => updateHandler()} style={{ paddingHorizontal: "15%", paddingVertical: 8, backgroundColor: "#AE7AFF" }} >
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