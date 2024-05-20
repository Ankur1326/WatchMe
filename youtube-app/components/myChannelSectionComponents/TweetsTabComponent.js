import { View, Text, TextInput, FlatList, Pressable, Image, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef, useContext } from 'react'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons, Entypo, AntDesign, Feather, Ionicons, EvilIcons } from '@expo/vector-icons';
import { useTheme } from 'expo-theme-switcher';
import { base_url } from '../../helper/helper';
import { createTweetHandler, deleteTweetHandler, editTweetHandler, getTweetsHandler, toggleTweetLikeHandler } from '../../actions/tweet.actions.js';
import { UserType } from '../../UserContext';
import CustomConfirmationDialog from '../../Modal/CustomConfirmationDialog';

const TweetsTabComponent = () => {
  const { currentTheme } = useTheme()
  const [tweet, setTweet] = useState("")
  const [tweets, setTweets] = useState([])
  const [user, setUser] = useContext(UserType);
  const [isModalVisible, setModalVisible] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [tweetId, setTweetId] = useState("")

  const userId = user._id
  // const tweets = [
  //   {
  //     username: "React Pattern",
  //     avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
  //     time: "5 hour ago"
  //   },
  //   {
  //     username: "React Pattern",
  //     avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
  //     time: "5 hour ago"
  //   },
  //   {
  //     username: "React Pattern",
  //     avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
  //     time: "5 hour ago"
  //   },
  //   {
  //     username: "React Pattern",
  //     avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
  //     time: "5 hour ago"
  //   },
  //   {
  //     username: "React Pattern",
  //     avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
  //     time: "5 hour ago"
  //   },
  //   {
  //     username: "React Pattern",
  //     avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
  //     time: "5 hour ago"
  //   },
  //   {
  //     username: "React Pattern",
  //     avatar: "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     tweetText: "Exploring the latest features in JavaScript ES11! The language keeps evolving. 💡 #JavaScript #ES11",
  //     time: "5 hour ago"
  //   },

  // ]

  const handleCreateTweet = async () => {
    try {
      await createTweetHandler(tweet)
      setTweet("")
      await handleGetTweets()
    } catch (error) {
      Alert.alert([
        "Error",
        "tweet not created"
      ])
    }
  }

  const handleToggleTweetLike = async (tweetId, action) => {
    await toggleTweetLikeHandler(tweetId, action)
    await handleGetTweets()
  }

  const handleTweetUpdate = async (tweetId, tweet) => {
    setTimeout(() => {
      setTweet("")
    }, 1000);
    try {
      // await editTweetHandler(tweetId, tweet)

      setTweet("")
    } catch (error) {

    } finally {

    }
  }

  const handleGetTweets = async () => {
    try {
      const data = await getTweetsHandler(userId)
      // console.log("data :;" , data.data);
      setTweets(data.data)
    } catch (error) {

    }
  }

  useEffect(() => {
    handleGetTweets()
  }, [])

  const handleDeleteTweet = async () => {
    try {
      await deleteTweetHandler(tweetId)
      await handleGetTweets()
    } catch (error) {
      console.log("error while deleting tweet");
    } finally {
      setTweetId("")
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
                  <Image source={{ uri: item.userDetails[0].avatar }} style={{ width: 40, height: 40, borderRadius: 25 }} />
                </Pressable>

                <View style={{ flexDirection: "column", gap: 0 }}>
                  <View style={{}}>
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                      <Text style={{ color: "white" }}>{item.content} {" "}•</Text>


                      <Text style={{ color: "gray" }}>
                        {
                          formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          }).toString()
                        }
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
                      <AntDesign name={item.isLiked ? "like1" : "like2"} size={17} color="white" />
                      <Text style={{ color: "white", fontSize: 13 }}>{item.likesCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleToggleTweetLike(item._id, "dislike")} style={{ flexDirection: 'row', gap: 5 }}>
                      {/* <AntDesign name={item?.isDisliked ? "dislike1" : "dislike2"} size={17} color="white" /> */}
                      <AntDesign name={item.isDisliked ? "dislike1" : "dislike2"} size={17} color="white" />
                      <Text style={{ color: "white", fontSize: 13 }}>{item.dislikesCount}</Text>
                    </TouchableOpacity>
                  </View>

                </View>

                {/* three dots */}
                <TouchableOpacity onPress={() => {
                  setTweetId(item._id)
                  setModalVisible(!isModalVisible)
                }} style={[{ borderColor: "white", paddingHorizontal: 7, paddingVertical: 7, borderRadius: 0, borderBottomWidth: 0, position: "absolute", right: 5 }]}>
                  <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <Modal
                animationType='slide'
                transparent={true}
                visible={isModalVisible}
              >
                <View style={{ width: "95%", flex: 1, alignSelf: 'center', justifyContent: 'flex-end', }}>
                  <View style={{ backgroundColor: "#222", flex: 1 / 3, alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 15, width: "95%", alignSelf: 'center', borderRadius: 15, paddingBottom: 10 }}>

                    <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: 'absolute', zIndex: 99, right: 10, top: 10 }} >
                      <Entypo name="cross" size={34} color="white" />
                    </TouchableOpacity>

                    {/* Edit btn */}
                    <TouchableOpacity onPress={() => {
                      console.log("TouchableOpacity pressed");
                      setTweet(item?.content);
                      setModalVisible(false);
                      // handleTweetUpdate(item._id)
                    }} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                      <Feather name="edit" size={24} color="white" />
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                      setModalVisible(false)
                      setShowConfirmation(true)
                    }} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                      <AntDesign name="delete" size={24} color="white" />
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          )}
        />
        {/* Conformation Dialog */}
        <CustomConfirmationDialog
          showConfirmation={showConfirmation}
          title="Delete Video"
          message="Are you sure you want to delete this Video"
          onCancel={() => {
            setShowConfirmation(false)
          }} // Close the confirmation dialog if Cancel is pressed
          onConfirm={() => {
            handleDeleteTweet(), // videoId
              setShowConfirmation(false)
            setModalVisible(false)
          }}
        />
      </ScrollView>

    </View>
  )
}

export default TweetsTabComponent