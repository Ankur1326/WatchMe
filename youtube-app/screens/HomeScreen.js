import { View, Image, ScrollView, StatusBar, Pressable, Text, Button, FlatList, ActivityIndicator, TextInput, RefreshControl } from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";
import { UserType } from '../UserContext';
import { base_url } from "../helper/helper.js";
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import SkeletonLoader from "../components/SkeletonLoader.js";
import HeaderComponentt from "../components/HeaderComponent.js";
import { useTheme } from 'expo-theme-switcher';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSlideModalToHomePage from "../Modal/BottomSlideModalToHomePage.js";

const HomeScreen = () => {
  const { currentTheme } = useTheme()

  const navigation = useNavigation()
  const [videos, setVideos] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useContext(UserType);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null)
  const [refreshing, setRefreshing] = useState(false)
  const [isVisibleskeletion, setIsVisibleskeletion] = useState(true)
  const [optionsVisible, setOptionsVisible] = useState(null);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false)

  const category = [
    {
      id: "0",
      name: "All",
    },
    {
      id: "1",
      name: "Music",
    },
    {
      id: "2",
      name: "Gaming",
    },
    {
      id: "3",
      name: "Science",
    },
    {
      id: "4",
      name: "JavaScript",
    },
    {
      id: "5",
      name: "Movies",
    },
    {
      id: "6",
      name: "Live",
    },
  ];

  // fetch current user 
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {

        const accessToken = await AsyncStorage.getItem("accessToken")
        // console.log(accessToken);
        const response = await axios.get(`${base_url}/users/current-user`, {
          headers: {
            Authorization: `${accessToken}`,
          }
        })

        // console.log(response.data.statusCode);
        if (response.data.statusCode === 200) {
          setUser(response.data.data)
        }

      } catch (error) {
        console.log("error :: ", error);
      }
    }
    fetchCurrentUser();
  }, [])

  const getAllPublishVideos = async () => {
    // console.log("call getAllPublishVideos");

    try {
      const accessToken = await AsyncStorage.getItem("accessToken")
      const response = await axios.get(`${base_url}/videos/getAll-publish-video/?page=${currentPage}&limit=10`, // "&query=o&sortBy=title&sortType=asc"

        {
          headers: {
            Authorization: `${accessToken}`,
          }
        }
      )
      // console.log("response : ", response.data.videos);
      // setVideos(response.data.videos)
      setVideos(prevVideos => [...prevVideos, ...response.data.videos])
    } catch (error) {
      console.log("Error while get all Publish videos", error);
    } finally {
      setRefreshing(false);
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllPublishVideos()
  }, [currentPage])

  const loadingMoreVideos = () => {
    if (!loading && !refreshing) {
      setLoading(true)
      setCurrentPage(currentPage + 1)

      // delay before loading more videos
      setTimeout(async () => {
        getAllPublishVideos()

        // Scroll to the end of the list after loading more videos
        flatListRef.current.scrollToEnd()
        setLoading(false)
      }, 1500);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    setCurrentPage(1)
    setTimeout(() => {
      setVideos([]) // remove all videos from videos array 
      getAllPublishVideos()
    }, 500);
  }

  const [videoId, setVideoId] = useState("")
  const videoModalVisible = (videoId) => {
    setIsVideoModalVisible(!isVideoModalVisible)
    setVideoId(videoId) // setVideoId for sending in bottomSlide.modal
    console.log(" videoId : ", videoId);
  }

  return (
    <SafeAreaView style={{ backgroundColor: currentTheme?.primaryBackgroundColor, flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {/* header  */}
      <HeaderComponentt />

      {/* <Button title="getPublicVideos" onPress={() => getAllPublishVideos()} /> */}

      {/* skeleton loader */}
      {
        <SkeletonLoader isVisibleskeletion={isVisibleskeletion} />
      }

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={{}}>
        {
          videos.length > 0 ? (
            <View style={{ flexDirection: 'column', gap: 25, position: 'relative' }}>
              {
                <FlatList
                  data={videos}
                  key={(item) => item._id.toString()}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => navigation.navigate("VideoDetail", { data: item })} style={{ borderBottomWidth: 1, borderBottomColor: currentTheme?.primaryBorderColor, paddingBottom: 26, }} >
                      <View style={{ flexDirection: 'column', gap: 10, position: 'relative', alignItems: 'flex-start' }}>
                        {/* thumbnail */}
                        <Image source={{ uri: item?.thumbnail }} style={{ width: "100%", height: 210 }} />

                        {/* video duration */}
                        <Text style={{ color: "white", fontSize: 16, fontWeight: 600, position: 'absolute', bottom: 60, right: 10, backgroundColor: "#000000c3", fontWeight: 700, paddingHorizontal: 7, paddingVertical: 1, borderRadius: 5 }} >{(item?.duration / 60).toString().substring(0, 4)}</Text>

                        {/* title and date */}
                        <View>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: 5 }}>
                            {/* channel avatar image */}
                            <Image source={{ uri: item.userDetals[0]?.avatar }} style={{ width: 42, height: 42, borderRadius: 25 }} />
                            <View>
                              {/* titile */}
                              <Text style={{ color: currentTheme?.primaryTextColor, fontSize: 18, fontWeight: 600 }} >
                                {item?.title}
                              </Text>
                              {/* views and time ago */}
                              <View style={{ flexDirection: "row", alignItems: "center", }}>
                                <Text style={{ color: currentTheme?.secondaryTextColor, fontSize: 13, }}>{item.userDetals[0]?.username} • </Text>
                                <Text style={{ color: currentTheme?.secondaryTextColor, fontSize: 13, }}>{item.views} Views • </Text>
                                <Text style={{ color: currentTheme?.secondaryTextColor, fontSize: 13, }} >
                                  {
                                    formatDistanceToNow(new Date(item.createdAt), {
                                      addSuffix: true,
                                    }).toString()
                                  }
                                </Text>
                              </View>

                            </View>

                            {/* dots */}
                            <Pressable onPress={() => videoModalVisible(item._id)} style={[
                              { borderColor: "white", paddingHorizontal: 7, paddingVertical: 7, borderRadius: 0, borderBottomWidth: 0, right: -30 },
                              item._id == optionsVisible && { backgroundColor: "#333", }
                            ]}>
                              <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                            </Pressable>

                          </View>

                        </View>

                      </View>

                    </Pressable>
                  )}
                  onEndReached={loadingMoreVideos}
                  onEndReachedThreshold={0.5}
                  ref={flatListRef}

                />
              }
              {
                loading && <ActivityIndicator size={"large"} style={{ marginBottom: 20 }} />
              }
            </View>
          ) : (
            // Empty video page
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 15, paddingHorizontal: 20, marginTop: "50%" }} >
              <View style={{ backgroundColor: currentTheme?.primaryBackgroundColor, paddingVertical: 15, paddingHorizontal: 15, borderRadius: 50, }} >
                <Ionicons name="play-outline" size={28} color="#AE7AFF" />
              </View>

              <Text style={{ fontSize: 20, color: currentTheme?.primaryTextColor, fontWeight: 600 }} >No videos available</Text>
              <Text style={{ fontSize: 16, color: currentTheme?.primaryTextColor, textAlign: 'center' }} >There are no videos here available. Please try to search some thing else.</Text>

            </View>
          )
        }
      </ScrollView>
      <BottomSlideModalToHomePage isVideoModalVisible={isVideoModalVisible} setIsVideoModalVisible={setIsVideoModalVisible} videoId={videoId}  />
    </SafeAreaView>
  );
};

export default HomeScreen;
