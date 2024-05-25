import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScrollView } from "react-native-gesture-handler";

import axios from "axios"
import { base_url } from '../helper/helper.js';
import VideoUpload from '../Modal/VideoUpload.js';
import HeaderComponent from '../components/HeaderComponent.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserchannelProfile } from '../actions/channel.actions.js';
import VideoTabComponent from '../components/anotherChannelSectionCompoenents/VideoTabComponent.jsx';
import PlaylistTabComponent from '../components/anotherChannelSectionCompoenents/PlaylistTabComponent.jsx';
import TweetsTabComponent from '../components/anotherChannelSectionCompoenents/TweetsTabComponent.jsx';
import SubscribedTabcomponent from '../components/anotherChannelSectionCompoenents/SubscribedTabcomponent.jsx';
import { useTheme } from 'expo-theme-switcher';
import { UserType } from '../context/UserContext.js';

const Tab = createMaterialTopTabNavigator();

const ChannelScreen = ({ route }) => {
  const scrollRef = useRef(null)
  const [user, setUser] = useContext(UserType);
  const [selectedSection, setSelectedSection] = useState("Videos")
  const [userchannelProfile, setUserChannelProfile] = useState({})
  const [isModalVisible, setModalVisible] = useState(false);
  const userId = route.params.channel._id
  const { currentTheme } = useTheme()
  // console.log(userId);

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

  // const handleSections = (sectionName) => {
  //   setSelectedSection(sectionName)
  //   // console.log("selectedSection : ", selectedSection);
  // }

  const handleGetUserProfile = async () => {
    const response = await getUserchannelProfile(userId)
    // console.log("response :: ", response.isSubscribed);
    setUserChannelProfile(response)
  }

  useEffect(() => {
    // Scroll to the top of the ScrollView
    // scrollRef.current?.scrollTo({ y: 0, animated: true });
    handleGetUserProfile()
  }, [])

  // close upoad video modal 

  return (
    <SafeAreaView style={{ backgroundColor: "#000", flex: 1, position: 'relative' }}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >

        {/* Header */}
        <HeaderComponent />

        <View style={{}}>

          {/* coverImage */}
          <View>
            <Image source={{ uri: userchannelProfile?.coverImage }} style={{ width: "100%", height: 85, resizeMode: "cover" }} />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, gap: 5, paddingBottom: 12 }} >
            <Image source={{ uri: userchannelProfile?.avatar }} style={{ width: 100, height: 100, resizeMode: "cover", borderRadius: 55, borderWidth: 2, borderColor: "white", position: 'absolute', top: -30, left: 10 }} />
            <View style={{ paddingLeft: 110, paddingVertical: 10 }}>
              <Text style={{ color: "white", fontSize: 17 }} >{userchannelProfile?.fullName}</Text>
              <Text style={{ color: "#999", fontSize: 13 }} >@{userchannelProfile?.username}</Text>
            </View>

            <Text style={{ color: "#999", fontSize: 13, position: 'absolute', bottom: -2, right: 150 }} >{userchannelProfile?.subscribersCount} subscribers</Text>
          </View>

        </View>
        <View style={{ flex: 1, position: 'relative' }}>
          <Tab.Navigator
            tabBarOptions={{
              labelStyle: {
                // fontSize: 10.5,
                fontWeight: 'bold',
                color: "white"
              },
              style: {
                backgroundColor: ({ focused }) => focused ? "yellow" : "black",
                // position: "absolute"
              },
              indicatorStyle: {
                backgroundColor: '#AE7AFF', // Set the indicator color
                height: 1.5,
              },
            }}
          >
            {sections.map((section) => (
              <Tab.Screen key={section.id} name={section.name} component={section.component} options={{
                tabBarLabel: ({ focused, }) => (
                  <Text style={{ fontSize: 12, fontWeight: "bold", color: focused ? "#AE7AFF" : currentTheme?.primaryTextColor, marginBottom: 4 }}>
                    {section.name}
                  </Text>
                ),
              }} initialParams={{ userId: userId }} />
            ))}
          </Tab.Navigator>
        </View>

        {/* <VideoUpload isVisible={isModalVisible} onClose={closeModal} /> */}

      </ScrollView>

    </SafeAreaView>
  )
}

export default ChannelScreen

const styles = StyleSheet.create({})