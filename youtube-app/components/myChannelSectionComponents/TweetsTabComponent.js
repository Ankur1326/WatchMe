import { View, Text, TextInput, FlatList, Pressable, Image, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons, Entypo, AntDesign, Feather, Ionicons, EvilIcons } from '@expo/vector-icons';
import { useTheme } from 'expo-theme-switcher';
import { base_url } from '../../helper/helper';
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

  const handleCreateTweet = async () => {
    try {
      await createTweetHandler(tweet)
      setTweet("")
    } catch (error) {
      Alert.alert([
        "Error",
        "tweet not created"
      ])
    }
  }

  const handleToggleTweetLike = async (tweetId, action) => {
    if (action === "like") {
      likeScale.value = withTiming(1.3, { duration: 100 })
      setTimeout(() => {
        likeScale.value = withTiming(1, { duration: 100 })
      }, 100);
    }
    await toggleTweetLikeHandler(tweetId, action)
  }

  const handleTweetUpdate = async (tweetId, tweet) => {
    try {
      await editTweetHandler(tweetId, tweet)

      setTweet("")
    } catch (error) {
      
    } finally {
      
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.primaryBackgroundColor, paddingVertical: 10, paddingHorizontal: 4 }} >

      {/* tweets  */}
      <ScrollView>
        <View style={{ borderWidth: 1, borderColor: "gray", position: 'relative', height: 100 }} >
          <TextInput value={tweet} onChangeText={setTweet} multiline numberOfLines={5} textAlignVertical='top' placeholder="write a tweet" placeholderTextColor="white" style={{ paddingVertical: 4, paddingHorizontal: 15, fontSize: 14, color: "white", height: 50 }} />
          {/* send btn */}
          <TouchableOpacity onPress={handleCreateTweet} style={{ alignItems: 'center', backgroundColor: "#AE7AFF", paddingHorizontal: 14, paddingVertical: 8, position: 'absolute', bottom: 10, right: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }} >Send</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tweets}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 0, flexDirection: 'column', gap: 10, paddingVertical: 15, borderTopWidth: 1, borderTopColor: "gray" }}>

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

              {/* Bottom modal  */}
              {/* <Modal
              animationType='slide'
              transparent={true}
              visible={isVisible}
            >

              <View style={{ width: "95%", flex: 1, alignSelf: 'center', justifyContent: 'flex-end', }}>
                <View style={{ backgroundColor: "#111", flex: 1 / 4, alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 15, width: "95%", alignSelf: 'center', borderRadius: 15, paddingBottom: 10, position: "relative" }}>

                  Edit Input text
                  {
                    isEditTextVisible &&
                    <View style={{ flexDirection: "row", borderWidth: 0.6, borderColor: "white", borderRadius: 5, position: "absolute", top: -40, width: "100%", backgroundColor: "#222" }} >
                      <TextInput ref={ref} value={comment} onChangeText={(text) => setComment(text)} placeholder='Add a Comment' placeholderTextColor="white" style={[{ color: "white", paddingHorizontal: 15, paddingVertical: 4, }, comment && { paddingRight: 60 }]} />

                      {
                        comment && <Pressable onPress={() => editCommentHandler()} style={{ position: "absolute", right: 0, borderLeftWidth: 1, borderColor: "white", paddingHorizontal: 10, paddingVertical: 5, width: 60 }}>
                          TODO add right arrow 
                          <Ionicons name="send" size={24} color="white" />
                        </Pressable>
                      }
                    </View>
                  }


                  hide modal btn
                  <TouchableOpacity onPress={() => closeModal()} style={{ position: 'absolute', zIndex: 99, right: 10, top: 10 }} >
                    <Entypo name="cross" size={34} color="white" />
                  </TouchableOpacity>


                  Edit btn    
                  <TouchableOpacity onPress={() => editComment()} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                    <Feather name="edit" size={24} color="white" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Edit</Text>
                  </TouchableOpacity>
                  delete btn
                  <TouchableOpacity onPress={() => deleteCommentHandler()} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                    <AntDesign name="delete" size={24} color="white" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal> */}
            </View>
          )}
        />

      </ScrollView>

    </View>
  )
}

export default TweetsTabComponent