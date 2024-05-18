import { View, Text, TextInput, FlatList, Pressable, Image, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons, Entypo, AntDesign, Feather, Ionicons, EvilIcons } from '@expo/vector-icons';
import { useTheme } from 'expo-theme-switcher';
import { base_url } from '../../helper/helper.js';
import { createTweetHandler, editTweetHandler, toggleTweetLikeHandler } from '../../actions/tweet.actions.js';

const TweetsTabComponent = () => {
  const { currentTheme } = useTheme()
  const [tweet, setTweet] = useState("")
  // const [tweets, setTweets] = useState([])

  const tweets = [
    {
      username: "React Pattern",
      avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
      time: "5 hour ago"
    },
    {
      username: "React Pattern",
      avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
      time: "5 hour ago"
    },
    {
      username: "React Pattern",
      avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
      time: "5 hour ago"
    },
    {
      username: "React Pattern",
      avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
      time: "5 hour ago"
    },
    {
      username: "React Pattern",
      avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
      time: "5 hour ago"
    },
    {
      username: "React Pattern",
      avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
      time: "5 hour ago"
    },
    {
      username: "React Pattern",
      avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
      time: "5 hour ago"
    },

  ]


  const handleToggleTweetLike = async (tweetId, action) => {
    if (action === "like") {
      likeScale.value = withTiming(1.3, { duration: 100 })
      setTimeout(() => {
        likeScale.value = withTiming(1, { duration: 100 })
      }, 100);
    }
    await toggleTweetLikeHandler(tweetId, action)
  }

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.primaryBackgroundColor, paddingVertical: 10, paddingHorizontal: 4 }} >

      {/* tweets  */}
      <ScrollView>
        <FlatList
          data={tweets}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 0, flexDirection: 'column', gap: 10, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "gray" }}>

              <View style={{ flexDirection: 'row', gap: 15 }}>
                <Pressable style={{ flexDirection: 'row', gap: 15 }}>
                  <Image source={{ uri: item.avatar }} style={{ width: 40, height: 40, borderRadius: 25 }} />
                </Pressable>

                <View style={{ flexDirection: "column", gap: 0 }}>
                  <View style={{}}>
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                      <Text style={{ color: "white" }}>{item.username} {" "}•</Text>


                      <Text style={{ color: "gray" }}>
                        {/* {
                          formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          }).toString()
                        } */}
                        {item.time}
                      </Text>
                    </View>

                  </View>

                  {/* content */}
                  <View style={{ width: "90%", }}>
                    <Text style={{ color: "white", fontSize: 12 }} >{item.tweetText}</Text>
                  </View>

                  {/* like & dislike */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 8 }}>
                    <TouchableOpacity onPress={() => handleToggleTweetLike(item._id, "like")} style={{ flexDirection: 'row', gap: 5 }}>
                      {/* <AntDesign name={item.isLiked ? "like1" : "like2"} size={17} color="white" /> */}
                      <AntDesign name="like2" size={17} color="white" />
                      <Text style={{ color: "white", fontSize: 13 }}>{122}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleToggleTweetLike(item._id, "dislike")} style={{ flexDirection: 'row', gap: 5 }}>
                      {/* <AntDesign name={item?.isDisliked ? "dislike1" : "dislike2"} size={17} color="white" /> */}
                      <AntDesign name="dislike2" size={17} color="white" />
                      <Text style={{ color: "white", fontSize: 13 }}>{21}</Text>
                    </TouchableOpacity>
                  </View>

                </View>

                {/* three dots */}
                <Pressable onPress={{}} style={[{ borderColor: "white", paddingHorizontal: 7, paddingVertical: 7, borderRadius: 0, borderBottomWidth: 0, position: "absolute", right: 5 }]}>
                  <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                </Pressable>
              </View>

            </View>
          )}
        />

      </ScrollView>

    </View>
  )
}

export default TweetsTabComponent