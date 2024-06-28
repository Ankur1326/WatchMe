import { View, Image, StyleSheet, StatusBar, Pressable, Text, FlatList, ActivityIndicator, RefreshControl, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import HeaderComponentt from "../components/HeaderComponent.jsx";
import { useTheme } from 'expo-theme-switcher';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSlideModalToHomePage from "../Modal/BottomSlideModalToHomePage.jsx";
import VideoSkeletonLoader from "../components/SkeletonLoader/VideoSkeletonLoader.jsx";
import axiosInstance from "../helper/axiosInstance.js";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const { currentTheme } = useTheme()
  const navigation = useNavigation()
  const [videos, setVideos] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false)
  const [optionsVisible, setOptionsVisible] = useState(null);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleGetAllPublishVideos = async (page = 1, query = '') => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`videos/getAll-publish-video/?page=${page}&limit=10&query=${query}`)
      const data = response.data.data
      if (page === 1) {
        setVideos(data);
      } else {
        setVideos((prevVideos) => [...prevVideos, ...data]);
      }
    } catch (error) {
      if (error.message === "Network Error") {
        showMessage({
          message: "!Ooops",
          description: "Network Error",
          type: "danger"
        })
        // Alert.alert("Oh no❗", error.message)
      }
    } finally {
      setRefreshing(false);
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetAllPublishVideos(currentPage, searchQuery)
  }, [currentPage, searchQuery])

  const loadingMoreVideos = async () => {
    if (!loading && !refreshing && videos.length > 0) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    setCurrentPage(1)
    setVideos([]) // remove all videos from videos array 
    handleGetAllPublishVideos(1, searchQuery)
  }

  const [videoId, setVideoId] = useState("")
  const videoModalVisible = (videoId) => {
    setIsVideoModalVisible(!isVideoModalVisible)
    setVideoId(videoId)
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setVideos([]);
    handleGetAllPublishVideos(1, query);
  };

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
      <HeaderComponentt onSearch={handleSearch} />
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={videos}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderListItem}
        ListEmptyComponent={refreshing ? <View><VideoSkeletonLoader /><VideoSkeletonLoader /><VideoSkeletonLoader /></View> : renderEmptyState()}
        ListFooterComponent={() => (
          <View>
            {loading && searchQuery === "" && <ActivityIndicator size="large" color="#AE7AFF" />}
          </View>
        )}
        onEndReached={loadingMoreVideos}
        onEndReachedThreshold={0.5}
        windowSize={5}
      />
      <BottomSlideModalToHomePage showMessage={showMessage} isVideoModalVisible={isVideoModalVisible} setIsVideoModalVisible={setIsVideoModalVisible} videoId={videoId} />
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
    marginVertical: 8,
    paddingBottom: 20,
  },
  videoContainer: {
    position: 'relative',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    fontSize: 12,
  },
  dotsButton: {
    padding: 7,
    borderRadius: 5,
  },
  dotsButtonActive: {
    backgroundColor: '#333',
  },
});

export default HomeScreen;
