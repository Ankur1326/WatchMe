import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ActivityIndicator = () => {
    return (
        <View>
            {showLoader && (
                <ActivityIndicator style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "#00000084", zIndex: 99, }} size={65} color="#FFFFFF" />
            )}
        </View>
    )
}

export default ActivityIndicator

const styles = StyleSheet.create({})