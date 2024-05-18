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

// get all publish and unpublish videos
const getAllVideosHandler = async (params) => {

    try {
        const response = await axios.get(`${base_url}/videos/`, {
            params,
            headers: {
                Authorization: `${accessToken}`,
            }
        })
        return response.data.videos
    } catch (error) {
        console.log("error while gettting all videos", error);
        throw error;
    }
}

// get all publish videos 
const getAllPublishVideosHandler = async (currentPage) => {

    try {
        const response = await axios.get(`${base_url}/videos/getAll-publish-video/?page=${currentPage}&limit=10`, // "&query=o&sortBy=title&sortType=asc"
            {
                headers: {
                    Authorization: `${accessToken}`,
                }
            }
        )
        return response.data.videos
    } catch (error) {
        console.log("Error while get all Publish videos", error);
    } finally {
    }
}

// get all publish videos 
const getAllAnoterChannelVideosHandler = async (userId) => {

    try {
        const response = await axios.get(`${base_url}/videos/getAll-anoter-channel-videos/${userId}`, 
            {
                headers: {
                    Authorization: `${accessToken}`,
                }
            }
        )
        return response.data
    } catch (error) {
        console.log("Error while get all Publish videos :: ", error);
    } finally {
    }
}

const deleteVideoHandler = async (videoId) => {

    try {
        await axios.delete(`${base_url}/videos/${videoId}`,
            {
                headers: {
                    Authorization: `${accessToken}`,
                }
            }
        )
    } catch (error) {
        console.log("Error while deleting video: ", error);
        throw error;
    }
}

// get video by id 
const getVideoByVideoIdHandler = async (videoId) => {

    try {
        const response = await axios.get(`${base_url}/videos/${videoId}`,
            {
                headers: {
                    Authorization: `${accessToken}`,
                }
            }
        )
        return response.data.data[0]
    } catch (error) {
        console.log("Error while get video by id : ", error);
        throw error;
    }
}

// publish and unpumbish toggle
const togglePublishStatusHander = async (videoId) => {
    try {
        const accessToken = await AsyncStorage.getItem("accessToken")
        const response = await axios.patch(`${base_url}/videos/toggle/publish/${videoId}`,
            {},
            {
                headers: {
                    Authorization: `${accessToken}`,
                }
            }
        )
        return response.data.data.isPublished

    } catch (error) {
        console.log("Error while toggle publish status : ", error);
    }
}

const updateVideoHandler = async (videoId, formData) => {
    try {
        await axios.patch(`${base_url}/videos/${videoId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: accessToken
                }
            }
        )

    } catch (error) {
        console.log("Error while toggle updating video : ", error);
    }
}

const increaseViewsHandler = async (videoId) => {
    try {
        const response = await axios.post(`${base_url}/videos/views/${videoId}`,
            {
                headers: {
                    Authorization: accessToken
                }
            }
        )
        
        // console.log(response);
        
    } catch (error) {
        console.log("Error while increased video views : ", error);
    }
}




export { getAllVideosHandler, getAllPublishVideosHandler, deleteVideoHandler, getVideoByVideoIdHandler, togglePublishStatusHander, updateVideoHandler, increaseViewsHandler, getAllAnoterChannelVideosHandler }