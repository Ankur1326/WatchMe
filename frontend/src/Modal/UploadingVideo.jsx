import { View, Text, Modal, ActivityIndicator, TouchableOpacity, Pressable, ProgressBarAndroid, Platform, ProgressViewIOS, StyleSheet, Button } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';


const UploadingVideo = ({ isVisible, onClose, videoName, fileSize, uploadingStatus, getAllVideos, uploadProgress }) => {

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={isVisible}
        >
            <View style={{ flexDirection: 'column', gap: 15, width: "90%", height: 260, backgroundColor: "#121212", alignSelf: 'center', marginTop: "40%", borderWidth: 0.5, borderColor: "gray", paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10 }} >
                {/* header  */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }} >
                    <View>
                        <Text style={{ color: "white", fontSize: 17 }}  >Uploading Video...</Text>
                        <Text style={{ color: "white", fontSize: 14, color: "gray" }} >Track your video uploading process.</Text>
                    </View>
                    <Pressable onPress={() => onClose()}>
                        <Entypo name="cross" size={24} color="white" />
                    </Pressable>
                </View>

                {Platform.OS === 'android' ? (
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={uploadProgress / 100}
                        // style={{ width: '80%', color: "#AE7AFF" }}
                        style={styles.progressBar}
                    />
                ) : (
                    <ProgressViewIOS
                        progress={uploadProgress / 100}
                        style={{ width: '80%' }}
                    />
                )}
                {/* card  */}
                <View style={{ flexDirection: 'row', gap: 10, borderWidth: 1, borderColor: "white", paddingVertical: 10, paddingHorizontal: 10, position: 'relative', paddingBottom: 40 }} >
                    <View style={{ backgroundColor: "#E4D3FF", paddingVertical: 5, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }} >
                        <Entypo name="video" size={28} color="#AE7AFF" />
                    </View>
                    <View>
                        <Text style={{ color: "white", fontSize: 17 }} >{videoName?.length > 20 ? `${videoName.substring(0, 20)}... .mp4` : videoName}</Text>
                        <Text style={{ color: "white", fontSize: 14 }} >
                            {(fileSize / 1024 / 1024).toString().length > 4 ? `${(fileSize / 1024 / 1024).toString().substring(0, 4)}MB` : `${fileSize / 1024 / 1024}MB`}
                        </Text>
                    </View>
                    <View style={{ position: 'absolute', bottom: 10, left: 60, flexDirection: 'row', gap: 10 }} >
                        {
                            uploadingStatus == "loading" ? (
                                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                    <ActivityIndicator size={"small"} color={"white"} />
                                    {/* <Text style={{ color: "white" }} >Uploading...</Text> */}
                                    <Text style={styles.progressText}>Upload Progress: {uploadProgress}%</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                    <Entypo style={{ backgroundColor: "#AE7AFF", borderRadius: 50, paddingHorizontal: 3, paddingVertical: 3 }} name="check" size={18} color="white" />
                                    <Text style={{ color: "white" }} >Uploaded Successfully</Text>
                                </View>
                            )
                        }
                    </View>
                </View>

                {/* Cancel and Finish */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }} >
                    <TouchableOpacity style={{ borderWidth: 1, borderColor: "white", paddingHorizontal: "15%", paddingVertical: 8 }} >
                        <Text style={{ color: "white" }} >Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ borderWidth: 1, borderColor: "white", paddingHorizontal: "15%", paddingVertical: 8, backgroundColor: "#E4D3FF" }} >
                        <Text style={{ color: "black" }} >Finish</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    progressText: {
        fontSize: 13,
        color: '#fff',
    },
    progressBar: {
        width: '100%',
        borderRadius: 5,
        overflow: 'hidden',
    },
});

export default UploadingVideo
