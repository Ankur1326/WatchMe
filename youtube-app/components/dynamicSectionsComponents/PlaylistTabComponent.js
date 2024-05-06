import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BlurView } from 'expo-blur';
import { UserType } from '../../UserContext';
import axios from 'axios';
import { base_url } from '../../helper/helper';

const PlaylistTabComponent = () => {
  const [user, setUser] = useContext(UserType);
  const [playlists, setPlaylists] = useState([]);
  // const [playlist, setPlaylists] = useState([]);

  const getUserPlaylists = useCallback(async () => {
    try {
      const userId = user._id;
      const fetchedPlaylists = await axios.get(`${base_url}/playlist/user/${userId}`)
      console.log(fetchedPlaylists.data.data);
      setPlaylists(fetchedPlaylists.data.data)
    } catch (error) {
      console.log("error while getting playlist with userID ", error);
    }
  })


  useEffect(() => {
    getUserPlaylists()
  }, [])

  // playlists.map((playlist) => {
  //   console.log(playlist.playlistThumbnail);
  // })

  return (
    <ScrollView style={{ backgroundColor: "#111", }} >

      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 10, paddingVertical: 20 }} >

        {playlists.map((playlist) => (
          <Pressable style={{ width: "100%", alignItems: 'center' }}>
            <View style={{ width: "85%", height: 10, marginBottom: 5, backgroundColor: "#a992ad", borderTopLeftRadius: 25, borderTopRightRadius: 25 }} ></View>

            <View style={{ position: 'relative', alignItems: 'center', height: 200, width: "100%", borderRadius: 20, overflow: 'hidden', }} >
              <Image source={{ uri: playlist?.playlistThumbnail }} style={{ height: "100%", width: "100%" }} />
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