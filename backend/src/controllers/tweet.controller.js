import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const userId = req.user._id
    console.log("userId : ", userId);
    try {
        const { content } = req.body

        if (!content) {
            throw new ApiError(409, "contain is required")
        }

        const tweet = await Tweet.create({
            content: content,
            owner: userId,
        })
        if (!tweet) {
            throw new ApiError(409, "tweet is not being created")
        }

        return res.status(201).json(new ApiResponse(200, tweet, "Tweet successfully created!"))

    } catch (error) {
        console.log("Error while creating tweet : ", error);
        throw new ApiError(500, "Internal server error while creating tweet : ", error)
    }

})


const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.user._id

    try {
        const tweets = Tweet.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $sort: {
                    createdAt: -1 // descending order based on createdAt time like first creation showing last like this 
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: userDetails,
                    pipeline: [
                        {
                            $project: {
                                fullName: 1,
                                acatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "tweet",
                    as: "likes"
                }
            },
            {
                $lookup: {
                    from: "dislikes",
                    localField: "_id",
                    foreignField: "tweet",
                    as: "dislikes"
                }
            },
            {
                $addFields: {
                    likesCount: {
                        $size: "$likes"
                    },
                    dislikesCount: {
                        $size: "$dislikes"
                    },
                    isLiked: {
                        $cond: {
                            if: { $in: [new mongoose.Types.ObjectId(userId), "$likes.likedBy"] },
                            then: true,
                            else: false
                        }
                    },
                    isDisliked: {
                        $cond: {
                            if: { $in: [new mongoose.Types.ObjectId(userId), "$dislikes.dislikedBy"] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userDetails: 1,
                    likesCount: 1,
                    dislikesCount: 1,
                    isLiked: 1,
                    isDisliked: 1
                }
            }
        ])

        if (!tweets) {
            throw new ApiError(404, "Tweets not found for this user")
        }

        return res.status(200).json(new ApiResponse(200, tweets, "tweets successfully fetched"))

    } catch (error) {
        throw new ApiError(500, "Internal server while getting user Tweets")
    }

})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const {content} = req.body

    console.log(commentId, content);

    if (!content) {
        throw new ApiError(404, "content not provide")
    }

    try {
        // get tweet by tweetId 
        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            { content },
            // { new: true, runValidators: true }
        )
        console.log("updatedComment ", updatedTweet);

        if (!updatedTweet) {
            throw new ApiError(404, "this tweet not exist")
        }


        return res.status(200).json(new ApiResponse(201, { updatedTweet: updatedTweet }, "Tweet successfully updated"))

    } catch (error) {
        console.log("Internal server error while updating tweet: ", error);
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    try {
        // get tweet 
        const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
        if (!deletedTweet) {
            throw new ApiError(404, "This tweet does not deleted")
        }
        return res.status(200).json(new ApiResponse(201, "tweet deleted successfully"))
    } catch (error) {
        throw new ApiError(500, "Internal server error while deleting tweet: ", error)
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}