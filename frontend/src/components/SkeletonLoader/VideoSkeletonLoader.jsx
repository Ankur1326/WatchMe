import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'expo-theme-switcher';
import React, { useEffect } from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
// import LinearGradient from 'expo-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
const VideoSkeletonLoader = ({ style }) => {
    const { currentTheme } = useTheme()
    const isDarkMode = currentTheme.isDarkMode

    return (
        <View style={[styles.container, { borderBottomColor: currentTheme?.primaryBorderColor, backgroundColor: currentTheme?.primaryBackgroundColor }]}>
            {/* Video thumbnail */}
            <ShimmerPlaceholder shimmerColors={[isDarkMode ? "#333" : "#888",isDarkMode ? "#444" : "#999"]} style={[styles.thumbnail, { backgroundColor: isDarkMode ? '#444' : '#ccc' }]} />

            <View style={styles.infoContainer}>
                {/* Avatar */}
                <ShimmerPlaceholder shimmerColors={[isDarkMode ? "#333" : "#888",isDarkMode ? "#444" : "#999"]}  style={styles.avatar} />

                <View style={styles.textContainer}>
                    {/* Title */}
                    <ShimmerPlaceholder shimmerColors={[isDarkMode ? "#333" : "#888",isDarkMode ? "#444" : "#999"]}  style={styles.title} />
                    {/* Metadata */}
                    <View style={styles.metadataContainer}>
                        <ShimmerPlaceholder shimmerColors={[isDarkMode ? "#333" : "#888",isDarkMode ? "#444" : "#999"]}  style={styles.metadata} />
                        <ShimmerPlaceholder shimmerColors={[isDarkMode ? "#333" : "#888",isDarkMode ? "#444" : "#999"]}  style={styles.metadata} />
                        <ShimmerPlaceholder shimmerColors={[isDarkMode ? "#333" : "#888",isDarkMode ? "#444" : "#999"]}  style={styles.metadata} />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingBottom: 26,
    },
    thumbnail: {
        width: '100%',
        height: 210,
        overflow: 'hidden',
        borderRadius: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 5,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 100,
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginLeft: 10,
    },
    title: {
        width: 160,
        height: 20,
        borderRadius: 4,
        marginBottom: 10,
    },
    metadataContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    metadata: {
        width: 80,
        height: 12,
        borderRadius: 4,
    },
});

export default VideoSkeletonLoader