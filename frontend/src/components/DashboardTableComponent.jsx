import { View, Text, TouchableOpacity, StyleSheet, Switch, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from 'expo-theme-switcher'
import { Feather, AntDesign } from '@expo/vector-icons';
import CustomDeleteDialog from '../Modal/CustomDeleteDialog';

const DashboardTableComponent = ({ item, selectedItem, handleSwitchStatus, conformDeleteVideo, handleEditVideo }) => {
    const { currentTheme } = useTheme()
    const [showConfirmation, setShowConfirmation] = useState(false)

    return (
        <View style={styles.rowContainer}>
            <View style={styles.switchContainer}>
                <Switch
                    trackColor={{ false: "#E0E0E0", true: "#AE7AFF" }}
                    thumbColor={item?.isPublished ? "#FFFFFF" : "#FFFFFF"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => handleSwitchStatus(item?._id)}
                    value={item?.isPublished}
                    style={styles.switch}
                />
            </View>
            {
                selectedItem === item?._id ? <ActivityIndicator size={"small"} style={styles.activityIndicator} /> :
                    (
                        item?.isPublished ?
                            <View style={styles.publishedContainer}>
                                <Text style={styles.publishedText}>Published</Text>
                            </View>
                            :
                            <View style={styles.unpublishedContainer}>
                                <Text style={styles.unpublishedText}>Unpublished</Text>
                            </View>
                    )
            }

            <View style={styles.thumbnailContainer}>
                <Image source={{ uri: item?.thumbnail }} style={styles.thumbnail} />
                <Text style={[styles.titleText, { color: currentTheme.primaryTextColor }]}>
                    {
                        item.title?.length > 20 ? `${item?.title?.slice(0, 20)}...` : item.title
                    }
                </Text>
            </View>

            <View style={styles.ratingContainer}>
                <View style={styles.ratingBadge}>
                    <Text style={styles.likesText}>{item.videoLikes}</Text>
                    <AntDesign name="like1" size={14} color="#007c2b" />
                </View>
                <View style={styles.ratingBadge}>
                    <Text style={styles.dislikesText}>{item.videoDislikes}</Text>
                    <AntDesign name="dislike1" size={14} color="#a00000" />
                </View>
            </View>
            <Text style={[styles.dateText, { color: currentTheme.primaryTextColor }]}>{item?.createdAt?.substring(0, 10)}</Text>

            <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => setShowConfirmation(!showConfirmation)} style={styles.iconButton}>
                    <AntDesign name="delete" size={20} color="#FF5252" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEditVideo(item._id)} style={styles.iconButton}>
                    <Feather name="edit-2" size={20} color="#6200EE" />
                </TouchableOpacity>
            </View>

            <CustomDeleteDialog
                showConfirmation={showConfirmation}
                title="Delete Video"
                message="Are you sure you want to delete this Video"
                onCancel={() => {
                    setShowConfirmation(false)
                }}
                onConfirm={() => {
                    conformDeleteVideo(item._id)
                    setShowConfirmation(false)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: "gray",
        borderRadius: 10,
        marginVertical: 5,
        padding: 10,
        // backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    switchContainer: {
        width: "10%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    switch: {
        height: 25,
    },
    activityIndicator: {
        width: "15%",
    },
    publishedContainer: {
        width: "15%",
        alignItems: "center",
        paddingHorizontal: 2,
        paddingVertical: 8,
    },
    publishedText: {
        color: "#4CAF50",
        fontSize: 13,
        borderWidth: 1,
        borderColor: "#4CAF50",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        fontWeight: '600',
    },
    unpublishedContainer: {
        width: "15%",
        alignItems: "center",
        paddingHorizontal: 2,
        paddingVertical: 8,
    },
    unpublishedText: {
        fontSize: 13,
        color: "#F44336",
        borderWidth: 1,
        borderColor: "#F44336",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        fontWeight: '600',
    },
    thumbnailContainer: {
        width: "28%",
        flexDirection: 'row',
        paddingHorizontal: 14,
        gap: 10,
        alignItems: 'center',
        // backgroundColor: '#FFF',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 10,
    },
    thumbnail: {
        width: 60,
        height: 35,
        borderRadius: 4,
    },
    titleText: {
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,
        flexWrap: 'wrap'
    },
    ratingContainer: {
        width: "20%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 5,
    },
    likesText: {
        color: "#007c2b",
        fontSize: 14,
        fontWeight: '500',
        marginRight: 5,
    },
    dislikesText: {
        color: "#a00000",
        fontSize: 14,
        fontWeight: '500',
        marginRight: 5,
    },
    dateText: {
        width: "16%",
        textAlign: "center",
        paddingHorizontal: 2,
        paddingVertical: 14,
        fontSize: 14,
    },
    actionContainer: {
        width: "8%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconButton: {
        alignItems: 'center',
        padding: 5,
    },
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

export default DashboardTableComponent