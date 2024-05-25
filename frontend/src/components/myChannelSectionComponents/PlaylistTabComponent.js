import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import PopupMessage from '../PopupMessage';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import CreatePlaylist from '../../Modal/CreatePlaylist';
import { UserType } from '../../context/UserContext';
import { base_url } from '../../helper/helper';
import { fetchPlaylists } from '../../store/slices/playlistSlice';

const PlaylistTabComponent = () => {
  const dispatch = useDispatch()
  const playlists = useSelector((state) => state?.playlists?.playlists)
  const loading = useSelector((state) => state.playlists.loading)
  const isSuccess = useSelector((state) => state.playlists.isSuccess)
  const message = useSelector((state) => state.playlists.message)
  const [user, setUser] = useContext(UserType);
  const navigation = useNavigation();
  const [isPopupMessageShow, setPopupMessageShow] = useState(false)
  // console.log("playlists :::" , playlists);
  const [isCreatePlaylistModalVisible, setCreatePlaylistModalVisible] = useState(false)

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchPlaylists(user?._id))
    }
  }, [dispatch, user._id])

  const conformDeleteVideo = async (videoId) => {
    // console.log("called conformDeleteVideo", videoId);
    // const playlistId = playlistData._id;
    // console.log("playlistId : ", playlistId);
    try {
      dispatch(deleteVideoFromPlaylsit({ videoId, playlistId }))
      navigation.goBack()
    } catch (error) {
      console.log("Error while deleting playlist: ", error);
    } finally {
      isPopupMessageShow(true)
      setTimeout(() => {
        isPopupMessageShow(false)
      }, 1000);
    }
  };

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
      getUserPlaylists()
    } catch (error) {
      console.log("Error while deleting playlist: ", error);
    } finally {
    }
  }

  return (
    <>
      <ScrollView style={{ backgroundColor: "#111", paddingVertical: 10 }} >
        <PopupMessage isSuccess={isSuccess} title={message} isVisible={isPopupMessageShow} setVisible={setPopupMessageShow} />
        {
          playlists &&
          playlists?.map((item) => (
            <Pressable onLongPress={() => console.log("hiii")} key={item?._id} onPress={() => navigation.navigate("ChannelPlaylistVideosPage", { data: item })} style={{ paddingBottom: 15, paddingTop: 10, paddingHorizontal: 10 }}>

              <View style={{ width: 145, height: 6, marginBottom: 2, backgroundColor: "#a992ad", borderTopLeftRadius: 25, borderTopRightRadius: 25, position: 'absolute', left: 22 }} ></View>

              <View style={{ flexDirection: 'row', gap: 15, position: 'relative', alignItems: 'flex-start' }} >
                {/* thumbnail */}
                <View style={{ position: 'relative', alignItems: 'center', width: 170, height: 90, borderRadius: 6, overflow: 'hidden', }} >
                  {
                    item?.videosCount === 0 ?
                      <View style={{ width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center', flexDirection: 'column', overflow: 'hidden' }} >
                        <Image source={{ uri: "https://i.postimg.cc/28dBxzgR/empty-playlsit.png" }} style={{ height: "100%", width: "100%" }} />
                      </View>
                      :
                      <Image source={{ uri: item?.playlistThumbnail }} style={{ height: "100%", width: "100%" }} />
                  }
                  {/* videos count  */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: "#00000091", paddingHorizontal: 6, borderRadius: 5, position: 'absolute', bottom: 10, right: 10, justifyContent: 'center' }} >
                    <MaterialCommunityIcons name="playlist-play" size={15} color="white" />
                    <Text style={{ color: "white", fontSize: 13, fontWeight: "600", paddingVertical: 5 }} >{item?.videosCount}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: 200 }}>
                    {/* playlist name */}
                    <Text style={{ color: "white", fontSize: 13, fontWeight: 600 }} >{item?.name}</Text>
                    <Text style={{ color: "#dbdbdb", fontSize: 11, width: 100 }} >{item?.description.length > 25 ? `${item.description.substring(0, 25)}...` : item.description}</Text>
                    {/* <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }} >{playlist?.description}</Text> */}
                  </View>
                </View>

                <Pressable onPress={{}} style={[
                  { borderColor: "white", paddingHorizontal: 7, paddingVertical: 7, borderRadius: 0, borderBottomWidth: 0, position: "absolute", right: 5 },
                  // item._id == optionsVisible && { backgroundColor: "#333", }
                ]}>
                  <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                </Pressable>

              </View>
            </Pressable>
          ))
        }
      </ScrollView >
      {/* add btn  */}
      < TouchableOpacity onPress={() => setCreatePlaylistModalVisible(!isCreatePlaylistModalVisible)} style={{ backgroundColor: "#E4D3FF", paddingHorizontal: 10, paddingVertical: 10, position: 'absolute', bottom: 20, right: 20, zIndex: 99, borderRadius: 100 }}>
        <MaterialCommunityIcons name="playlist-plus" size={27} color="#AE7AFF" />
        {/* <FontAwesome6 name="add" size={28} color="#AE7AFF" /> */}
      </TouchableOpacity >

      <CreatePlaylist isVisible={isCreatePlaylistModalVisible} setVisible={setCreatePlaylistModalVisible} />
    </>
  )
}

export default PlaylistTabComponent