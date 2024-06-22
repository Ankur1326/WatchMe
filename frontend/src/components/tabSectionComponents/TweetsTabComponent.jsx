import { View, Text, TextInput, FlatList, Pressable, Image, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons, FontAwesome5, Entypo, AntDesign, Feather, Ionicons, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from 'expo-theme-switcher';
import { createTweetHandler, deleteTweetHandler, editTweetHandler, getTweetsHandler, toggleTweetLikeHandler } from '../../actions/tweet.actions.js';
import CustomConfirmationDialog from '../../Modal/CustomConfirmationDialog.jsx';
import { UserType } from '../../context/UserContext.js';
import BottomSlideModal from '../../Modal/BottomSlideModal.jsx';

const TweetsTabComponent = ({ route }) => {
  const { currentTheme } = useTheme()
  const [tweet, setTweet] = useState("")
  const [tweets, setTweets] = useState([])
  const [user] = useContext(UserType);
  const [isModalVisible, setModalVisible] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [tweetId, setTweetId] = useState("")

  const userId = route?.params?.userId || user._id;
  // console.log(user._id);

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
      // setTweet("")
    }, 1000);
    try {
      // await editTweetHandler(tweetId, tweet)

      // setTweet("")
    } catch (error) {

    } finally {

    }
  }

  const handleGetTweets = async () => {
    try {
      let data;
      if (userId === user._id) {
        data = await getTweetsHandler(user._id)
      }
      else {
        data = await getTweetsHandler(userId)
      }
      // console.log("data :;" , data.data);
      setTweets(data.data)
    } catch (error) {
      console.log("Erorr while getting user tweets", error);
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
  console.log("tweets : ", tweets);
  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.primaryBackgroundColor, paddingVertical: 10, paddingHorizontal: 4 }} >

      {/* tweets  */}
      <ScrollView>
        {
          userId === user._id &&
          <View style={{ borderWidth: 1, borderColor: "gray", position: 'relative', height: 100 }} >
            <TextInput value={tweet} onChangeText={setTweet} multiline numberOfLines={5} textAlignVertical='top' placeholder="write a tweet" placeholderTextColor="white" style={{ paddingVertical: 4, paddingHorizontal: 15, fontSize: 14, color: "white", height: 50 }} />
            {/* send btn */}
            <TouchableOpacity onPress={handleCreateTweet} style={{ alignItems: 'center', backgroundColor: "#AE7AFF", paddingHorizontal: 14, paddingVertical: 8, position: 'absolute', bottom: 10, right: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }} >Send</Text>
            </TouchableOpacity>
          </View>
        }

        <FlatList
          data={tweets}
          keyExtractor={(item) => item._id}
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

              <BottomSlideModal isVisible={isModalVisible} setVisible={setModalVisible}>
                {
                  userId === user._id ?
                    (
                      <View style={{ width: "100%" }}>
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
                    )
                    :
                    (
                      <View style={{ width: "100%" }}>
                        <TouchableOpacity onPress={() => {
                          console.log("TouchableOpacity pressed");
                          setTweet(item?.content);
                          setModalVisible(false);
                          // handleTweetUpdate(item._id)
                        }} style={{ backgroundColor: "", width: "100%", borderBottomWidth: 0.5, borderColor: "gray", paddingVertical: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20, alignItems: 'center' }}>
                          {/* <Feather name="edit" size={24} color="white" /> */}
                          <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white" }} >Add buttons over here... </Text>
                        </TouchableOpacity>
                      </View>
                    )
                }

                {/* Edit btn */}

              </BottomSlideModal>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 15, paddingHorizontal: 20 }}>
              <View style={{ backgroundColor: currentTheme?.primaryBackgroundColor, paddingVertical: 15, paddingHorizontal: 15, borderRadius: 50 }}>
                <FontAwesome5 name="users" size={28} color="#AE7AFF" />
              </View>
              <Text style={{ fontSize: 20, color: currentTheme?.primaryTextColor, fontWeight: '600' }}>No Tweets</Text>
              <Text style={{ fontSize: 16, color: currentTheme?.primaryTextColor, textAlign: 'center' }}>
                This channel has yet to make a Tweet.
              </Text>
            </View>
          }
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