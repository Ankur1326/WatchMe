import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'expo-theme-switcher';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import HeaderComponent from '../components/HeaderComponent';
import { showMessage } from 'react-native-flash-message';
import VideoUpload from '../Modal/VideoUpload';
import EditVideo from '../Modal/EditVideo';

const UploadScreen = ({ navigation }) => {
    const { currentTheme } = useTheme();
    const [isModalVisible, setModalVisible] = useState(false);
    const uploadOptions = [
        {
            icon: <Feather name="video" size={40} color="#fff" />,
            label: "Upload Video",
            buttonStyle: styles.videoButton,
            onPress: () => handleUploadVideo()
        },
        {
            icon: <MaterialIcons name="playlist-add" size={40} color="#fff" />,
            label: "Create Playlist",
            buttonStyle: styles.playlistButton,
            onPress: () => handleCreatePlaylist()
        },
        {
            icon: <MaterialCommunityIcons name="video-vintage" size={40} color="#fff" />,
            label: "Upload Short",
            buttonStyle: styles.shortButton,
            onPress: () => handleUploadShort()
        },
        {
            icon: <Ionicons name="musical-notes" size={40} color="#fff" />,
            label: "Upload Audio",
            buttonStyle: styles.audioButton,
            onPress: () => handleUploadAudio()
        },
    ];

    const handleUploadVideo = () => {
        // Navigate to the video upload screen
        console.log("sa;lfsd");
    };

    const handleCreatePlaylist = () => {
        // Navigate to the create playlist screen
    };

    const handleUploadShort = () => {
        showMessage({
            message: "Not Implemented",
            description: "comming soon...",
            type: "warning"
        })
    };

    const handleUploadAudio = () => {
        showMessage({
            message: "Not Implemented",
            description: "comming soon...",
            type: "warning"
        })
    };

    return (
        <View>
            <HeaderComponent />
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentTheme?.primaryBackgroundColor }]}>
                <Text style={[styles.title, { color: currentTheme?.primaryTextColor }]}>Upload New Content</Text>
                <View style={styles.statSection}>
                    <Text style={styles.statTitle}>Statistics</Text>
                    <View style={styles.statRow}>
                        <View style={styles.statBox}>
                            <MaterialIcons name="videocam" size={40} color="#4CAF50" />
                            <Text style={styles.statNumber}>31</Text>
                            <Text style={styles.statLabel}>Videos</Text>
                        </View>
                        <View style={styles.statBox}>
                            <MaterialCommunityIcons name="video-vintage" size={40} color="#FF5722" />
                            <Text style={styles.statNumber}>0</Text>
                            <Text style={styles.statLabel}>Shorts</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Ionicons name="musical-notes" size={40} color="#2196F3" />
                            <Text style={styles.statNumber}>0</Text>
                            <Text style={styles.statLabel}>Audios</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Feather name="list" size={40} color="#9C27B0" />
                            <Text style={styles.statNumber}>10</Text>
                            <Text style={styles.statLabel}>Playlists</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.cardContainer}>
                    {
                        uploadOptions.map((option, index) => (
                            <TouchableOpacity key={index} style={[styles.card, option.buttonStyle]} onPress={option.onPress}>
                                {option.icon}
                                <Text style={[styles.cardText, { color: currentTheme?.primaryTextColor }]}>{option.label}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoCard}>
                        <AntDesign name="infocirlceo" size={30} color="#AE7AFF" />
                        <Text style={[styles.infoTitle, { color: currentTheme?.primaryTextColor }]}>Community Guidelines</Text>
                        <Text style={[styles.infoText, { color: currentTheme?.secondaryTextColor }]}>
                            Ensure your content follows our community guidelines to avoid any issues.
                        </Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Feather name="help-circle" size={30} color="#AE7AFF" />
                        <Text style={[styles.infoTitle, { color: currentTheme?.primaryTextColor }]}>Help Center</Text>
                        <Text style={[styles.infoText, { color: currentTheme?.secondaryTextColor }]}>
                            Need help? Visit our help center for more information and support.
                        </Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Feather name="info" size={30} color="#AE7AFF" />
                        <Text style={[styles.infoTitle, { color: currentTheme?.primaryTextColor }]}>User Tips</Text>
                        <Text style={[styles.infoText, { color: currentTheme?.secondaryTextColor }]}>
                            Create engaging content by focusing on quality, consistency, and interaction with your audience.
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <VideoUpload isVisible={isModalVisible} setVisible={setModalVisible} getAllVideos={handleGetAllVideos} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%',
    },
    card: {
        width: '45%',
        height: 150,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    cardText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoText: {
        marginTop: 20,
        fontSize: 14,
        textAlign: 'center',
    },
    videoButton: {
        backgroundColor: '#AE7AFF',
    },
    playlistButton: {
        backgroundColor: '#FFAE7A',
    },
    shortButton: {
        backgroundColor: '#7AAEFF',
    },
    audioButton: {
        backgroundColor: '#7AFFAE',
    },


    infoContainer: {
        width: '100%',
        marginTop: 20,
    },
    infoCard: {
        backgroundColor: '#1e1e1e',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        textAlign: 'center',
    },

    statSection: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#333',
        borderRadius: 10,
        elevation: 3,
        width: '100%'
    },
    statTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#fff',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statBox: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#999',
    },
    statLabel: {
        fontSize: 16,
        color: '#fff',
    },
});

export default UploadScreen