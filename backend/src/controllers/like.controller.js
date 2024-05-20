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
    const { action } = req.body

    const userId = req.user._id

    if (!commentId) {
        throw new ApiError(409, "commentId is required")
    }

    if (!action) {
        throw new ApiError(409, "action is required")
    }

    try {
        // Check if user already liked this comment
        const alreadyLiked = await Like.findOne({
            comment: commentId,
            likedBy: userId
        });

        // Check if user already disliked the video
        const alreadyDisliked = await Dislike.findOne({
            comment: commentId,
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
                return res.status(201).json(new ApiResponse(200, "comment successfully unlike"));
            } else {
                // If not liked or disliked, create a new like
                const newLike = await Like.create({
                    comment: commentId,
                    likedBy: userId
                })

                if (!newLike) {
                    throw new ApiError(409, "Comment like is not created");
                }
                return res.status(201).json(new ApiResponse(200, newLike, "comment like successfully created"));
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
                return res.status(201).json(new ApiResponse(200, "comment dislike successfully removed"));
            } else {
                // If not liked or disliked, create a new dislike
                const newDislike = await Dislike.create({
                    comment: commentId,
                    dislikedBy: userId
                })

                if (!newDislike) {
                    throw new ApiError(409, "comment dislike is not created");
                }

                return res.status(201).json(new ApiResponse(200, newDislike, "comment dislike successfully created"));
            }

        } else {
            throw new ApiError(409, "action must be in like or dislike")
        }

    } catch (error) {
        console.log("Internal server error while toggle comment like: ", error);
        throw new ApiError(500, "Internal server error while toggle comment like: ", error)
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { action } = req.body
    const userId = req.user._id

    if (!tweetId) {
        throw new ApiError(409, "tweetId is required")
    }

    if (!action) {
        throw new ApiError(409, "action is required")
    }

    try {
        // Check if user already liked this comment
        const alreadyLiked = await Like.findOne({
            tweet: tweetId,
            likedBy: userId
        });

        // Check if user already disliked the video
        const alreadyDisliked = await Dislike.findOne({
            tweet: tweetId,
            dislikedBy: userId
        })

        if (action === "like") {

            if (alreadyDisliked) {
                // await alreadyDisliked.remove(); // remove dislike
                await Dislike.deleteOne({
                    _id: alreadyDisliked._id
                })
                console.log("like");
            }

            if (alreadyLiked) {
                // await alreadyLiked.remove()
                await Like.deleteOne({
                    _id: alreadyLiked._id
                })
                return res.status(201).json(new ApiResponse(200, "tweet successfully unlike"));
            } else {
                // If not liked or disliked, create a new like
                const newLike = await Like.create({
                    tweet: tweetId,
                    likedBy: userId
                })

                if (!newLike) {
                    throw new ApiError(409, "tweet like is not created");
                }
                return res.status(201).json(new ApiResponse(200, newLike, "tweet like successfully created"));
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
                return res.status(201).json(new ApiResponse(200, "tweet dislike successfully removed"));
            } else {
                // If not liked or disliked, create a new dislike
                const newDislike = await Dislike.create({
                    tweet: tweetId,
                    dislikedBy: userId
                })

                if (!newDislike) {
                    throw new ApiError(409, "tweet dislike is not created");
                }

                return res.status(201).json(new ApiResponse(200, newDislike, "tweet dislike successfully created"));
            }

        } else {
            throw new ApiError(409, "action must be in like or dislike")
        }

    } catch (error) {
        console.log("Internal server error while toggle Tweet like or dislike: ", error);
        throw new ApiError(500, "Internal server error while toggle Tweet like or dislike: ", error)
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

const getVideosLikeAndDislike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    console.log("videoId : ", videoId);

    try {
        if (!videoId) {
            throw new ApiError(409, "videoId is required")
        }

        const likes = await Like.find({ video: videoId })

        const dislikes = await Dislike.find({ video: videoId })

        return res.status(201).json(new ApiResponse(200, { likesCount: likes.length, dislikesCount: dislikes.length }, "Video like and dislike successfully fetched"))

    } catch (error) {
        throw new ApiError(500, "Internal server error while fetching all liked of this video ", error)
    }

})


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getVideosLikeAndDislike
}