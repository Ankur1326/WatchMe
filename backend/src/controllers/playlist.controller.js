import mongoose, { isValidObjectId, Types } from "mongoose";
import { Playlist, PlaylistVideo } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, isPublish } = req.body
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id
    console.log("**playlist controlleer called**");
    console.log(name, description, isPublish, userId);

    try {
        // Check if the playlist already exists
        const existedPlaylist = await Playlist.findOne({ name: name });
        // console.log(existedPlaylist);
        if (existedPlaylist) {
            return res.status(404).json("Playlist with this name already exists")
        }

        // create new playlist with selected video 
        const newPlaylist = await Playlist.create({
            name,
            description,
            isPublish,
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
    const { page = 1, limit = 10 } = req.query
    console.log("userId", userId);

    // Check if userId is valid
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId!");
    }

    const matchPipeline = []

    //Filter playlists based on user ownership
    if (userId.toString() === req.user?._id.toString()) {
        matchPipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    // Filter playlists based on privacy and ownership
    if (userId.toString() !== req.user?._id.toString()) {
        matchPipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
                isPublish: true
            }
        })
    }

    try {
        const aggregatePipeline = [
            ...matchPipeline,
            {
                $lookup: {
                    from: "playlistvideos",
                    localField: "_id",
                    foreignField: "playlist",
                    as: "playlistVideos",
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $addFields: {
                    mostRecentVideo: {
                        $arrayElemAt: ["$playlistVideos", 0]
                    },
                    isVideoAddedToPlaylist: {
                        $cond: {
                            if: { $eq: [{ $size: "$playlistVideos" }, 0] },
                            then: false,
                            else: true
                        }
                    },
                    videosCount: {
                        $size: "$playlistVideos"
                    }
                },
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "mostRecentVideo.video",
                    foreignField: "_id",
                    as: "mostRecentVideoInfo"
                }
            },
            {
                $addFields: {
                    playlistThumbnail: {
                        $cond: {
                            if: { $isArray: "$mostRecentVideoInfo" },
                            then: { $arrayElemAt: ["$mostRecentVideoInfo.thumbnail", 0] },
                            else: null,
                        }
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    isPublish: 1,
                    mostRecentVideo: 1,
                    playlistThumbnail: 1,
                    isVideoAddedToPlaylist: 1,
                    videosCount: 1,
                }
            }
        ]

        // Use mongoose-paginate-v2 for pagination
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            customLabels: {
                totalDocs: 'totalPlaylists',
                docs: 'playlists'
            }
        };

        const playlists = await Playlist.aggregate(aggregatePipeline);
        // const playlists = await Playlist.aggregatePaginate(aggregatePipeline, options); // Not work 

        return res.status(200).json(new ApiResponse(
            200,
            playlists,
            "Playlists fetched successfully"
        ));

    } catch (error) {
        throw new ApiError(400, "Internal server error while fetching  playlists with userId ", error)
    }

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
})

const getPlaylistVideos = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params
        console.log("playlistId ", playlistId);
        const { page = 1, limit = 10, orderBy, sortBy, sortType } = req.query;
        const { userId } = req.body

        // Check if Invalid playlistId
        if (!isValidObjectId(playlistId)) {
            throw new ApiError(400, "Invalid playlistId");
        }

        // Check if playlist not exist
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(404, "Playlist not found!");
        }

        // const matchPipeline = []

        // if (userId.toString() === req?.user?._id.toString()) {
        //     matchPipeline.push(
        //         {
        //             $match: {

        //             }
        //         }
        //     )
        // }

        const videos = await PlaylistVideo.aggregate([
            {
                $match: {
                    playlist: new mongoose.Types.ObjectId(playlistId)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "videoDetails",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "userDetails",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "subscriptions",
                                            localField: "_id",
                                            foreignField: "channel",
                                            as: "subscribers"
                                        }
                                    },
                                    {
                                        $addFields: {
                                            subscriberCount: {
                                                $size: "$subscribers"
                                            }
                                        }
                                    },
                                    {
                                        $project: {
                                            username: 1,
                                            avatar: 1,
                                            fullName: 1,
                                            subscriberCount: 1
                                        }
                                    },
                                ]
                            }
                        },
                        {
                            $project: {
                                title: 1,
                                description: 1,
                                thumbnail: 1,
                                views: 1,
                                subscriberCount: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                duration: 1,
                                isPublished: 1,
                                owner: 1,
                                videoFile: 1,
                                userDetails: 1
                            }
                        },
                    ]
                },
            },
            {
                $project: {
                    videoDetails: 1,
                    subscriberCount: 1,
                }
            },
        ])

        // console.log(videos);
        // const videos = await PlaylistVideo.find({ playlist: playlistId })

        return res.status(201).json(new ApiResponse(200, videos, "Vidoes successfully fetched for playlist"))

    } catch (error) {
        console.error("Internal server error while fetching playlists:", error);
        throw new ApiError(500, "Internal server error while fetching playlist videos : ", error)
    }
})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    const userId = req.user._id

    try {
        if (playlistId === "" || videoId === "") {
            throw new ApiError(409, "Both fields are required")
        }

        const playlist = await Playlist.findById(playlistId)

        if (!playlist) {
            console.log("This playlist not found");
            throw new ApiError(404, "This playlist not found")
        }

        // check if videos is already exist or not in that playlist 
        const playlistVideo = await PlaylistVideo.findOne({
            playlist: new mongoose.Types.ObjectId(playlistId),
            video: new mongoose.Types.ObjectId(videoId)
        })

        if (playlistVideo) {
            throw new ApiError(409, "This video is already exist in this playlist")
        }

        // if everything is ok, add add selected video in selected playlist
        const newPlaylistVideo = await PlaylistVideo.create({
            playlist: new mongoose.Types.ObjectId(playlistId),
            video: new mongoose.Types.ObjectId(videoId),
            addedBy: userId
        })

        return res.status(201).json(new ApiResponse(200, newPlaylistVideo, "video is successfully added"))

    } catch (error) {
        console.log("error while adding video in playlist : ", error);
        throw new ApiError(400, "error while adding video in playlist : ", error)
    }

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    console.log("playlistId", playlistId);
    console.log("videoId", videoId);

    try {
        if (playlistId === "" || videoId === "") {
            throw new ApiError(409, "Both fields are required")
        }

        // find playlist 
        const playlist = await Playlist.findById(playlistId)
        console.log(playlist);
        if (!playlist) {
            throw new ApiError(404, "This playlist not found")
        }


        // check if videos is exist in that playlist 
        if (!playlist.videos.includes(videoId)) {
            throw new ApiError(409, "This video is not exist in this playlist")
        }

        // if there are only one video present so delete playlsit 
        if (playlist.videos.length == 1) {
            await Playlist.findByIdAndDelete(playlistId)
            return res.status(201).json(new ApiResponse(200, playlist, "Playlist is successfully deleted "))
        } else {
            const updatedVideos = playlist.videos.filter((id) => id != videoId);
            console.log("Updated videos:", updatedVideos);

            playlist.videos = updatedVideos
            await playlist.save()

            return res.status(201).json(new ApiResponse(200, playlist, "video is successfully deleted"))
        }

    } catch (error) {
        console.log("error while removing video from playlist : ", error);
        throw new ApiError(400, "error while removing video from playlist : ", error)
    }
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    try {

        if (playlistId) {
            await Playlist.findByIdAndDelete(playlistId)
        }

        return res.status(201).json(new ApiResponse("Playlist successfully delete"))

    } catch (error) {
        throw new ApiError(500, "internal server error while deleting playlist")
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name } = req.body

    try {
        if (name === "" || playlistId === "") {
            throw new ApiError(400, "name and playlistId both are required")
        }

        const playlist = await Playlist.findById(playlistId)
        if (!playlist) {
            throw new ApiError(404, "This Playlist is not found")
        }

        playlist.name = name
        await playlist.save()

        return res.status(201).json(new ApiResponse(200, playlist, "Playlist successfully updated"))

    } catch (error) {
        throw new ApiError(500, "Internal server error while updating playlist")
    }
})



export { createPlaylist, getPlaylistById, getUserPlaylists, getPlaylistVideos, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist }