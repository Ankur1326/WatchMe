import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const userId = req.user._id

    try {
        const channelStatus = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            { // get for videos
                $lookup: {
                    from: "videos",
                    localField: "_id",
                    foreignField: "owner",
                    as: "videos",
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "videos._id",
                    foreignField: "video",
                    as: "videoLikes"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers",
                }
            },
            {
                $addFields: {
                    totalVideos: {
                        $size: "$videos"
                    },
                    totalSubscribers: {
                        $size: "$subscribers"
                    },
                    totalVideosLikes: {
                        $size: "$videoLikes"
                    } ,
                    totalViews: { $sum: "$videos.views" }
                }
            },
            {
                $project: {
                    username: 1,
                    fullName: 1, 
                    totalVideos: 1,
                    totalSubscribers: 1,
                    totalVideosLikes: 1,
                    totalViews: 1
                }
            }
        ])

        console.log("channelStatus : ", channelStatus);
        return res.status(201).json(new ApiResponse(200, channelStatus, "channel status successfully fetched"))

    } catch (error) {
        console.log("Internal server error while fetching user channel status :", error);
        throw new ApiError(500, "Internal server error while fetching user channel status", error)
    }

})

const getChannelVideosInfo = asyncHandler(async (req, res) => {
    // Get all the videos uploaded by the channel

    const userId = req.user._id
    
    try {
        const videos = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes",
                }
            },
            {
                $lookup: {
                    from: "dislikes",
                    localField: "_id",
                    foreignField: "video",
                    as: "dislikes",
                }
            },
            {
                $addFields: {
                    videoLikes: {
                        $size: "$likes"
                    },
                    videoDislikes: {
                        $size: "$dislikes"
                    },
                }
            },
            {
                $project: {
                    isPublished: 1,
                    thumbnail: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    videoLikes: 1, // sum of video likes
                    videoDislikes: 1, // sum of video dislikes
                    createdAt: 1
                }
            }

        ])

        if (!videos || videos.length === 0) {
            throw new ApiError(404, "Video does not found for this channel")
        }

        console.log("uploaded Vidoes : ", videos);

        return res.status(201).json(new ApiResponse(200, videos, "Uploaded videos successfully fetched for this channel"))
        
    } catch (error) {
        console.log("Internal server error while fetching uploaded videos by the channel :", error);
        throw new ApiError(500, "Internal server error while fetching uploaded videos by the channel", error)
    }
})

export {
    getChannelStats,
    getChannelVideosInfo
}
