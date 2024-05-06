import mongoose from "mongoose";
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

// get all public and private playlist
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    console.log("userId", userId);
    // try {

    const playlists = await Playlist.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: 'videos', // Assuming the name of your videos collection is 'videos'
                localField: 'videos',
                foreignField: '_id',
                as: 'firstVideo'
            }
        },
        // Unwind the firstVideo array
        {
            $project: {
                _id: 1,
                name: 1,
                playlistThumbnail: { $arrayElemAt: ['$firstVideo.thumbnail', 0] }, // Add the thumbnail of the first video
                videosLength: { $size: '$videos' }, // Add the length of the 'videos' array
                videos: '$videos'
            }
        }
    ])

    if (!playlists || playlists.length === 0) {
        throw new ApiError(404, "No playlists found for this user");
    }
    // console.log("playlists : ", playlists);

    return res.status(201).json(new ApiResponse(200, playlists, "This user's playlists successfully fetched"))
    // } catch (error) {
    // throw new ApiError(400, "error while fetching  playlists with userId ", error)
    // }

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    console.log();
    try {
        if (playlistId === "" || videoId === "") {
            throw new ApiError(409, "Both fields are required")
        }

        // find playlist 
        const playlist = await Playlist.findById(playlistId)

        if (!playlist) {
            throw new ApiError(404, "This playlist not found")
        }

        // check if videos is already exist or not in that playlist 
        if (playlist.videos.includes(videoId)) {
            throw new ApiError(409, "This video is already exist in this playlist")
        }

        // if everything is ok, add add selected video in selected playlist
        playlist.videos.unshift(videoId)
        await playlist.save()

        return res.status(201).json(new ApiResponse(200, playlist, "video is successfully added"))

    } catch (error) {
        console.log("error while adding video in playlist : ", error);
        throw new ApiError(400, "error while adding video in playlist : ", error)
    }

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

    try {
        if (playlistId === "" || videoId === "") {
            throw new ApiError(409, "Both fields are required")
        }

        // find playlist 
        const playlist = await Playlist.findById(playlistId)

        if (!playlist) {
            throw new ApiError(404, "This playlist not found")
        }

        // check if videos is exist in that playlist 
        if (!playlist.videos.includes(videoId)) {
            throw new ApiError(409, "This video is not exist in this playlist")
        }

        const updatedVideos = playlist.videos.filter((video) => video !== videoId)

        playlist.videos = updatedVideos

        // await playlist.save()

        return res.status(201).json(new ApiResponse(200, playlist, "video is successfully deleted"))

    } catch (error) {
        console.log("error while removing video from playlist : ", error);
        throw new ApiError(400, "error while removing video from playlist : ", error)
    }
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