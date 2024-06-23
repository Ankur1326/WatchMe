import { View, Image, ScrollView, StyleSheet, StatusBar, Pressable, Text, Button, FlatList, ActivityIndicator, TextInput, RefreshControl, Alert } from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";
import { base_url } from "../helper/helper.js";
import { formatDistanceToNow } from 'date-fns';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
  const [error, setError] = useState("")

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
      console.log("error :: ", error.message);
      if (error.message === "Network Error") {
        // setError("Oh no❗", error.message)
        Alert.alert("Oh no❗", error.message)
      }
    }
  }, [])

  useEffect(() => {
    handleFetchCurrentUser();
  }, [])

  const handleGetAllPublishVideos = async (page = 1) => {
    setLoading(true);
    // setRefreshing(true)
    console.log("currentPage ", currentPage);
    try {
      const response = await axiosInstance.get(`videos/getAll-publish-video/?page=${currentPage}&limit=10`)
      const data = response.data.data
      if (page === 1) {
        setVideos(data);
      } else {
        setVideos((prevVideos) => [...prevVideos, ...data]);
      }
    } catch (error) {
      if (error.message === "Network Error") {
        // setError("Oh no❗", error.message)
        Alert.alert("Oh no❗", error.message)
      }
    } finally {
      setRefreshing(false);
      setLoading(false)
    }
  }

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
    // error ?
    // (
    // <View style={styles.errorContainer}>
    //   <View style={[styles.iconContainer, { backgroundColor: currentTheme?.primaryBackgroundColor }]}>
    //     <MaterialIcons name="error" size={200} color="white" />
    //   </View>
    //   <Text style={[styles.errorTitle, { color: currentTheme?.primaryTextColor }]}>Ooops!</Text>
    //   <Text style={[styles.errorMessage, { color: currentTheme?.primaryTextColor }]}>
    //     It seems there is something wrong with your internet connection. start again
    //   </Text>
    // </View>
    // ) : (
    <View style={styles.emptyContainer}>
      <View style={[styles.iconContainer, { backgroundColor: currentTheme?.primaryBackgroundColor }]}>
        <Ionicons name="play-outline" size={28} color="#AE7AFF" />
      </View>
      <Text style={[styles.title, { color: currentTheme?.primaryTextColor }]}>No videos available</Text>
      <Text style={[styles.message, { color: currentTheme?.primaryTextColor }]}>
        There are no videos here available. Please try to search something else.
      </Text>
    </View>
    // )
  );
  const renderListItem = ({ item }) => (
    <Pressable onPress={() => navigation.navigate("VideoDetail", { data: item })} style={[styles.videoItem, { borderBottomColor: currentTheme.primaryBorderColor }]}>
      <View style={styles.videoContainer}>
        {/* Thumbnail */}
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />

        {/* Video Duration */}
        <Text style={styles.videoDuration}>{(item.duration / 60).toString().substring(0, 4)}</Text>

        {/* Title and Date */}
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            {/* Channel Avatar Image */}
            <Image source={{ uri: item.userDetails[0]?.avatar }} style={styles.avatar} />
            <View>
              {/* Title */}
              <Text style={[styles.title, { color: currentTheme.primaryTextColor }]}>{item.title}</Text>
              {/* Views and Time Ago */}
              <View style={styles.subtitleRow}>
                <Text style={[styles.subtitle, { color: currentTheme.secondaryTextColor }]}>{item.userDetails[0]?.username} • </Text>
                <Text style={[styles.subtitle, { color: currentTheme.secondaryTextColor }]}>{item.views} Views • </Text>
                <Text style={[styles.subtitle, { color: currentTheme.secondaryTextColor }]}>
                  {
                    formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* Dots */}
          <Pressable onPress={() => videoModalVisible(item._id)} style={[styles.dotsButton, item._id == optionsVisible && styles.dotsButtonActive]}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  )

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.primaryBackgroundColor }]}>
      <StatusBar barStyle="light-content" />
      <HeaderComponentt />
      <PopupMessage isSuccess={isSuccess} title={message} isVisible={isPopupMessageShow} setVisible={setPopupMessageShow} />
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={videos}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderListItem}
        ListEmptyComponent={refreshing ? <View><VideoSkeletonLoader /><VideoSkeletonLoader /><VideoSkeletonLoader /></View> : renderEmptyState()}
        ListFooterComponent={() => loading && <ActivityIndicator size="large" color="#AE7AFF" />}
        onEndReached={loadingMoreVideos}
        onEndReachedThreshold={0.5}
        windowSize={5}
      />
      <BottomSlideModalToHomePage isVideoModalVisible={isVideoModalVisible} setIsVideoModalVisible={setIsVideoModalVisible} videoId={videoId} setPopupMessageShow={setPopupMessageShow} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 100,
  },
  iconContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    gap: 15,
    paddingHorizontal: 20,
    marginTop: '50%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
  },
  videoItem: {
    borderBottomWidth: 1,
    paddingBottom: 26,
    // marginHorizontal: 4,
    marginVertical: 8,
  },
  videoContainer: {
    flexDirection: 'column',
    position: 'relative',
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: '100%',
    height: 210,
    borderRadius: 8,
  },
  videoDuration: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    position: 'absolute',
    bottom: 60,
    right: 10,
    backgroundColor: '#000000c3',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 5,
  },
  titleContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 13,
  },
  dotsButton: {
    // paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  dotsButtonActive: {
    backgroundColor: '#333',
  },
});

export default HomeScreen;
