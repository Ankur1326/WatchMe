import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FlatList, ScrollView } from "react-native-gesture-handler";

import VideoTabComponent from '../components/tabSectionComponents/VideoTabComponent.jsx';
import PlaylistTabComponent from '../components/tabSectionComponents/PlaylistTabComponent.jsx';
import TweetsTabComponent from '../components/tabSectionComponents/TweetsTabComponent.jsx';
import SubscribedTabcomponent from '../components/tabSectionComponents/SubscribedTabcomponent.jsx';
import axios from "axios"
import { base_url } from '../helper/helper.js';
import VideoUpload from '../Modal/VideoUpload.jsx';
import HeaderComponent from '../components/HeaderComponent.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'expo-theme-switcher';
import { UserType } from '../context/UserContext.js';

const Tab = createMaterialTopTabNavigator();
const ProfileScreen = ({ navigation }) => {
    const { currentTheme } = useTheme()
    const scrollRef = useRef(null)
    const [user, setUser] = useContext(UserType);
    const [selectedSection, setSelectedSection] = useState("Videos")
    const [userchannelProfile, setUserChannelProfile] = useState({})
    const [isModalVisible, setModalVisible] = useState(false);

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
            name: "Subscribed",
            component: SubscribedTabcomponent
        },
    ]

    const handleSections = (sectionName) => {
        setSelectedSection(sectionName)
        // console.log("selectedSection : ", selectedSection);
    }

    const handleGetUserProfile = async () => {
        const username = user.username

        const accessToken = await AsyncStorage.getItem("accessToken")
        const response = await axios.get(`${base_url}/users/c/${username}`,
            {
                headers: {
                    Authorization: `${accessToken}`,
                }
            }
        )
        // console.log("response :: ", response.data.data);
        setUserChannelProfile(response.data.data)
    }

    useEffect(() => {
        // Scroll to the top of the ScrollView
        // scrollRef.current?.scrollTo({ y: 0, animated: true });
        handleGetUserProfile()
    }, [])

    // close upoad video modal 
    const closeModal = () => {
        setModalVisible(false)
    }

    return (
        <SafeAreaView style={{ backgroundColor: "#000", flex: 1, position: 'relative' }}>
            <ScrollView ref={scrollRef} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >

                {/* Header */}
                <HeaderComponent />

                <View style={{}}>

                    {/* coverImage */}
                    <View>
                        <Image source={{ uri: userchannelProfile.coverImage }} style={{ width: "100%", height: 85, resizeMode: "cover" }} />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, gap: 5, paddingBottom: 12 }} >
                        <Image source={{ uri: userchannelProfile?.avatar }} style={{ width: 100, height: 100, resizeMode: "cover", borderRadius: 55, borderWidth: 2, borderColor: "white", position: 'absolute', top: -30, left: 10 }} />
                        <View style={{ paddingLeft: 110, paddingVertical: 10 }}>
                            <Text style={{ color: "white", fontSize: 17 }} >{userchannelProfile.fullName}</Text>
                            <Text style={{ color: "#999", fontSize: 13 }} >@{userchannelProfile.username}</Text>
                        </View>

                        {/* Edit btn  */}
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: "#AE7AFF", paddingHorizontal: 15, paddingVertical: 10, }}>
                            <Feather name="edit-2" size={17} color="black" style={{ fontWeight: "bold" }} />
                            <Text style={{ fontSize: 15, fontWeight: "bold" }} >Edit</Text>
                        </TouchableOpacity>
                        <Text style={{ color: "#999", fontSize: 13, position: 'absolute', bottom: -2, right: 70 }} >{userchannelProfile.subscribersCount} subscribers . {userchannelProfile.channelSubscribedToCount} Subscribed</Text>
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
                                )
                            }} />
                        ))}
                    </Tab.Navigator>
                </View>


            </ScrollView>
            <VideoUpload isVisible={isModalVisible} onClose={closeModal} />

        </SafeAreaView>
    )
}

export default ProfileScreen
