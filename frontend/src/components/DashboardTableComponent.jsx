import { View, Text, TouchableOpacity, StyleSheet, Switch, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from 'expo-theme-switcher'
import { Feather, AntDesign } from '@expo/vector-icons';
import CustomDeleteDialog from '../Modal/CustomDeleteDialog';

const DashboardTableComponent = ({ item, selectedItem, handleSwitchStatus, conformDeleteVideo, handleEditVideo }) => {
    const { currentTheme } = useTheme()
    const [showConfirmation, setShowConfirmation] = useState(false)

    return (
        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: "gray", borderTopWidth: 0 }}>
            <View style={[{ width: "10%", alignItems: 'center', justifyContent: 'center', }]}>
                <Switch
                    trackColor={{ false: "#FFFFFF", true: "#AE7AFF" }}
                    thumbColor={item.isPublished ? "#FFFFFF" : "#FFFFFF"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => handleSwitchStatus(item._id)}
                    value={item.isPublished}
                    style={{ height: 25 }}
                />
            </View>
            {
                selectedItem === item._id ? <ActivityIndicator size={"small"} style={{ width: "15%" }} /> :
                    (
                        item?.isPublished ?
                            <View style={{ width: "15%", alignItems: "center", paddingHorizontal: 2, paddingVertical: 8, }} >
                                <Text style={{ color: "#4fff5a", fontSize: 13, borderWidth: 1, borderColor: "#4fff5a", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 8 }} >published</Text>
                            </View>
                            :
                            <View style={{ width: "15%", alignItems: "center", paddingHorizontal: 2, paddingVertical: 8, }} >
                                <Text style={{ fontSize: 13, color: "#ff4f4f", borderWidth: 1, borderColor: "#ff4f4f", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 8 }} >Unpublished</Text>
                            </View>
                    )
            }

            <View style={{ width: "28%", flexDirection: 'row', paddingHorizontal: 14, gap: 5, alignItems: 'center' }} >
                <Image source={{ uri: item.thumbnail }} style={{ width: 60, height: 35, alignItems: 'center' }} />
                <Text style={[{ color: currentTheme.primaryTextColor, fontSize: 15, fontWeight: 'medium' }]} >
                    {
                        item.title.length > 20 ? `${item?.title.slice(0, 20)}...` : item.title
                    }
                </Text>
            </View>

            {/* likes and dislikes             */}
            <View style={{ width: "20%", flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center', }} >
                <Text style={[styles.tableText, { color: "#007c2b", fontSize: 14, fontWeight: '500', backgroundColor: "#BBF7D0", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 15 }]} >{item.videoLikes} likes</Text>

                <Text style={[styles.tableText, { color: "#a00000", fontSize: 14, fontWeight: '500', backgroundColor: "#FECACA", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 15 }]} >{item.videoDislikes} dislikes</Text>
            </View>
            <Text style={[{ color: currentTheme.primaryTextColor, width: "16%" }, styles.dataText]} >{item.createdAt.substring(0, 10)}</Text>

            <View style={{ width: "20%", paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                {/* delete */}
                <TouchableOpacity onPress={() => setShowConfirmation(!showConfirmation)} style={{ alignItems: 'center' }}>
                    <AntDesign name="delete" size={20} color={currentTheme.primaryTextColor} />
                </TouchableOpacity>
                {/* Edit */}
                <TouchableOpacity onPress={() => handleEditVideo(item._id)} style={{ alignItems: 'center' }}>
                    <Feather name="edit-2" size={20} color={currentTheme.primaryTextColor} />
                </TouchableOpacity>
            </View>


            {/* Conformation Dialog */}
            <CustomDeleteDialog
                showConfirmation={showConfirmation}
                title="Delete Video"
                message="Are you sure you want to delete this Video"
                onCancel={() => {
                    setShowConfirmation(false)
                }} // Close the confirmation dialog if Cancel is pressed
                onConfirm={() => {
                    conformDeleteVideo(item._id), // videoId
                        setShowConfirmation(false)
                }}
            />
        </View>
    )
}

export default DashboardTableComponent

const styles = StyleSheet.create({
    tableText: {
        textAlign: "center",
        paddingHorizontal: 2,
        paddingVertical: 14,
        fontWeight: 'bold',
        fontSize: 17,
    },
    dataText: {
        textAlign: "center",
        paddingHorizontal: 2,
        paddingVertical: 14,
        fontSize: 14,
    }
})