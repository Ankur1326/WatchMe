import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, isPublish, videoId } = req.body
    const userId = req.user._id
    console.log("**playlist controlleer called**"); 
    console.log(name, isPublish, videoId, userId);
    
    try {
        // check playlist is already exist or not 
        const existedPlaylist = await Playlist.findOne({ name })
        if (existedPlaylist) {
            throw new ApiError(409, "Playlist with name already exist")
        }

        // create new playlist with selected video 
        const newPlaylist = await Playlist.create({
            name,
            isPublish,
            videos: [videoId],
            owner: userId
        })

        if (!newPlaylist) {
            throw new ApiError(500, "Something went wrong while creating new playlist")
        }

        console.log("new Playlist : ", newPlaylist);

        return res.status(201)
            .json(new ApiResponse(200, newPlaylist, "New Playlist created successfully"))

    } catch (error) {
        throw new ApiError(400, "error while creating playlist", error)
    }

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
})



export { createPlaylist, getPlaylistById, getUserPlaylists, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist }