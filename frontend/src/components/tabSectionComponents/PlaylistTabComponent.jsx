import { FlatList, Image, Pressable, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import PopupMessage from '../PopupMessage';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import CreatePlaylist from '../../Modal/CreatePlaylist';
import { UserType } from '../../context/UserContext';
import { base_url } from '../../helper/helper';
import { fetchPlaylists } from '../../store/slices/playlistSlice';

const PlaylistTabComponent = ({ route }) => {
  const dispatch = useDispatch()
  const playlists = useSelector((state) => state.playlists.playlists)
  const loading = useSelector((state) => state.playlists.loading)
  const isSuccess = useSelector((state) => state.playlists.isSuccess)
  const message = useSelector((state) => state.playlists.message)
  const [user] = useContext(UserType);
  const navigation = useNavigation();
  const [isPopupMessageShow, setPopupMessageShow] = useState(false)
  // console.log("playlists :::" , playlists);
  const [isCreatePlaylistModalVisible, setCreatePlaylistModalVisible] = useState(false)

  const userId = route?.params?.userId || user._id;
  // console.log(userId);

  const handleFetchPlaylists = () => {
    if (userId !== user?._id) {
      dispatch(fetchPlaylists(userId))
    }
    else {
      dispatch(fetchPlaylists(user?._id))
    }
  }
  useFocusEffect(
    useCallback(() => {
      handleFetchPlaylists()
    }, [])
  );

  const conformDeleteVideo = async (videoId) => {
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
    <View style={styles.container}>
      <PopupMessage isSuccess={isSuccess} title={message} isVisible={isPopupMessageShow} setVisible={setPopupMessageShow} />
      <FlatList
        data={playlists}
        renderItem={({ item }) => (
          <Pressable onLongPress={() => console.log("hiii")} key={item?._id} onPress={() => navigation.navigate("ChannelPlaylistVideosPage", { data: item })} style={styles.playlistItemContainer}>
            <View style={styles.divider}></View>

            <View style={{ flexDirection: 'row', gap: 15, position: 'relative', alignItems: 'flex-start' }} >
              {/* thumbnail */}
              <View style={styles.thumbnailContainer}>
                {
                  item?.videosCount === 0 ?
                    <View style={styles.thumbnailImage}>
                      <Image source={{ uri: "https://i.postimg.cc/28dBxzgR/empty-playlsit.png" }} style={styles.thumbnailImage} />
                    </View>
                    :
                    <Image source={{ uri: item?.playlistThumbnail }} style={styles.thumbnailImage} />
                }
                {/* videos count  */}
                <View style={styles.videoCountContainer}>
                  <MaterialCommunityIcons name="playlist-play" size={15} color="white" />
                  <Text style={{ color: "white", fontSize: 13, fontWeight: "600", paddingVertical: 5 }}>{item?.videosCount}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 200 }}>
                  {/* playlist name */}
                  <Text style={styles.playlistName}>{item?.name}</Text>
                  <Text style={styles.playlistDescription}>{item?.description.length > 25 ? `${item.description.substring(0, 25)}...` : item.description}</Text>
                </View>
              </View>

              <Pressable onPress={() => { }} style={styles.optionsButton}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
              </Pressable>
            </View>
          </Pressable>
        )}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => (
          <View style={styles.emptyListComponent}>
            <View style={styles.emptyListIcon}>
              <AntDesign name="folderopen" size={28} color="#AE7AFF" />
            </View>
            <Text style={styles.emptyListText}>No playlist created</Text>
            <Text style={styles.emptyListSubText}>There are no playlists created on this channel</Text>
          </View>
        )}
      />

      {/* add btn  */}
      {
        userId === user._id &&
        <TouchableOpacity onPress={() => setCreatePlaylistModalVisible(!isCreatePlaylistModalVisible)} style={styles.addBtn}>
          <MaterialCommunityIcons name="playlist-plus" size={27} color="#AE7AFF" />
        </TouchableOpacity>
      }
      {
        userId === user._id &&
        <CreatePlaylist isVisible={isCreatePlaylistModalVisible} setVisible={setCreatePlaylistModalVisible} />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    paddingVertical: 10,
    flex: 1,
  },
  playlistItemContainer: {
    paddingBottom: 15,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  divider: {
    width: 145,
    height: 6,
    marginBottom: 2,
    backgroundColor: '#a992ad',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    left: 22,
  },
  thumbnailContainer: {
    position: 'relative',
    alignItems: 'center',
    width: 170,
    height: 90,
    borderRadius: 6,
    overflow: 'hidden',
  },
  thumbnailImage: {
    height: '100%',
    width: '100%',
  },
  videoCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#00000091',
    paddingHorizontal: 6,
    borderRadius: 5,
    position: 'absolute',
    bottom: 10,
    right: 10,
    justifyContent: 'center',
  },
  playlistName: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  playlistDescription: {
    color: '#dbdbdb',
    fontSize: 11,
    width: 100,
  },
  optionsButton: {
    borderColor: 'white',
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 0,
    borderBottomWidth: 0,
    position: 'absolute',
    right: 5,
  },
  emptyListComponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 30,
    gap: 15,
    paddingHorizontal: 20,
  },
  emptyListIcon: {
    backgroundColor: '#E4D3FF',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  emptyListText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  emptyListSubText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: '#E4D3FF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 99,
    borderRadius: 100,
  },
});

export default PlaylistTabComponent