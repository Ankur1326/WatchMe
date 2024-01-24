import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from "@expo/vector-icons";
import { UserType } from '../UserContext';
import customStyles from "../styles/styles"

const ProfileScreen = () => {
    const [user, setUser] = useContext(UserType);
    const [selectedSection, setSelectedSection] = useState(null)

    const sections = [
        {
            id: 1,
            name: "Videos",
        },
        {
            id: 2,
            name: "Playlist",
        },
        {
            id: 3,
            name: "Tweets",
        },
        {
            id: 4,
            name: "Subscribed",
        },
    ]

    const handleSecions = (sectionName) => {
        setSelectedSection(sectionName)
    }

    return (
        <SafeAreaView>
            <ScrollView style={{ backgroundColor: "#000" }} >
                <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15,
                    paddingVertical: 0, borderBottomWidth: 2, borderBottomColor: "#666"
                }}>
                    <Image style={{ width: 50, height: 50 }} source={require("../assets/logo.jpg")} />
                    <Feather name="search" size={24} color="white" />
                </View>

                {/* coverImage */}
                <View>
                    <Image source={{ uri: user.coverImage }} style={{ width: "100%", height: 140, resizeMode: "cover" }} />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, gap: 5, paddingBottom: 25 }} >
                    <Image source={{ uri: user.avatar }} style={{ width: 110, height: 110, resizeMode: "cover", borderRadius: 55, borderWidth: 2, borderColor: "white", position: 'absolute', top: -30, left: 10 }} />
                    <View style={{ paddingLeft: 110, paddingVertical: 10 }}>
                        <Text style={{ color: "white", fontSize: 17 }} >{user.fullName}</Text>
                        <Text style={{ color: "#999", fontSize: 13 }} >@{user.username}</Text>
                    </View>

                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: "#AE7AFF", paddingHorizontal: 16, paddingVertical: 10, }}>
                        <Feather name="edit-2" size={21} color="black" style={{ fontWeight: "bold" }} />
                        <Text style={{ fontSize: 17, fontWeight: "bold" }} >Edit</Text>
                    </TouchableOpacity>
                    <Text style={{ color: "#999", fontSize: 13, position: 'absolute', bottom: 10, right: 50 }} >600 subscribers . 200 Subscribed</Text>
                </View>



                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: "100%", paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: "#666", }} >
                        {
                            sections.map((item, index) => (
                                <Pressable onPress={() => handleSecions(item.name)} key={index}
                                    style={{
                                        flex: 1,
                                        borderColor: "#888",
                                        paddingVertical: 8,
                                        paddingHorizontal: 25,
                                        backgroundColor: selectedSection === item.name ? "#ffffff" : "transparent",
                                    }}><Text style={{ fontSize: 17, fontWeight: "bold", color: "white" }}>{item.name}</Text></Pressable>
                            ))
                        }
                    </View>
                </ScrollView>
                <View>
                    <Text>Videos not present</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})