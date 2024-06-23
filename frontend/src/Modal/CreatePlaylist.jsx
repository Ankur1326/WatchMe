import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, Pressable, StyleSheet } from 'react-native'
import React, { memo, useState } from 'react'
import { EvilIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { createPlaylist } from '../store/slices/playlistSlice';
import MiddleSliderModal from './MiddleSliderModal';

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
        <MiddleSliderModal isVisible={isVisible} setVisible={setVisible} >
            <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Create New Playlist</Text>
                        <TouchableOpacity onPress={createNewPlaylistHandler} style={styles.createButton}>
                            <Text style={styles.createButtonText}>Create</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name*</Text>
                        <TextInput
                            onChangeText={text => setName(text)}
                            style={styles.input}
                        />
                    </View>

                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <Text style={styles.label}>Description*</Text>
                        <TextInput
                            multiline
                            onChangeText={text => setDescription(text)}
                            style={[styles.input, styles.textArea]}
                        />
                    </View>

                    <View style={styles.privacyContainer}>
                        <Text style={styles.privacyText}>Privacy</Text>
                        <TouchableOpacity onPress={() => setPrivacyStatus("")} style={styles.privacyOption}>
                            <View style={styles.privacyOptionContent}>
                                {privacyStatus === "Public" ? (
                                    <Ionicons name="earth" size={22} color="#AE7AFF" />
                                ) : (
                                    <EvilIcons name="lock" size={28} color="#AE7AFF" />
                                )}
                                <Text style={styles.privacyOptionLabel}>{privacyStatus || "Select"}</Text>
                            </View>
                            <MaterialIcons name="keyboard-arrow-down" size={24} color="#AE7AFF" />
                        </TouchableOpacity>

                        {privacyStatus === "" && (
                            <View style={styles.privacyOptionsContainer}>
                                <TouchableOpacity onPress={() => setPrivacyStatus("Public")} style={[styles.privacyOptionItem, { borderTopLeftRadius: 8, borderTopRightRadius: 8 }]}>
                                    <Ionicons name="earth" size={22} color="#AE7AFF" />
                                    <View style={styles.privacyOptionTextContainer}>
                                        <Text style={styles.privacyOptionLabel}>Public</Text>
                                        <Text style={styles.privacyOptionDescription}>Anyone can search for and view</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setPrivacyStatus("Private")} style={[styles.privacyOptionItem, { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }]}>
                                    <EvilIcons name="lock" size={28} color="#AE7AFF" />
                                    <View style={styles.privacyOptionTextContainer}>
                                        <Text style={styles.privacyOptionLabel}>Private</Text>
                                        <Text style={styles.privacyOptionDescription}>Only you can view</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </MiddleSliderModal>
        // <Modal
        //     animationType='slide'
        //     transparent={true}
        //     visible={isVisible}
        //     onRequestClose={() => setVisible(false)}
        //     style={styles.modal}
        // >

        // </Modal>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        backgroundColor: "#121212",
        paddingTop: 25,
        paddingHorizontal: 16,
        width: "100%",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#FFFFFF",
    },
    createButton: {
        backgroundColor: "#AE7AFF",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    createButtonText: {
        color: "#FFFFFF",
        fontWeight: 'bold',
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        color: "#FFFFFF",
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        color: "#FFFFFF",
        fontSize: 16,
    },
    textAreaContainer: {
        marginBottom: 24,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    privacyContainer: {
        marginTop: 16,
    },
    privacyText: {
        color: "white",
        fontSize: 18,
        marginBottom: 16,
    },
    privacyOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    privacyOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    privacyOptionLabel: {
        color: "#AE7AFF",
        fontSize: 16,
        marginLeft: 8,
    },
    privacyOptionsContainer: {
        backgroundColor: "#121212",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        padding: 8,
    },
    privacyOptionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    privacyOptionTextContainer: {
        marginLeft: 8,
    },
    privacyOptionDescription: {
        color: "#FFFFFF",
    },
});



export default memo(CreatePlaylist)