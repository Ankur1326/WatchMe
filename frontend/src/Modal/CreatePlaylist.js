import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { EvilIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { createPlaylist } from '../store/slices/playlistSlice';

const CreatePlaylist = ({ isVisible, setVisible }) => {
    const dispatch = useDispatch()
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [privacyStatus, setPrivacyStatus] = useState("")
    const [isPopupMessageShow, setPopupMessageShow] = useState(false)
    const isSuccess = useSelector(state => state.playlists.isSuccess)
    const loading = useSelector(state => state.playlists.loading)
    const message = useSelector(state => state.playlists.message)

    // create new playlist 
    const createNewPlaylistHandler = async () => {
        try {
            dispatch(createPlaylist({ name, description, privacyStatus }))
            setVisible(false)
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

    return (
        <View style={{}} >

            {/* video upload modal  */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={isVisible}
                onRequestClose={() => setVisible(false)}
                style={{}}
            >
                <View style={{ height: "80%", marginTop: 45 }} >
                    <ScrollView showsVerticalScrollIndicator={true} style={{ backgroundColor: "#121212", width: "93%", alignSelf: "center", borderWidth: 1, borderColor: "white", height: "100%", }}>

                        {/* header  */}
                        <View style={{ borderBottomWidth: 1, borderBottomColor: "white", flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 11 }} >
                            <Text style={{ fontSize: 15, color: "white" }}>Create New Playlist</Text>
                            {/* onPress={saveHandler} */}
                            <TouchableOpacity onPress={() => createNewPlaylistHandler()} style={{ backgroundColor: "#AE7AFF", paddingHorizontal: 7, paddingVertical: 4 }}>
                                <Text style={{ fontWeight: 600, paddingHorizontal: 7, paddingVertical: 3 }} >Create</Text>
                            </TouchableOpacity>
                        </View>

                        {/* name  */}
                        <View style={{ marginTop: 15, alignSelf: 'center', width: "90%" }} >
                            <Text style={{ color: "white", }} >Name*</Text>
                            <TextInput onChangeText={text => setName(text)} style={{ borderWidth: 1, borderColor: "white", marginTop: 4, paddingVertical: 4, paddingHorizontal: 8, color: "white" }} />
                        </View>

                        {/* description  */}
                        <View style={{ marginTop: 15, alignSelf: 'center', width: "90%", marginBottom: 20 }} >
                            <Text style={{ color: "white", }} > Description*</Text>
                            <TextInput multiline onChangeText={text => setDescription(text)} style={{ borderWidth: 1, borderColor: "white", marginTop: 4, paddingVertical: 8, paddingHorizontal: 8, color: "white", height: 200, textAlignVertical: 'top' }} />
                        </View>

                        <View style={{ position: 'relative', zIndex: 98, width: "90%", alignSelf: "center", paddingBottom: 100 }}>
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
                                    // () => privacyOptionSelector()
                                    <Pressable onPress={{}} style={{ backgroundColor: "#222", borderWidth: 1, position: 'absolute', zIndex: 99, top: 30, left: 10, width: "94%", borderRadius: 5 }}>
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
                    </ScrollView>

                </View>
            </Modal>

        </View>
    )
}

export default CreatePlaylist