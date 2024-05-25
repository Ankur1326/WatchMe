import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"
import { base_url } from '../helper/helper';

// Define accessToken globally
let accessToken = '';

// Function to initialize accessToken
const initializeAccessToken = async () => {
    accessToken = await AsyncStorage.getItem("accessToken");
};

// Call initializeAccessToken to fetch and set accessToken
initializeAccessToken();

const getChannelStatsHandler = async () => {
    try {
        const response = await axios.get(`${base_url}/dashboard/stats`, {
            headers: {
                Authorization: `${accessToken}`
            }
        })
        return response.data.data[0]
    } catch (error) {
        console.log("Error while getting user channel status ", error);
        throw Error
    }
}

const getChannelVideosInfoHandler = async () => {
    try {
        const response = await axios.get(`${base_url}/dashboard/videos`, {
            headers: {
                Authorization: `${accessToken}`
            }
        })
        return response.data.data
    } catch (error) {
        console.log("Error while getting user channel videos Info ", error);
        throw Error
    }
}

// fetch current user that is logged in 
const fetchCurrentUserHandler = async () => {
    try {
        const response = await axios.get(`${base_url}/users/current-user`, {
            headers: {
                Authorization: `${accessToken}`,
            }
        })
        return response.data

    } catch (error) {
        console.log("error :: ", error);
    }
}

// another user channel profile 
const getUserchannelProfile = async (userId, ) => {
    try {
        const response = await axios.get(`${base_url}/users//get-user-channel/${userId}`,{
            headers: {
                Authorization: `${accessToken}`,
            }
        })
        return response.data.data[0]

    } catch (error) {
        console.log("error while getting anoter user channel profile:: ", error);
    }

}

export { getChannelStatsHandler, getChannelVideosInfoHandler, fetchCurrentUserHandler, getUserchannelProfile }