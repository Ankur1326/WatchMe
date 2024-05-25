import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../helper/helper";

// Define accessToken globally
let accessToken = '';

// Function to initialize accessToken
const initializeAccessToken = async () => {
    accessToken = await AsyncStorage.getItem("accessToken");
};

// Call initializeAccessToken to fetch and set accessToken
initializeAccessToken();

// delete video from playlist
export const fetchPlaylistVideos = createAsyncThunk(
    'playlists/addVideoToPlaylist',
    async ({ playlistId }, thunkAPI) => {
        // console.log("playlistId : ", playlistId);
        try {
            const response = await axios.get(`${base_url}/playlist/playlistVideos/${playlistId}`,
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    }
                }
            )

            // console.log("fetched playlist videos : ", response.data.data);
            return response.data.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// delete video from playlist
export const addVideoToPlaylist = createAsyncThunk(
    'playlists/addVideoToPlaylist',
    async ({ videoId, playlistId }, thunkAPI) => {
        // console.log(videoId, playlistId);
        try {
            const response = await axios.get(`${base_url}/playlist/${playlistId}/${videoId}`,
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    }
                }
            )
            // console.log(response.data);
            return { playlistId, videoId }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// delete video from playlist
export const deleteVideoFromPlaylsit = createAsyncThunk(
    'playlists/deleteVideoFromPlaylsit',
    async ({ videoId, playlistId }, thunkAPI) => {
        // console.log(videoId, playlistId);
        try {
            const response = await axios.delete(`${base_url}/playlist/${playlistId}/${videoId}`,
                {
                    headers: {
                        Authorization: `${accessToken}`,
                    }
                }
            )
            console.log(response.data);
            return { playlistId, videoId }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const playlistVideoSlice = createSlice({
    name: "playlistVideos",
    initialState: {
        videos: [],
        loading: false,
        error: null,
        isSuccess: false,
        message: '',
    },
    reducers: {
        clearMessage: (state) => {
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // fetch playlist videos
            .addCase(fetchPlaylistVideos.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchPlaylistVideos.fulfilled, (state, action) => {
                state.loading = false;
                state.videos = action.payload
            })
            .addCase(fetchPlaylistVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //deleteVideoFromPlaylist
            .addCase(deleteVideoFromPlaylsit.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteVideoFromPlaylsit.fulfilled, (state, action) => {
                state.loading = false;
                const { playlistId, videoId } = action.payload;

                const playlist = state.playlists.find(pl => pl.id === playlistId);
                if (playlist) {
                    playlist.videos = playlist.videos.filter((video) => video.id !== videoId);
                }
                // if (playlist.videos.length === 0) {
                //     state.playlists = state.playlists.filter(playlist => playlist._id !== playlistId)
                // }
                state.message = "video succssfully deleted"
                state.isSuccess = true
            })
            .addCase(deleteVideoFromPlaylsit.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'somthing went wrong while deleting video from playlsit'
            })
    }
})

export default playlistVideoSlice.reducer;