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

  return (
    <View style={{ paddingVertical: 10, paddingHorizontal: 10, backgroundColor: currentTheme.primaryBackgroundColor, flex: 1 }}>
      <FlatList
        data={channels}
        renderItem={({ item }) =>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Pressable style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Image source={{ uri: item?.channelDetails[0]?.avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              <View style={{}}>
                <Text style={{ color: "white", fontSize: 18 }}>{item.channelDetails[0]?.username}</Text>
                <Text style={{ color: currentTheme.secondaryTextColor, fontSize: 12 }}>{item.channelDetails[0]?.subscribersCount} Subscribers</Text>
              </View>
            </Pressable>
            {/* subscribedBtn */}
            <TouchableOpacity onPress={() => dispatch(toggleSubscription(item._id))} style={{ flexDirection: 'row', gap: 5, backgroundColor: "#AE7AFF", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 0 }}>
              <Ionicons name="person-remove-outline" size={16} color="black" style={{}} />
              <Text style={{ fontSize: 12.5, fontWeight: "", color: "black" }} >Unsubscribe</Text>
            </TouchableOpacity>
          </View>
        }
        keyExtractor={(channel, index) => channel?.username + index.toString()}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 15, paddingHorizontal: 20 }}>
            <View style={{ backgroundColor: currentTheme?.primaryBackgroundColor, paddingVertical: 15, paddingHorizontal: 15, borderRadius: 50 }}>
              <FontAwesome5 name="users" size={28} color="#AE7AFF" />
            </View>
            <Text style={{ fontSize: 20, color: currentTheme?.primaryTextColor, fontWeight: '600' }}>No people subscribers</Text>
            <Text style={{ fontSize: 16, color: currentTheme?.primaryTextColor, textAlign: 'center' }}>
            This channel has yet to subscribe a new channel.
            </Text>
          </View>
        )}
      />
    </View>
  )
}

export default SubscribedTabcomponent

const styles = StyleSheet.create({})