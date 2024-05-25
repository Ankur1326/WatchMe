import {configureStore} from "@reduxjs/toolkit"
import subscriptionSlice from "./slices/subscriptionSlice"
import playlistSlice from "./slices/playlistSlice"
import playlistVideoSlice from "./slices/playlistVideoSlice"

export const store = configureStore({
    reducer: {
        playlists: playlistSlice,
        playlistVideos: playlistVideoSlice, 
        subscription: subscriptionSlice
    }
})