import { View, Text, TouchableOpacity, StyleSheet, Switch, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderComponent from '../components/HeaderComponent'
import { useTheme } from 'expo-theme-switcher'
import { Feather, AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import DashboardTableComponent from '../components/DashboardTableComponent'
import PopupMessage from '../components/PopupMessage'
import { deleteVideoHandler, togglePublishStatusHander } from '../actions/video.actions'
import { getChannelStatsHandler, getChannelVideosInfoHandler } from '../actions/channel.actions';
import CustomConfirmationDialog from '../Modal/CustomDeleteDialog';
import EditVideo from '../Modal/EditVideo';
import axiosInstance from '../helper/axiosInstance';

const AdminDashboardScreen = () => {
    const { currentTheme } = useTheme()
    const [selectedItem, setSelectedItem] = useState("");
    const [isSuccess, setSuccess] = useState(false);
    const [isPopupMessageShow, setPopupMessageShow] = useState(false);
    const [channelStats, setChannelStatus] = useState({})
    const [channelVideoInfo, setChannelVideoInfo] = useState([])
    const [editVideoModalVisible, setEditVideoModalVisible] = useState(false)
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const fetchChannelData = async () => {
        try {
            const response = await axiosInstance.get(`dashboard/stats`)
            setChannelStatus(response.data.data[0]);

            const videoInfoResponse = await axiosInstance.get(`dashboard/videos`)
            setChannelVideoInfo(videoInfoResponse.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchChannelData();
    }, [])

    const handleSwitchStatus = async (videoId) => {
        // console.log(videoId);
        setSelectedItem(videoId)
        try {
            await axiosInstance.patch(`videos/toggle/publish/${videoId}`, {})

            const response = await axiosInstance.get(`dashboard/videos`)
            setChannelVideoInfo(response.data.data);
            setSuccess(true)
        } catch (error) {
            setSuccess(false)
            console.log("Error while getting user channel videos Info ", error);
        } finally {
            setSelectedItem("")
            setPopupMessageShow(true)
            setTimeout(() => setPopupMessageShow(false), 3000);
        }
    }

    const conformDeleteVideo = async (videoId) => {
        try {
            await axiosInstance.delete(`videos/${videoId}`)
            fetchChannelData()
            setSuccess(true)

        } catch (error) {
            setSuccess(false)
        } finally {
            setPopupMessageShow(true)
            setTimeout(() => setPopupMessageShow(false), 3000);
        }
    }

    const handleEditVideo = async (videoId) => {
        setSelectedVideoId(videoId);
        setEditVideoModalVisible(true)
    }

    // onClose for editVideo
    const onClose = () => {
        setSelectedVideoId(null);
        setEditVideoModalVisible(false)
    }

    const InfoBox = ({ icon, label, value }) => (
        <View style={styles.infoBox}>
            {icon}
            <Text style={[styles.infoText, { color: "black" }]}>{label}</Text>
            <Text style={[styles.infoNumber, { color: "black" }]}>{value}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.primaryBackgroundColor }]}>
            <HeaderComponent />
            {/* success or faliure popup message  */}
            <PopupMessage isSuccess={isSuccess} title={isSuccess ? "Status successfully changed" : "Status has not changed"} isVisible={isPopupMessageShow} setVisible={setPopupMessageShow} />


            <ScrollView >
                <View style={styles.header}>
                    <Text style={[styles.welcomeText, { color: currentTheme.primaryTextColor }]}>
                        Welcome Back, {channelStats?.fullName}
                    </Text>
                    <Text style={[styles.welcomeSubText, { color: currentTheme.secondaryTextColor }]}>
                        Welcome Back, React Patterns
                    </Text>
                    {/* Upload Button */}
                    <TouchableOpacity onPress={() => showModal()} style={styles.uploadButton}>
                        <Feather name="plus" size={24} color="black" />
                        <Text style={styles.uploadButtonText}>Upload Video</Text>
                    </TouchableOpacity>
                </View>
                {/* total info  */}
                <View style={styles.infoContainer}>
                    <InfoBox
                        icon={<AntDesign name="eyeo" size={24} color="#AE7AFF" />}
                        label="Total views"
                        value={channelStats?.totalViews}
                    />
                    <InfoBox
                        icon={<FontAwesome6 name="user" size={22} color="#AE7AFF" />}
                        label="Total subscribers"
                        value={channelStats?.totalSubscribers}
                    />
                    <InfoBox
                        icon={<AntDesign name="hearto" size={22} color="#AE7AFF" />}
                        label="Total likes"
                        value={channelStats?.totalVideosLikes}
                    />
                </View>

                {/* table for videos */}
                <ScrollView horizontal style={styles.tableContainer}>
                    <View style={styles.tableWrapper}>
                        {/* table header  */}
                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerText, { color: currentTheme.primaryTextColor, width: "10%" }]} >Status</Text>
                            <Text style={[styles.headerText, { color: currentTheme.primaryTextColor, width: "15%" }]} >Status</Text>
                            <Text style={[styles.headerText, { color: currentTheme.primaryTextColor, width: "28%" }]} >Uploaded</Text>
                            <Text style={[styles.headerText, { color: currentTheme.primaryTextColor, width: "20%" }]} >Rating</Text>
                            <Text style={[styles.headerText, { color: currentTheme.primaryTextColor, width: "16%" }]} >Date uploaded</Text>
                            <Text style={[styles.headerText, { color: currentTheme.primaryTextColor, width: "20%" }]} ></Text>
                        </View>

                        {/* table data   */}
                        <FlatList
                            data={channelVideoInfo}
                            keyExtractor={item => item?._id}
                            renderItem={({ item }) => (
                                <View>
                                    <DashboardTableComponent item={item} selectedItem={selectedItem} handleSwitchStatus={handleSwitchStatus} conformDeleteVideo={conformDeleteVideo} handleEditVideo={handleEditVideo} />
                                </View>
                            )}
                        />
                        {/* model for edit video  */}
                        <EditVideo isVisible={editVideoModalVisible} videoId={selectedVideoId} onClose={onClose} getAllVideos={fetchChannelData} />

                    </View>
                </ScrollView>

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcomeContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 3,
        paddingHorizontal: 10,
    },
    welcomeText: {
        fontSize: 18,
    },
    welcomeSubText: {
        fontSize: 14,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    scrollView: {
        paddingHorizontal: 20,
    },
    uploadButton: {
        backgroundColor: "#AE7AFF",
        paddingVertical: 10,
        flexDirection: 'row',
        gap: 4,
        paddingLeft: 10,
        paddingRight: 13,
        marginTop: 10,
    },
    uploadButtonText: {
        fontSize: 16,
    },
    infoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        // marginBottom: 20,
        paddingHorizontal: 10,
        marginTop: 20
    },
    infoBox: {
        width: "48%",
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        paddingHorizontal: 4,
        paddingVertical: 4,
        backgroundColor: '#E4D3FF',
        marginBottom: 15,
        borderRadius: 50,
    },
    infoText: {
        fontSize: 14,
        marginTop: 5,
    },
    infoNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    tableContainer: {
        marginTop: 10,
        // backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 10,
    },
    tableWrapper: {
        flexDirection: 'column',
        width: 900,
    },
    tableHeader: {
        borderWidth: 0.5,
        borderColor: "gray",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: '#EAEAEA',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 5,
        elevation: 2,
    },
    headerText: {
        fontSize: 16,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
    },
})

export default AdminDashboardScreen
