import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Dislike } from "../models/dislike.modal.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { action } = req.body
    console.log(videoId, action);

    const userId = req.user._id

    if (!videoId) {
        throw new ApiError(409, "videoId is required")
    }
    if (!action) {
        throw new ApiError(409, "action is required")
    }

    try {
        // Check if user already liked the video
        const alreadyLiked = await Like.findOne({
            video: videoId,
            likedBy: userId
        });

        // Check if user already disliked the video
        const alreadyDisliked = await Dislike.findOne({
            video: videoId,
            dislikedBy: userId
        })

        if (action === "like") {

            if (alreadyDisliked) {
                // await alreadyDisliked.remove(); // remove dislike
                await Dislike.deleteOne({
                    _id: alreadyDisliked._id
                })
            } 

            if (alreadyLiked) {
                // await alreadyLiked.remove()
                await Like.deleteOne({
                    _id: alreadyLiked._id
                })
                return res.status(201).json(new ApiResponse(200, "video successfully unlike"));
            } else {
                // If not liked or disliked, create a new like
                const newLike = await Like.create({
                    video: videoId,
                    likedBy: userId
                })

                if (!newLike) {
                    throw new ApiError(409, "Video like is not created");
                }
                return res.status(201).json(new ApiResponse(200, newLike, "video like successfully created"));
            }


        } else if (action === "dislike") {

            if (alreadyLiked) {
                // await alreadyLiked.remove()
                await Like.deleteOne({
                    _id: alreadyLiked._id
                })
            }

            if (alreadyDisliked) {
                // await alreadyDisliked.remove(); // remove dislike
                await Dislike.deleteOne({
                    _id: alreadyDisliked._id
                })
                return res.status(201).json(new ApiResponse(200, "video dislike successfully removed"));
            } else {
                // If not liked or disliked, create a new dislike
                const newDislike = await Dislike.create({
                    video: videoId,
                    dislikedBy: userId
                })

                if (!newDislike) {
                    throw new ApiError(409, "Video dislike is not created");
                }

                return res.status(201).json(new ApiResponse(200, newDislike, "video dislike successfully created"));
            }

        } else {
            throw new ApiError(409, "action must be in like or dislike")
        }

    } catch (error) {
        console.log("Internal server error while toggle video like: ", error);
        throw new ApiError(500, "Internal server error while toggle video like: ", error)
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    const userId = req.user._id

    if (!commentId) {
        throw new ApiError(409, "commentId is required")
    }

    try {

        

    } catch (error) {
        console.log("Internal server error while toggle Comment like: ", error);
        throw new ApiError(500, "Internal server error while toggle Comment like: ", error)
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    const userId = req.user._id

    if (!tweetId) {
        throw new ApiError(409, "tweetId is required")
    }

    try {
        
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