import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScrollView } from "react-native-gesture-handler";

import axios from "axios"
import { base_url } from '../helper/helper.js';
import VideoUpload from '../Modal/VideoUpload.jsx';
import HeaderComponent from '../components/HeaderComponent.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserchannelProfile } from '../actions/channel.actions.js';
import VideoTabComponent from '../components/tabSectionComponents/VideoTabComponent.jsx';
import PlaylistTabComponent from '../components/tabSectionComponents/PlaylistTabComponent.jsx'
import TweetsTabComponent from '../components/tabSectionComponents/TweetsTabComponent.jsx';
import SubscribedTabcomponent from '../components/tabSectionComponents/SubscribersComponent.jsx';
import { useTheme } from 'expo-theme-switcher';
import { UserType } from '../context/UserContext.js';
import axiosInstance from '../helper/axiosInstance.js';

const Tab = createMaterialTopTabNavigator();

const ChannelScreen = ({ route }) => {
  const scrollRef = useRef(null)
  const [user, setUser] = useContext(UserType);
  const [selectedSection, setSelectedSection] = useState("Videos")
  const [userchannelProfile, setUserChannelProfile] = useState({})
  const [isModalVisible, setModalVisible] = useState(false);
  const userId = route.params.channel._id
  const { currentTheme } = useTheme()

  const sections = [
    {
      id: 1,
      name: "Videos",
      component: VideoTabComponent,
    },
    {
      id: 2,
      name: "Playlist",
      component: PlaylistTabComponent
    },
    {
      id: 3,
      name: "Tweets",
      component: TweetsTabComponent
    },
    {
      id: 4,
      name: "Subscribers",
      component: SubscribedTabcomponent
    },
  ]

  const handleGetUserProfile = async () => {
    const response = await axiosInstance.get(`users/get-user-channel/${userId}`)
    // console.log("response :: ", response.isSubscribed);
    setUserChannelProfile(response.data.data[0])
  }

  useEffect(() => {
    handleGetUserProfile()
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <HeaderComponent />
        <View>
          <View>
            <Image source={{ uri: userchannelProfile?.coverImage }} style={styles.coverImage} />
          </View>
          <View style={styles.profileContainer}>
            <Image source={{ uri: userchannelProfile?.avatar }} style={styles.avatar} />
            <View style={styles.profileTextContainer}>
              <Text style={styles.fullName}>{userchannelProfile?.fullName}</Text>
              <Text style={styles.username}>@{userchannelProfile?.username}</Text>
            </View>
            <Text style={styles.subscribersCount}>{userchannelProfile?.subscribersCount} subscribers</Text>
          </View>
        </View>
        <View style={styles.tabContainer}>
          <Tab.Navigator
            tabBarOptions={{
              labelStyle: styles.tabLabel,
              style: styles.tabBar,
              indicatorStyle: styles.tabIndicator,
            }}
          >
            {sections.map((section) => (
              <Tab.Screen
                key={section.id}
                name={section.name}
                component={section.component}
                options={{
                  tabBarLabel: ({ focused }) => (
                    <Text style={[styles.tabBarLabelText, { color: focused ? "#AE7AFF" : currentTheme?.primaryTextColor }]}>
                      {section.name}
                    </Text>
                  ),
                }}
                initialParams={{ userId: userId }}
              />
            ))}
          </Tab.Navigator>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "#000",
    flex: 1,
    position: 'relative',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  coverImage: {
    width: "100%",
    height: 85,
    resizeMode: "cover",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 5,
    paddingBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "white",
    position: 'absolute',
    top: -30,
    left: 10,
  },
  profileTextContainer: {
    paddingLeft: 110,
    paddingVertical: 10,
  },
  fullName: {
    color: "white",
    fontSize: 17,
  },
  username: {
    color: "#999",
    fontSize: 13,
  },
  subscribersCount: {
    color: "#999",
    fontSize: 13,
    position: 'absolute',
    bottom: -2,
    right: 150,
  },
  tabContainer: {
    flex: 1,
    position: 'relative',
  },
  tabLabel: {
    fontWeight: 'bold',
    color: "white",
  },
  tabBar: {
    backgroundColor: "black",
  },
  tabIndicator: {
    backgroundColor: '#AE7AFF',
    height: 1.5,
  },
  tabBarLabelText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default ChannelScreen