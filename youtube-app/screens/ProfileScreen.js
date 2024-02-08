import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from "@expo/vector-icons";
import { UserType } from '../UserContext';
import customStyles from "../styles/styles"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import VideoTabComponent from '../components/dynamicSectionsComponents/VideoTabComponent';
import PlaylistTabComponent from '../components/dynamicSectionsComponents/PlaylistTabComponent';
import TweetsTabComponent from '../components/dynamicSectionsComponents/TweetsTabComponent';
import SubscribedTabcomponent from '../components/dynamicSectionsComponents/SubscribedTabcomponent';
import Live from '../components/dynamicSectionsComponents/Live';

const Tab = createMaterialTopTabNavigator();
const ProfileScreen = ({navigation}) => {
    const [user, setUser] = useContext(UserType);
    const [selectedSection, setSelectedSection] = useState("Videos")

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

    const handleSecions = (sectionName) => {
        setSelectedSection(sectionName)
        console.log("selectedSection : ", selectedSection);
    }

    return (
        <SafeAreaView style={{ backgroundColor: "#000", flex: 1, position: 'relative' }}>
            {/* <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: "#444" }} > */}

            {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 0 }}>
          <Image
            style={{ width: 40, height: 40 }}
            // source={require("../assets/6372187-middle.png")}
            source={require("../assets/logo.jpg")}
          />
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginRight: 5 }} >
            <Feather name="search" size={24} color="white" />
            <Pressable onPress={() => navigation.openDrawer()} >
              <Feather name="menu" size={34} color="white" />
            </Pressable>
          </View>
        </View>

            
            <View style={{}}>

                {/* coverImage */}
                <View>
                    <Image source={{ uri: user.coverImage }} style={{ width: "100%", height: 85, resizeMode: "cover" }} />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, gap: 5, paddingBottom: 12 }} >
                    <Image source={{ uri: user.avatar }} style={{ width: 110, height: 110, resizeMode: "cover", borderRadius: 55, borderWidth: 2, borderColor: "white", position: 'absolute', top: -30, left: 10 }} />
                    <View style={{ paddingLeft: 110, paddingVertical: 10 }}>
                        <Text style={{ color: "white", fontSize: 17 }} >{user.fullName}</Text>
                        <Text style={{ color: "#999", fontSize: 13 }} >@{user.username}</Text>
                    </View>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: "#AE7AFF", paddingHorizontal: 16, paddingVertical: 10, }}>
                        <Feather name="edit-2" size={21} color="black" style={{ fontWeight: "bold" }} />
                        <Text style={{ fontSize: 17, fontWeight: "bold" }} >Edit</Text>
                    </TouchableOpacity>
                    <Text style={{ color: "#999", fontSize: 13, position: 'absolute', bottom: 0, right: 50 }} >600 subscribers . 200 Subscribed</Text>
                </View>

            </View>
            <View style={{ flex: 1, }}>

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
                            height: 2.5,
                        },
                    }}
                >
                    {sections.map((section) => (
                        <Tab.Screen key={section.id} name={section.name} component={section.component} options={{
                        }} />
                    ))}
                </Tab.Navigator>
            </View>


            {/* </ScrollView> */}

        </SafeAreaView>
    )
}

export default ProfileScreen
