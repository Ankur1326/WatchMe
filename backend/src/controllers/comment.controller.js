import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
    const { _id } = req.user
    const userId = _id

    try {
        const allVideoComments = await Comment.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            },
        ])

        const getTenVideoComments = await Comment.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $sort: {
                    createdAt: -1 // descending order based on createdAt time like first creation showing last like this 
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: parseInt(limit)
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id", // match likes with comments, assuming _id is the comment ID
                    foreignField: "comment",
                    as: "commentLikes" // store likes associated with comments in this field
                }
            },
            {
                $lookup: {
                    from: "dislikes",
                    localField: "_id", // match likes with comments, assuming _id is the comment ID
                    foreignField: "comment",
                    as: "commentDislikes" // store likes associated with comments in this field
                }
            },
            {
                $addFields: {
                    likesCount: {
                        $size: "$commentLikes"
                    },
                    dislikesCount: {
                        $size: "$commentDislikes"
                    },
                    isLiked: {
                        $cond: {
                            if: { $in: [new mongoose.Types.ObjectId(userId), "$commentLikes.likedBy"] },
                            then: true,
                            else: false
                        }
                    },
                    isDisliked: {
                        $cond: {
                            if: { $in: [new mongoose.Types.ObjectId(userId), "$commentDislikes.dislikedBy"] },
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
                    userDetails: {
                        fullName: 1,
                        username: 1,
                        avatar: 1
                    },
                    // commentLikes: 1,
                    // commentDislikes: 1,
                    likesCount: 1,
                    dislikesCount: 1,
                    isLiked: 1,
                    isDisliked: 1,
                }
            },
        ])

        if (!getTenVideoComments) {
            return res.status(404).json("No comment on this video")
        }
        // console.log("allVideoComments : ", allVideoComments);
        // console.log("getTenVideoComments : ", getTenVideoComments);

        return res.status(200).json(new ApiResponse(201, { getTenVideoComments, commentsLength: allVideoComments.length }, "AllVideoComments successfully fetched "))

    } catch (error) {
        console.log("Internal server error while fetching all video comments", error);
        throw new ApiError("Internal server error while fetching all video comments", error)
    }

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const { videoId } = req.params
    const { _id } = req.user // owner or user
    const { content } = req.body
    console.log("videoId : ", videoId);
    console.log("content : ", content);

    if (!content) {
        throw new ApiError(404, "content not provide")
    }

    try {
        const newComment = await Comment.create({
            content,
            video: videoId,
            owner: _id
        })

        return res.status(200).json(new ApiResponse(201, newComment, "Comment successfully created"))

    } catch (error) {
        console.log("Internal server error while creaing comment: ", error);
    }
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body
    console.log(commentId, content);

    if (!content) {
        throw new ApiError(404, "content not provide")
    }

    try {
        // get comment from comment id
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true, runValidators: true }
        )
        console.log("updatedComment ", updatedComment);

        if (!updatedComment) {
            throw new ApiError(404, "this comment not exist")
        }


        return res.status(200).json(new ApiResponse(201, { updatedCommet: updatedComment }, "Comment successfully updated"))
    } catch (error) {
        console.log("Internal server error while updating comment: ", error);
    }

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    try {
        // get comment 
        const deletedCommit = await Comment.findByIdAndDelete(commentId)
        if (!deletedCommit) {
            throw new ApiError(404, "This comment not deleted")
        }
        return res.status(200).json(new ApiResponse(201, "comment deleted successfully"))
    } catch (error) {
        throw new ApiError(500, "Internal server error while deleting comment: ", error)
    }

})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}