import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { base_url } from "../helper/helper";

// Define accessToken globally
let accessToken = '';

// Function to initialize accessToken
const initializeAccessToken = async () => {
  accessToken = await AsyncStorage.getItem("accessToken");
};

// Call initializeAccessToken to fetch and set accessToken
initializeAccessToken();

const createTweetHandler = async (tweet) => {
  // console.log(tweet);
  try {
    const response = await axios.post(`${base_url}/tweets`,
      { content: tweet },
      {
        headers: {
          Authorization: `${accessToken}`
        }
      }
    )
    // console.log("response.data.data : ", response.data.data);
    if (response.data.data) {
      return {
        data: response.data.data,
      }
    }
  } catch (error) {
    console.log("error while creating tweet", error);
    throw error
  }
}

const getTweetsHandler = async (userId) => {
  // console.log(tweet);
  try {
    const response = await axios.get(`${base_url}/tweets/user/${userId}`,
      {
        headers: {
          Authorization: `${accessToken}`
        }
      }
    )
    // console.log("response.data.data : ", response.data.data);
    if (response.data.data) {
      return {
        data: response.data.data,
      }
    }
  } catch (error) {
    console.log("error while getting user tweets", error);
    throw error
  }
}

// function to like 
const toggleTweetLikeHandler = async (tweetId, action) => {
  // console.log(videoId, action);
  try {
    const response = await axios.post(`${base_url}/likes/toggle/t/${tweetId}`, { action },
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      }
    )
    // console.log(response.data);
  } catch (error) {
    throw error
  } finally {

  }

}

const editTweetHandler = async (tweetId, tweet) => {
  try {
    const response = await axios.patch(`${base_url}/tweets/${tweetId}`,
      { content: tweet }, // new comment
      {
        headers: {
          Authorization: `${accessToken}`
        }
      }
    )
  } catch (error) {
    console.log("error while updating tweet", error);
  }
}

// function to delete tweet 
const deleteTweetHandler = async (tweetId) => {
  try {
    const response = await axios.delete(`${base_url}/tweets/${tweetId}`, {
      headers: {
        Authorization: `${accessToken}`
      }
    })
  } catch (error) {
    console.log("error while deleting tweet", error);
  } finally {

  }

}

export { createTweetHandler, getTweetsHandler, toggleTweetLikeHandler, editTweetHandler, deleteTweetHandler }