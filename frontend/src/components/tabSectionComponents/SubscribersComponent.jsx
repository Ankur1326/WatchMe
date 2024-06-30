import { Image, Pressable, Text, View, FlatList, StyleSheet } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { useTheme } from 'expo-theme-switcher'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannelsSubscribed, fetchSubscribers, toggleSubscription } from '../../store/slices/subscriptionSlice'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { UserType } from '../../context/UserContext'

const SubscribersComponent = ({ route, initialParams }) => {
    const { currentTheme } = useTheme()
    const dispatch = useDispatch()
    const channels = useSelector((state) => state.subscription.subscribers)
    // const userId = route?.params?.userId
    const userId = initialParams.userId

    useEffect(() => {
        dispatch(fetchSubscribers(userId))
    }, [])

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.primaryBackgroundColor }]}>
            <FlatList
                data={channels}
                renderItem={({ item }) =>
                    <View style={styles.channelContainer}>
                        <Pressable style={styles.channelInfo}>
                            <Image source={{ uri: item?.channelDetails[0]?.avatar }} style={styles.avatar} />
                            <View>
                                <Text style={[styles.username, { color: currentTheme.primaryTextColor }]}>{item.channelDetails[0]?.username}</Text>
                                <Text style={[styles.subscribersCount, { color: currentTheme.secondaryTextColor }]}>{item.channelDetails[0]?.subscribersCount} Subscribers</Text>
                            </View>
                        </Pressable>
                        <TouchableOpacity onPress={() => dispatch(toggleSubscription(item._id))} style={styles.unsubscribeButton}>
                            <Ionicons name="person-remove-outline" size={16} color="black" />
                            <Text style={styles.unsubscribeText}>Unsubscribe</Text>
                        </TouchableOpacity>
                    </View>
                }
                keyExtractor={(channel, index) => channel?.username + index.toString()}
                ListEmptyComponent={() => (
                    <View style={styles.emptyListContainer}>
                        <View style={styles.emptyIconContainer}>
                            <FontAwesome5 name="users" size={28} color="#AE7AFF" />
                        </View>
                        <Text style={[styles.emptyListText, { color: currentTheme.primaryTextColor }]}>No subscribers</Text>
                        <Text style={[styles.emptyListSubText, { color: currentTheme.primaryTextColor }]}>
                            This channel has yet to subscribe to a new channel.
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    channelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    channelInfo: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subscribersCount: {
        fontSize: 12,
    },
    unsubscribeButton: {
        flexDirection: 'row',
        gap: 5,
        backgroundColor: "#AE7AFF",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    unsubscribeText: {
        fontSize: 12.5,
        color: "black",
    },
    emptyListContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        gap: 15,
        paddingHorizontal: 20,
    },
    emptyIconContainer: {
        backgroundColor: '#1e1e1e',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 50,
    },
    emptyListText: {
        fontSize: 20,
        fontWeight: '600',
    },
    emptyListSubText: {
        fontSize: 16,
        textAlign: 'center',
    },
}); 

export default SubscribersComponent