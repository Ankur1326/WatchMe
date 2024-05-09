import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BlurView } from 'expo-blur';
import { UserType } from '../../UserContext';
import axios from 'axios';
import { base_url } from '../../helper/helper';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const PlaylistTabComponent = () => {
  const [user, setUser] = useContext(UserType);
  const [playlists, setPlaylists] = useState([]);
  // const [playlist, setPlaylists] = useState([]);
  const navigation = useNavigation();

  const getUserPlaylists = useCallback(async () => {
    try {
      const userId = user._id;
      const fetchedPlaylists = await axios.get(`${base_url}/playlist/user/${userId}`)
      // console.log(fetchedPlaylists.data.data);
      setPlaylists(fetchedPlaylists.data.data)
    } catch (error) {
      console.log("error while getting playlist with userID ", error);
    }
  })


  useEffect(() => {
    getUserPlaylists()
  }, [])

  const conformDeletePlaylist = async (playlistId) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken")
      await axios.delete(`${base_url}/playlist/${playlistId}`,
        {
          headers: {
            Authorization: `${accessToken}`,
          }
        }
      )
    } catch (error) {
      console.log("Error while deleting playlist: ", error);
    } finally {
    }
  }

  const deleteVideoHandler = (playlistId) => {

    // console.log("deleteVideoId : ", videoId);
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Playlist?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => conformDeletePlaylist(playlistId)
        }
      ]
    )
  }

  return (
    <ScrollView style={{ backgroundColor: "#111", }} >
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 10, paddingVertical: 20 }} >

        {playlists.map((playlist) => (
          <Pressable key={playlist._id} onPress={() => navigation.navigate("ChannelPlaylistVideosPage", { data: playlist })} style={{ width: "100%", alignItems: 'center' }}>
            <View style={{ width: "85%", height: 10, marginBottom: 5, backgroundColor: "#a992ad", borderTopLeftRadius: 25, borderTopRightRadius: 25 }} ></View>

            <View style={{ position: 'relative', alignItems: 'center', height: 200, width: "100%", borderRadius: 20, overflow: 'hidden', }} >
              <Image source={{ uri: playlist?.videos[0].thumbnail }} style={{ height: "100%", width: "100%" }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 12, paddingVertical: 15, width: "100%", height: 60, position: 'absolute', backgroundColor: "#aeaeaeca", bottom: 0, borderTopWidth: 1, borderTopColor: "white" }}>
                <View>
                  {/* playlist name */}
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }} >{playlist?.name}</Text>
                  <Text style={{ color: "white", fontSize: 12, }} >100K View . 2 hours age</Text>
                </View>
                <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }} >{playlist?.videosLength} Videos</Text>
              </View>
            </View>
          </Pressable>

        ))}

      </View >
    </ScrollView >
  )
}

export default PlaylistTabComponent