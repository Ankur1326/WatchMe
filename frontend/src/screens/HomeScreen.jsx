import { View, Image, ScrollView, StatusBar, Pressable, Text, Button, FlatList, ActivityIndicator, TextInput, RefreshControl, Alert } from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";
import { base_url } from "../helper/helper.js";
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import SkeletonLoader from "../components/SkeletonLoader.jsx";
import HeaderComponentt from "../components/HeaderComponent.jsx";
import { useTheme } from 'expo-theme-switcher';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSlideModalToHomePage from "../Modal/BottomSlideModalToHomePage.jsx";
import PopupMessage from "../components/PopupMessage.jsx";
import { getAllPublishVideosHandler } from "../actions/video.actions.js";
import { fetchCurrentUserHandler } from "../actions/channel.actions.js";
import { UserType } from "../context/UserContext.js";
import VideoSkeletonLoader from "../components/SkeletonLoader/VideoSkeletonLoader.jsx";
import { useSelector } from "react-redux";
import axiosInstance from "../helper/axiosInstance.js";

const HomeScreen = () => {
  const { currentTheme } = useTheme()

  const navigation = useNavigation()
  const [videos, setVideos] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useContext(UserType);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false)
  const [optionsVisible, setOptionsVisible] = useState(null);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false)
  const [isPopupMessageShow, setPopupMessageShow] = useState(false)

  const isSuccess = useSelector((state) => state.playlists.isSuccess)
  const message = useSelector((state) => state.playlists.message)

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
  const handleFetchCurrentUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`users/current-user`)
      if (response.status === 200) {
        setUser(response.data.data)
      }
    } catch (error) {
      console.log("error :: ", error);
    }
  })

  useEffect(() => {
    handleFetchCurrentUser();
  }, [])

  const handleGetAllPublishVideos = useCallback(async (page = 1) => {
    setLoading(true);
    console.log("currentPage ", currentPage);
    try {
      const response =  await axiosInstance.get(`videos/getAll-publish-video/?page=${currentPage}&limit=10`)
      const data = response.data.data
      if (page === 1) {
        setVideos(data);
      } else {
        setVideos((prevVideos) => [...prevVideos, ...data]);
      }
    } catch (error) {
    } finally {
      setRefreshing(false);
      setLoading(false)
    }
  })

  useEffect(() => {
    handleGetAllPublishVideos(currentPage)
  }, [currentPage])

  const loadingMoreVideos = async () => {
    if (!loading && !refreshing && videos.length > 0) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    setCurrentPage(1)
    setVideos([]) // remove all videos from videos array 
    handleGetAllPublishVideos(1)
  }

  const [videoId, setVideoId] = useState("")
  const videoModalVisible = (videoId) => {
    setIsVideoModalVisible(!isVideoModalVisible)
    setVideoId(videoId)
  }

  const renderEmptyState = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 15, paddingHorizontal: 20, marginTop: "50%" }} >
      <View style={{ backgroundColor: currentTheme?.primaryBackgroundColor, paddingVertical: 15, paddingHorizontal: 15, borderRadius: 50, }} >
        <Ionicons name="play-outline" size={28} color="#AE7AFF" />
      </View>

      <Text style={{ fontSize: 20, color: currentTheme?.primaryTextColor, fontWeight: 600 }} >No videos available</Text>
      <Text style={{ fontSize: 16, color: currentTheme?.primaryTextColor, textAlign: 'center' }} >There are no videos here available. Please try to search some thing else.</Text>
    </View>
  );

  const renderListItem = ({ item }) => (
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
            <Image source={{ uri: item.userDetails[0]?.avatar }} style={{ width: 42, height: 42, borderRadius: 25 }} />
            <View>
              {/* titile */}
              <Text style={{ color: currentTheme?.primaryTextColor, fontSize: 18, fontWeight: 600 }} >
                {item?.title}
              </Text>
              {/* views and time ago */}
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <Text style={{ color: currentTheme?.secondaryTextColor, fontSize: 13, }}>{item.userDetails[0]?.username} • </Text>
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
  )

  return (
    <SafeAreaView style={{ backgroundColor: currentTheme?.primaryBackgroundColor, flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <HeaderComponentt />
      <PopupMessage isSuccess={isSuccess} title={message} isVisible={isPopupMessageShow} setVisible={setPopupMessageShow} />
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={videos}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderListItem}
        ListEmptyComponent={refreshing ? <VideoSkeletonLoader /> : renderEmptyState()}
        ListFooterComponent={() => loading && <ActivityIndicator size="large" color="#AE7AFF" />}
        onEndReached={loadingMoreVideos}
        onEndReachedThreshold={0.5}
        windowSize={5}
      />
      <BottomSlideModalToHomePage isVideoModalVisible={isVideoModalVisible} setIsVideoModalVisible={setIsVideoModalVisible} videoId={videoId} setPopupMessageShow={setPopupMessageShow} />
    </SafeAreaView>
  );
};

export default HomeScreen;
