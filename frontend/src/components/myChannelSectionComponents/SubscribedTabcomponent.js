import { Image, Pressable, StyleSheet, Text, View, FlatList, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useTheme } from 'expo-theme-switcher'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannelsSubscribed, toggleSubscription } from '../../store/slices/subscriptionSlice'
import { Ionicons } from '@expo/vector-icons';
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
        keyExtractor={(channel, index) => channel.username + index.toString()}
        renderItem={({ item }) =>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginBottom: 20 }}>
            <Pressable style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Image source={{ uri: item?.channelDetails[0].avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              <View style={{}}>
                <Text style={{ color: "white", fontSize: 18 }}>{item.channelDetails[0].username}</Text>
                <Text style={{ color: currentTheme.secondaryTextColor, fontSize: 12 }}>{item.channelDetails[0].subscribersCount} Subscribers</Text>
              </View>
            </Pressable>
            {/* subscribedBtn */}
            <TouchableOpacity onPress={() => dispatch(toggleSubscription(item._id))} style={{ flexDirection: 'row', gap: 5, backgroundColor: "#AE7AFF", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 0}}>
              <Ionicons name="person-remove-outline" size={16} color="black" style={{}}/>
              <Text style={{ fontSize: 12.5, fontWeight: "", color: "black" }} >Unsubscribe</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}

export default SubscribedTabcomponent

const styles = StyleSheet.create({})