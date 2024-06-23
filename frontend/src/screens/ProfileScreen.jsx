import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
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
import SubscribersComponent from '../components/tabSectionComponents/SubscribersComponent.jsx';

const Tab = createMaterialTopTabNavigator();
const ProfileScreen = ({ navigation, route }) => {
    const { currentTheme } = useTheme()
    const scrollRef = useRef(null)
    const [user, setUser] = useContext(UserType);
    const [selectedSection, setSelectedSection] = useState("Videos")
    const [userchannelProfile, setUserChannelProfile] = useState({})
    const [isModalVisible, setModalVisible] = useState(false);

    const isOwner = route.params?.isOwner || (user.username === route?.params?.channel?.username) || false
    const userId = route?.params?.channel?._id || user?._id;
    const username = route?.params?.channel?.username || user?.username

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
            name: isOwner ? "Subscribed" : "Subscribers",
            component: isOwner ? SubscribedTabcomponent : SubscribersComponent
        },
    ]

    const handleSections = (sectionName) => {
        setSelectedSection(sectionName)
    }

    const handleGetUserProfile = async () => {
        // const username = user.username

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
        handleGetUserProfile()
    }, [])

    // close upoad video modal 
    const closeModal = () => {
        setModalVisible(false)
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: "#000" }]}>
            <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <HeaderComponent />

                <View style={styles.profileContainer}>
                    {/* Cover Image */}
                    <View style={styles.coverImageContainer}>
                        <Image source={{ uri: userchannelProfile.coverImage }} style={styles.coverImage} />
                    </View>

                    {/* Profile Info */}
                    <View style={styles.profileInfoContainer}>
                        <Image source={{ uri: userchannelProfile.avatar }} style={styles.avatar} />
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.fullName}>{userchannelProfile.fullName}</Text>
                            <Text style={styles.username}>@{userchannelProfile.username}</Text>
                        </View>

                        {/* Edit Button */}
                        {
                            isOwner &&
                            <TouchableOpacity style={styles.editButton}>
                                <Feather name="edit-2" size={17} color="black" style={styles.editIcon} />
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                        }

                        {/* Subscriber Info */}
                        <Text style={styles.subscriberInfo}>{userchannelProfile.subscribersCount} subscribers</Text>
                        {
                            isOwner && <Text style={styles.subscribedInfo}>{userchannelProfile.channelSubscribedToCount} Subscribed</Text>
                        }
                    </View>
                </View>
                {/* Tab Navigator */}
                <View style={styles.tabNavigatorContainer}>
                    <Tab.Navigator
                        tabBarOptions={{
                            labelStyle: styles.tabLabel,
                            style: styles.tabBar,
                            indicatorStyle: styles.tabIndicator,
                        }}
                    >
                        {sections.map((section) => (
                            <Tab.Screen
                                initialParams={{ isOwner, userId }}
                                key={section.id}
                                name={section.name}
                                component={section.component}
                                options={{
                                    tabBarLabel: ({ focused }) => (
                                        <Text style={[styles.tabLabelText, { color: focused ? "#AE7AFF" : currentTheme.primaryTextColor }]}>
                                            {section.name}
                                        </Text>
                                    )
                                }} />
                        ))}
                    </Tab.Navigator>
                </View>
            </ScrollView>

            {/* Video Upload Modal */}
            <VideoUpload isVisible={isModalVisible} onClose={closeModal} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        position: 'relative',
    },
    scrollView: {
        flexGrow: 1,
    },
    profileContainer: {
        paddingTop: 10,
    },
    coverImageContainer: {
        marginBottom: 12,
    },
    coverImage: {
        width: "100%",
        height: 85,
        resizeMode: "cover",
    },
    profileInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 12,
        gap: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        resizeMode: "cover",
        borderRadius: 55,
        borderWidth: 2,
        borderColor: "white",
        position: 'absolute',
        top: -50,
        left: 10,
    },
    profileTextContainer: {
        paddingLeft: 110,
        paddingVertical: 10,
    },
    fullName: {
        color: "white",
        fontSize: 17,
        fontWeight: 'bold',
    },
    username: {
        color: "#999",
        fontSize: 13,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: "#AE7AFF",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    editIcon: {
        fontWeight: "bold",
    },
    editText: {
        fontSize: 15,
        fontWeight: "bold",
    },
    subscriberInfo: {
        color: "#999",
        fontSize: 13,
        position: 'absolute',
        bottom: -2,
        right: 170,
    },
    subscribedInfo: {
        color: "#999",
        fontSize: 13,
        position: 'absolute',
        bottom: -2,
        right: 70,
    },
    tabNavigatorContainer: {
        flex: 1,
        position: 'relative',
    },
    tabLabel: {
        fontWeight: 'bold',
        color: "white",
        fontSize: 12,
    },
    tabBar: {
        backgroundColor: "black",
    },
    tabIndicator: {
        backgroundColor: '#AE7AFF',
        height: 1.5,
    },
    tabLabelText: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
    },
});


export default ProfileScreen
