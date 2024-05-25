import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { base_url } from '../helper/helper';
import AsyncStorage from "@react-native-async-storage/async-storage"
import UploadingVideo from './UploadingVideo';


const VideoUpload = ({ isVisible, onClose, getAllVideos }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showUploadingVideoModal, setshowUploadingVideoModal] = useState(false)
  const [uploadStatus, setUploadStatus] = useState("loading")

  const saveHandler = async () => {

    try {
      setUploadStatus("loading")

      onClose() // close the Modal

      const formData = new FormData()
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", { uri: selectedVideo.uri, name: selectedVideo.name.trim(), type: "video/mp4", });
      formData.append("thumbnail", { uri: selectedThumbnail.uri, name: selectedThumbnail.name.trim(), type: "image/jpg", });

      const accessToken = await AsyncStorage.getItem("accessToken")

      setshowUploadingVideoModal(true) // show uploading video popup

      const response = await axios.post(`${base_url}/videos/`, formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${accessToken}`,
          }
        }
      )

      setUploadStatus("success")
      // console.log("response.data", response.data);
      getAllVideos();
    } catch (error) {
      console.log("error while uploading video: ", error);
    }
  }

  // pick video 
  const pickVideo = async () => {
    // console.log("hii");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
      });

      // console.log("result : ", result.assets[0].uri);
      if (result.canceled == false && result.assets[0].uri) {
        // Update the state with the selected file
        setSelectedVideo(result.assets[0])
      }
      // console.log("result : ", result.assets[0]);
    } catch (error) {
      console.log("error while selecting video : ", error);
    }
  }

  // pick thumbnail 
  const pickThumbnail = async () => {

    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
    });
    // console.log("result : ", result);
    if (!result.canceled) {
      // set Image url 
      setSelectedThumbnail(result.assets[0])
    }

  };

  const onOpenUploadingModal = () => {
    setshowUploadingVideoModal(true)
  }
  const onCloseUploadingModal = () => {
    setshowUploadingVideoModal(false)
  }

  return (
    <View style={{}} >
      {/* video upload modal  */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
        style={{}}
      >
        <View style={{ height: "80%", marginTop: 45 }} >
          <ScrollView showsVerticalScrollIndicator={true} style={{ backgroundColor: "#121212", width: "93%", alignSelf: "center", borderWidth: 1, borderColor: "white", height: 100, }}>

            {/* header  */}
            <View style={{ borderBottomWidth: 1, borderBottomColor: "white", flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 11 }} >
              <Text style={{ fontSize: 15, color: "white" }}>Upload Videos</Text>
              <TouchableOpacity onPress={saveHandler} style={{ backgroundColor: "#AE7AFF", paddingHorizontal: 7, paddingVertical: 4 }}>
                <Text style={{ fontWeight: 600, paddingHorizontal: 7, paddingVertical: 3 }} >Save</Text>
              </TouchableOpacity>
            </View>

            {/* video field  */}
            <View style={{ width: "90%", borderWidth: 1, borderStyle: 'dashed', borderColor: "white", alignSelf: 'center', marginTop: 20, alignItems: 'center', height: 240, justifyContent: 'space-between', gap: 10, paddingVertical: 20, paddingHorizontal: 15 }}>
              {
                selectedVideo !== null ? (
                  <View style={{ flexDirection: 'column', gap: 15, alignItems: 'flex-start', marginHorizontal: 20,  borderColor: "gray", paddingHorizontal: 15, paddingVertical: 10 }} >

                    <View style={{ flexDirection: 'row', alignItems: 'center' , gap: 10}}>
                      <Text style={{ color: "white", fontSize: 18, fontWeight: 600 }} >Name: </Text>
                      <Text style={{ color: "white" }} >{selectedVideo?.name}</Text>
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={{ color: "white", fontSize: 18, fontWeight: 600 }} >Size: </Text>
                      <Text style={{ color: "white" }} >{(selectedVideo?.size / 1024 / 1024).toString().length > 4 ? `${(selectedVideo?.size / 1024 / 1024).toString().substring(0, 4)}MB` : `${selectedVideo?.size / 1024 / 1024}MB`}</Text>
                    </View>

                  </View>
                ) : (
                  <View style={{ alignItems: 'center', gap: 20 }} >
                    <View style={{ backgroundColor: "#E4D3FF", paddingHorizontal: 15, paddingVertical: 15, borderRadius: 50 }} >
                      <Feather name="upload" size={34} color="#AE7AFF" />
                    </View>
                    <Text style={{ color: "gray", textAlign: 'center', fontSize: 12, }} >Your videos will be private untill you publish them.</Text>
                  </View>
                )
              }

              <TouchableOpacity onPress={() => pickVideo()} style={{ backgroundColor: "#AE7AFF", paddingVertical: 6, paddingHorizontal: 10, }}>
                <Text style={{ color: "black", fontWeight: 'bold', }}  >Select Files</Text>
              </TouchableOpacity>
            </View>

            {/* thumbnail  */}
            <View style={{ marginTop: 15, alignSelf: 'center', width: "90%" }} >
              <Text style={{ color: "white", }} >Thumbnail*</Text>
              <View style={{ borderWidth: 1, borderColor: "white", flexDirection: 'row', alignItems: "center", marginTop: 4, paddingVertical: 4, paddingHorizontal: 4 }} >
                <TouchableOpacity onPress={() => pickThumbnail()} style={{ backgroundColor: "#AE7AFF", paddingVertical: 6, paddingHorizontal: 10, }}>
                  <Text style={{ color: "black" }} >Choose File</Text>
                </TouchableOpacity>

                {selectedThumbnail !== null ? (
                  <Text style={{ color: "white", marginLeft: 9 }}>{selectedThumbnail.name.length > 20 ? `${selectedThumbnail.name.substring(0, 20)}...` : selectedThumbnail.name}</Text>
                ) : (
                  <Text style={{ color: "white", marginLeft: 9 }}>No file chosen</Text>
                )}

              </View>
            </View>

            {/* title  */}
            <View style={{ marginTop: 15, alignSelf: 'center', width: "90%" }} >
              <Text style={{ color: "white", }} >Title*</Text>
              <TextInput onChangeText={text => setTitle(text)} style={{ borderWidth: 1, borderColor: "white", marginTop: 4, paddingVertical: 4, paddingHorizontal: 8, color: "white" }} />
            </View>

            {/* description  */}
            <View style={{ marginTop: 15, alignSelf: 'center', width: "90%", marginBottom: 20 }} >
              <Text style={{ color: "white", }} > Description*</Text>
              <TextInput multiline onChangeText={text => setDescription(text)} style={{ borderWidth: 1, borderColor: "white", marginTop: 4, paddingVertical: 8, paddingHorizontal: 8, color: "white", height: 200, textAlignVertical: 'top' }} />
            </View>
          </ScrollView>

        </View>
      </Modal>


      {/* video uploading popup modal  */}
      <UploadingVideo isVisible={showUploadingVideoModal} onClose={onCloseUploadingModal} videoName={selectedVideo?.name} fileSize={selectedVideo?.size} uploadingStatus={uploadStatus} />

    </View>
  )
}

export default VideoUpload
