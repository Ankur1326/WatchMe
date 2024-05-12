import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const userId = req.user._id

    if (!videoId) {
        throw new ApiError(409, "videoId is required")
    }

    // if user already liked this video so remove it 
    const alreadyLiked = await Like.findOneAndDelete({
        $and: [{ video: videoId }, { likedBy: userId }]
    })

    if (alreadyLiked) {
        return res.status(201).json(new ApiResponse(200, "successfuly dislike video"))
    }

    try {
        const newLike = await Like.create({
            video: videoId,
            likedBy: userId
        })
        console.log("newLike: ", newLike);

        if (!newLike) {
            throw new ApiError(409, "video like is not created")
        }

        return res.status(201).json(new ApiResponse(200, newLike, "Like successfully created"))

    } catch (error) {
        console.log("Internal server error while toggle video like: ", error);
        throw new ApiError(500, "Internal server error while toggle video like: ", error)
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    const userId = req.user._id

    if (!commentId) {
        throw new ApiError(409, "commendId is required")
    }

    // if user already liked this comment so remove it 
    const alreadyLiked = await Like.findOneAndDelete({
        $and: [{ comment: commentId }, { likedBy: userId }]
    })

    if (alreadyLiked) {
        return res.status(201).json(new ApiResponse(200, "successfuly dislike comment"))
    }

    try {
        const newLike = await Like.create({
            comment: commentId,
            likedBy: userId
        })
        console.log("newLike: ", newLike);

        if (!newLike) {
            throw new ApiError(409, "comment like is not created")
        }

        return res.status(201).json(new ApiResponse(200, newLike, "comment successfully"))

    } catch (error) {
        console.log("Internal server error while toggle comment like: ", error);
        throw new ApiError(500, "Internal server error while toggle comment like: ", error)
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    const userId = req.user._id

    if (!tweetId) {
        throw new ApiError(409, "tweetId is required")
    }

    // if user already liked this tweet so remove it
    const alreadyLiked = await Like.findOneAndDelete({
        $and: [{ tweet: tweetId }, { likedBy: userId }]
    })

    if (alreadyLiked) {
        return res.status(201).json(new ApiResponse(200, "successfuly dislike tweet"))
    }

    try {
        const newLike = await Like.create({
            tweet: tweetId,
            likedBy: userId
        })
        console.log("newLike: ", newLike);

        if (!newLike) {
            throw new ApiError(409, "tweet like is not created")
        }

        return res.status(201).json(new ApiResponse(200, newLike, "tweet successfully"))

    } catch (error) {
        console.log("Internal server error while toggle tweet like: ", error);
        throw new ApiError(500, "Internal server error while toggle tweet like: ", error)
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}