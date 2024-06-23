import { Image, Pressable, StyleSheet, Text, View, FlatList, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useTheme } from 'expo-theme-switcher'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannelsSubscribed, toggleSubscription } from '../../store/slices/subscriptionSlice'
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { UserType } from '../../context/UserContext'

const SubscribedTabcomponent = () => {
  const { currentTheme } = useTheme()
  const [user, setUser] = useContext(UserType);
  const dispatch = useDispatch()
  const channels = useSelector((state) => state.subscription.subscribedChannels)

  useEffect(() => {
    dispatch(fetchChannelsSubscribed(user._id))
  }, [])

  const renderChannel = ({ item }) => (
    <View style={styles.channelContainer}>
      <Pressable style={styles.channelInfo}>
        <Image source={{ uri: item?.channelDetails[0]?.avatar }} style={styles.channelAvatar} />
        <View>
          <Text style={styles.channelName}>{item.channelDetails[0]?.username}</Text>
          <Text style={styles.subscriberCount}>{item.channelDetails[0]?.subscribersCount} Subscribers</Text>
        </View>
      </Pressable>
      <TouchableOpacity onPress={() => handleUnsubscribe(item._id)} style={styles.unsubscribeButton}>
        <Ionicons name="person-remove-outline" size={16} color="black" />
        <Text style={styles.unsubscribeText}>Unsubscribe</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <FontAwesome5 name="users" size={28} color="#AE7AFF" />
      </View>
      <Text style={styles.emptyTitle}>No people subscribers</Text>
      <Text style={styles.emptyDescription}>This channel has yet to subscribe a new channel.</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.primaryBackgroundColor }]}>
    <FlatList
      data={channels}
      renderItem={renderChannel}
      keyExtractor={(item, index) => item?.channelDetails[0]?.username + index.toString()}
      ListEmptyComponent={renderEmptyComponent}
      contentContainerStyle={styles.listContentContainer}
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
  listContentContainer: {
    paddingBottom: 20,
  },
  channelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    // backgroundColor: '#333',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  channelAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  channelName: {
    color: "white",
    fontSize: 18,
    fontWeight: 'bold',
  },
  subscriberCount: {
    color: "#AAAAAA",
    fontSize: 12,
  },
  unsubscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#AE7AFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  unsubscribeText: {
    fontSize: 12.5,
    fontWeight: 'bold',
    color: "black",
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    gap: 15,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    backgroundColor: "#E4D3FF",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  emptyTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: '600',
  },
  emptyDescription: {
    fontSize: 16,
    color: "white",
    textAlign: 'center',
  },
});

export default SubscribedTabcomponent