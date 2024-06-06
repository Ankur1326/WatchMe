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
    console.log(isDarkMode);

    return (
        <View style={{ borderBottomWidth: 1, borderBottomColor: currentTheme?.primaryBorderColor, paddingBottom: 26, backgroundColor: currentTheme.primaryBackgroundColor}} >
            {/* video  */}
            <ShimmerPlaceholder style={{ width: "100%", height: 210, backgroundColor: isDarkMode ? 'red' : 'yellow', overflow: 'hidden'}} />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10, marginLeft: 5,  }}>
                {/* avatar  */}
                <ShimmerPlaceholder style={{ width: 45, height: 45, borderRadius: 100, }} />

                <View style={{ flexDirection: 'column', gap: 10, justifyContent: 'flex-start', }}>
                    {/* title  */}
                    <ShimmerPlaceholder style={{ width: 60, height: 20, borderRadius: 4 }} />
                    <View style={{ flexDirection: 'row', gap: 6, }}>
                        <ShimmerPlaceholder style={{ width: 100, height: 12, borderRadius: 4 }} />
                        <ShimmerPlaceholder style={{ width: 50, height: 12, borderRadius: 4 }} />
                        <ShimmerPlaceholder style={{ width: 90, height: 12, borderRadius: 4 }} />
                    </View>
                </View>
            </View>
        </View>
    )
}



export default VideoSkeletonLoader