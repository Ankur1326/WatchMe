import { Text, TouchableOpacity, View, Modal, Pressable, Alert, ScrollView, StyleSheet } from 'react-native'
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

    // console.log("Hiiiiiiiiiiiiii");
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
        <View>
            <BottomSlideModal setVisible={setIsVideoModalVisible} isVisible={isVideoModalVisible}>
                <TouchableOpacity onPress={saveToPlaylistHandler} style={styles.modalItem}>
                    <Entypo name="bookmark" size={24} color="white" />
                    <Text style={styles.modalItemText}>Save to Playlist</Text>
                </TouchableOpacity>
            </BottomSlideModal>

            <BottomSlideModal setVisible={setSaveVideoModalVisible} isVisible={isSaveVideoModalVisible}>
                <View style={styles.saveVideoModalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderText}>Save Video to...</Text>
                        <TouchableOpacity onPress={createNewPlaylistModals} style={styles.createNewPlaylistButton}>
                            <Entypo name="plus" size={20} color="#06BCEE" />
                            <Text style={styles.createNewPlaylistText}>New Playlist</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.playlistScrollView}>
                        {playlists.map((playlist) => (
                            <Pressable
                                key={playlist._id}
                                style={[
                                    styles.playlistItem,
                                    { backgroundColor: selectedPlaylistId === playlist._id ? '#333' : '#222' }
                                ]}
                                onPress={() => setSelectedPlaylistId(playlist._id)}
                            >
                                <View style={styles.playlistItemContent}>
                                    <View style={styles.playlistItemSelectionBox(selectedPlaylistId === playlist._id)}>
                                        {selectedPlaylistId === playlist._id && (
                                            <Ionicons name="checkmark" size={18} color="white" />
                                        )}
                                    </View>
                                    <Text style={styles.playlistItemText}>{playlist.name}</Text>
                                </View>
                                <View >
                                    {playlist.isPublish ? (
                                        <EvilIcons name="lock" size={28} color="white" />
                                    ) : (
                                        <Ionicons name="earth" size={22} color="white" />
                                    )}
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>

                    <TouchableOpacity onPress={addVideoToPlaylistHandler} style={styles.doneButton}>
                        <Ionicons name="checkmark" size={30} color="white" />
                        <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </BottomSlideModal>

            <CreatePlaylist isVisible={isCreateNewPlaylistModalVisible} setVisible={setCreateNewPlaylistModalVisible} />

            <Modal
                animationType='slide'
                transparent={true}
                visible={isSuccessfullyCreatedMessageVisible}
            >
                <View style={styles.successfullyCreatedMessage}>
                    <Text style={styles.successfullyCreatedMessageText}>Playlist created</Text>
                    <TouchableOpacity onPress={() => { }} style={styles.seeListButton}>
                        <Text style={styles.seeListButtonText}>See List</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalItem: {
        flexDirection: 'row',
        alignItems: '',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        margin: "auto",
        width: "100%"
    },
    modalItemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    saveVideoModalContent: {
        backgroundColor: '#222',
        width: '95%',
        alignSelf: 'center',
        borderRadius: 15,
        paddingBottom: 10,
        paddingHorizontal: 8,
        height: 300,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderColor: 'gray',
        paddingVertical: 7,
    },
    modalHeaderText: {
        fontSize: 16,
        color: 'white',
    },
    createNewPlaylistButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    createNewPlaylistText: {
        fontSize: 15,
        color: '#06BCEE',
    },
    playlistScrollView: {
        flex: 1,
        paddingVertical: 15,
    },
    playlistItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
        width: "100%",
        paddingRight: 30
    },
    playlistItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 25,
    },
    playlistItemSelectionBox: (selected) => ({
        width: 18,
        height: 18,
        borderWidth: 0.8,
        borderColor: selected ? 'white' : 'gray',
        backgroundColor: selected ? '#06BCEE' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    playlistItemText: {
        fontSize: 13,
        color: 'white',
        flex: 1,
    },
    doneButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 13,
        borderTopWidth: 0.8,
        borderTopColor: 'gray',
        marginTop: 10,
    },
    doneButtonText: {
        color: 'white',
        marginLeft: 8,
    },
    successfullyCreatedMessage: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#F2F2F2',
        marginBottom: 65,
        alignSelf: 'center',
        borderRadius: 10,
        width: '90%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    successfullyCreatedMessageText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    seeListButton: {
        marginLeft: 'auto',
    },
    seeListButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#06a4ee',
    },
})

export default memo(BottomSlideModalToHomePage)