import AsyncStorage from "@react-native-async-storage/async-storage";
import { asyncThunkCreator, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../helper/helper.js";

// Define accessToken globally
let accessToken = '';

// Function to initialize accessToken
const initializeAccessToken = async () => {
    accessToken = await AsyncStorage.getItem("accessToken");
};

// Call initializeAccessToken to fetch and set accessToken
initializeAccessToken();

export const fetchPlaylists = createAsyncThunk(
    'playlists/fetchPlaylists',
    async (userId, thunkAPI) => {
        try {
            const response = await axios.get(`${base_url}/playlist/user/${userId}`)
            return response.data.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// create new playlist
export const createPlaylist = createAsyncThunk(
    'playlists/createPlaylist',
    async ({ name, description, privacyStatus }, thunkAPI) => {
        try {
            if (!name || !privacyStatus) {
                throw new Error('title and privacyStatus fields are required');
            }
            const response = await axios.post(`${base_url}/playlist`,
                { name, description, isPublish: privacyStatus === "Public" ? true : false },
                {
                    headers: {
                        Authorization: accessToken
                    }
                }
            )
            // console.log("created Playlist : ", response.data.data);
            return response.data.data
        } catch (error) {
            // console.log("", error);
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

// Delete playlist
export const deletePlaylist = createAsyncThunk(
    'playlists/deletePlaylist',
    async (playlistId, thunkAPI) => {
        try {
            await axios.delete(`${base_url}/playlist/${playlistId}`, {
                headers: {
                    Authorization: accessToken,
                },
            });
            return playlistId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const playlistSlice = createSlice({
    name: "playlists",
    initialState: {
        playlists: [],
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
            // fetch playlists
            .addCase(fetchPlaylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlaylists.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists = action.payload
            })
            .addCase(fetchPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // create playlist
            .addCase(createPlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlaylist.fulfilled, (state, action) => {
                state.loading = false;
                // state.playlists.push(action.payload)
                state.isSuccess = true
                state.message = 'Playlist successfully created';
            })
            .addCase(createPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
                state.isSuccess = false
                state.message = 'Failed to create playlist';
            })
            // delete Playlist
            .addCase(deletePlaylist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deletePlaylist.fulfilled, (state, action) => {
                state.loading = false
                state.playlists = state.playlists.filter(playlist => playlist._id !== action.payload)
                state.message = "playlist successfully deleted"
            })
            .addCase(deletePlaylist.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'somthing went wrong'
            })
    }
})

export const { clearMessage } = playlistSlice.actions;
export default playlistSlice.reducer