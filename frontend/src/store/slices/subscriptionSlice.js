import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../helper/helper";

let accessToken = '';

// Function to initialize accessToken
const initializeAccessToken = async () => {
    accessToken = await AsyncStorage.getItem("accessToken") || '';
};

// Call initializeAccessToken to fetch and set accessToken
initializeAccessToken();

export const fetchSubscribers = createAsyncThunk(
    'subscription/subscribers',
    async (channelId, thunkAPI) => {
        try {
            const response = await axios.get(`${base_url}/subscriptions/c/${channelId}`, {
                headers: {
                    Authorization: `${accessToken}`
                }
            })
            return response.data.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const fetchChannelsSubscribed = createAsyncThunk(
    'subscription/subscribed',
    async (subscriberId, thunkAPI) => {
        try {
            const response = await axios.get(`${base_url}/subscriptions/u/${subscriberId}`, {
                headers: {
                    Authorization: `${accessToken}`
                }
            })
            return response.data.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const toggleSubscription = createAsyncThunk(
    'subscription/toggleSubscription',
    async (channelId, thunkAPI) => {
        try {
            const response = await axios.post(`${base_url}/subscriptions/c/${channelId}`, {
                headers: {
                    Authorization: `${accessToken}`
                }
            })
            return response.data.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

const initialState = {
    subscribers: [],
    subscribedChannels: [],
    loading: false,
    error: null,
};

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch subscribers
            .addCase(fetchSubscribers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscribers.fulfilled, (state, action) => {
                state.loading = false;
                state.subscribers = action.payload
            })
            .addCase(fetchSubscribers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            // Fetch channels subscribed
            .addCase(fetchChannelsSubscribed.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChannelsSubscribed.fulfilled, (state, action) => {
                state.loading = false;
                state.subscribedChannels = action.payload
            })
            .addCase(fetchChannelsSubscribed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            //Toggle subscribe
            .addCase(toggleSubscription.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(toggleSubscription.fulfilled, (state, action) => {
                state.loading = false;
                // state.subscribedChannels.push(action.payload);
            })
            .addCase(toggleSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default subscriptionSlice.reducer;