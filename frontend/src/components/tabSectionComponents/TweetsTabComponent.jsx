import { View, Text, TextInput, FlatList, Pressable, Image, Alert, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons, FontAwesome5, Entypo, AntDesign, Feather, Ionicons, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from 'expo-theme-switcher';
import CustomDeleteDialog from '../../Modal/CustomDeleteDialog.jsx';
import BottomSlideModal from '../../Modal/BottomSlideModal.jsx';
import axiosInstance from '../../helper/axiosInstance.js';

const TweetsTabComponent = ({ route, initialParams }) => {
  const { currentTheme } = useTheme()
  const [tweet, setTweet] = useState("")
  const [tweets, setTweets] = useState([])
  // const [user] = useContext(UserType);
  const [isModalVisible, setModalVisible] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [tweetId, setTweetId] = useState("")

  // const { isOwner, userId } = route?.params
  const { isOwner, userId } = initialParams

  const handleCreateTweet = async () => {
    try {
      await axiosInstance.post(`tweets`, { content: tweet })
      // await createTweetHandler(tweet)

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
    await axiosInstance.post(`likes/toggle/t/${tweetId}`, { action })
    await handleGetTweets()
  }

  const handleTweetUpdate = async (tweetId, tweet) => {
    try {
      await axiosInstance.patch(`tweets/${tweetId}`, { content: tweet })
      // await editTweetHandler(tweetId, tweet);
      setTweet("");
    } catch (error) {
      console.log("Error while editing tweet", error);
    }
  }

  const handleGetTweets = async () => {
    try {
      const response = await axiosInstance.get(`tweets/user/${userId}`)
      setTweets(await response.data.data)
    } catch (error) {
      console.log("Erorr while getting user tweets", error);
    }
  }

  useEffect(() => {
    handleGetTweets()
  }, [])

  const handleDeleteTweet = async () => {
    try {
      await axiosInstance.delete(`tweets/${tweetId}`)
      await handleGetTweets()
    } catch (error) {
      console.log("error while deleting tweet");
    } finally {
      setTweetId("")
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.primaryBackgroundColor }]}>
      <ScrollView>
        {isOwner && (
          <View style={styles.tweetInputContainer}>
            <TextInput
              value={tweet}
              onChangeText={setTweet}
              multiline
              numberOfLines={5}
              textAlignVertical='top'
              placeholder="write a tweet"
              placeholderTextColor="white"
              style={styles.tweetInput}
            />
            <TouchableOpacity onPress={handleCreateTweet} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={tweets}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.tweetItemContainer}>
              <View style={styles.tweetHeader}>
                <Pressable style={styles.userAvatarContainer}>
                  <Image source={{ uri: item.userDetails[0].avatar }} style={styles.tweetUserAvatar} />
                </Pressable>
                <View style={styles.tweetContentContainer}>
                  <View style={styles.tweetHeaderInfo}>
                    <Text>{item.tweetContent} •</Text>
                    <Text style={styles.tweetTime}>
                      {formatDistanceToNow(new Date(item?.createdAt), { addSuffix: true }).toString()}
                    </Text>
                  </View>
                  <Text style={styles.tweetContent}>{item?.content}</Text>
                  <View style={styles.likeDislikeContainer}>
                    <TouchableOpacity onPress={() => handleToggleTweetLike(item._id, "like")} style={styles.actionButton}>
                      <AntDesign name={item.isLiked ? "like1" : "like2"} size={17} color="white" />
                      <Text style={styles.actionText}>{item.likesCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleToggleTweetLike(item._id, "dislike")} style={styles.actionButton}>
                      <AntDesign name={item.isDisliked ? "dislike1" : "dislike2"} size={17} color="white" />
                      <Text style={styles.actionText}>{item.dislikesCount}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => {
                  setTweetId(item._id);
                  setTweet(item?.content);
                  setModalVisible(!isModalVisible);
                }} style={styles.dotsButton}>
                  <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyListComponent}>
              <FontAwesome5 name="users" size={28} color="#AE7AFF" />
              <Text style={styles.emptyListText}>No Tweets</Text>
              <Text style={styles.emptyListDescription}>
                This channel has yet to make a Tweet.
              </Text>
            </View>
          }
        />

        <CustomDeleteDialog
          showConfirmation={showConfirmation}
          title="Delete Video"
          message="Are you sure you want to delete this Video"
          onCancel={() => {
            setShowConfirmation(false);
          }}
          onConfirm={() => {
            handleDeleteTweet();
            setShowConfirmation(false);
            setModalVisible(false);
          }}
        />
      </ScrollView>

      <BottomSlideModal isVisible={isModalVisible} setVisible={setModalVisible}>
        {isOwner ? (
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => {
              console.log("TouchableOpacity pressed");
              // setTweet(item?.content);
              setModalVisible(false);
            }} style={styles.modalButton}>
              <Feather name="edit" size={24} color="white" />
              <Text style={styles.modalButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setModalVisible(false);
              setShowConfirmation(true);
            }} style={styles.modalButton}>
              <AntDesign name="delete" size={24} color="white" />
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => {
              console.log("TouchableOpacity pressed");
              setTweet(item?.content);
              setModalVisible(false);
            }} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Add buttons over here... </Text>
            </TouchableOpacity>
          </View>
        )}
      </BottomSlideModal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 10,
    // paddingHorizontal: 4,
  },
  tweetInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  tweetInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  sendButton: {
    backgroundColor: '#AE7AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tweetItemContainer: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  tweetHeader: {
    flexDirection: 'row',
    // alignItems: 'center',
    // gap: 10
  },
  userAvatarContainer: {
    marginRight: 10,
  },
  tweetUserAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  tweetHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  tweetContentContainer: {
    flex: 1
  },
  tweetTime: {
    color: '#aaa',
  },
  tweetContent: {
    color: 'white',
    marginBottom: 10,
    marginLeft: 8,
    fontSize: 15
  },
  likeDislikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 8,
  },
  dotsButton: {
    borderColor: "white",
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 0,
    borderBottomWidth: 0,
    position: "absolute",
    right: 5,
  },
  emptyListComponent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyListText: {
    fontSize: 20,
    color: '#AE7AFF',
    fontWeight: '600',
    marginVertical: 10,
  },
  emptyListDescription: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    marginLeft: 5,
  },
  modalContent: {
    paddingHorizontal: 10,
    width: "100%"
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
    paddingVertical: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default TweetsTabComponent