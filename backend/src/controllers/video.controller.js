import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteImageFromCloudinary, deleteVideoFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"

// get all publish or unpublish video
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    // page: defaule value 1 
    // limit: defaule value 10  

    // query : If Provided, it can be used to filter videos based on some criteria, like title, description, or tags

    // sortBy: Determines the field by which the videos should be ordered, for example, sorting by title, date, or popularity.

    // sortType: determine the order in which the videos should be sorted (ascending or descinding)

    // userId: If provieded, it may be used to fetch videos associated with a particular user 


    // get all video based on query

    // console.log("userId : ", req.query);

    const queryObject = {}

    if (query) {
        queryObject.$or = [
            { title: { $regex: new RegExp(query, 'i') } },
            { description: { $regex: new RegExp(query, 'i') } },
        ];
    }

    if (userId) {
        queryObject.owner = userId
    }

    const sortObject = {}

    if (sortBy) {
        sortObject[sortBy] = sortType === 'desc' ? -1 : 1;
    }

    // console.log("queryObject : ", queryObject);
    // console.log("sortObject : ", sortObject);

    const videos = await Video.find(queryObject)
        .sort(sortObject)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    if (!videos) {
        console.log("Videos does not available ");
        throw new ApiError(404, "Videos does not available")
    }

    // console.log("videos : ", videos);


    res.status(200).json({ videos })

})

// get all publish video 
const getAllPublishVideo = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'asc', userId } = req.query
    
    try {
        
            // Step 1: Count total matching documents
            const matchStage = {
                isPublished: true,
                ...(query && {
                    $or: [
                    { title: { $regex: new RegExp(query, 'i') } },
                    { description: { $regex: new RegExp(query, 'i') } },
                ],
            }),
            // ...(userId && { owner: mongoose.Types.ObjectId(userId) }),
        };
        const totalVideos = await Video.countDocuments(matchStage);
        console.log('Total matching videos:', totalVideos);

        const sortStage = {};
        sortStage[sortBy] = sortType === 'desc' ? -1 : 1;

        const videos = await Video.aggregate([
            { $match: matchStage },
            { $sort: sortStage },
            { $skip: (page - 1) * limit }, //&query=o&sortBy=title&sortType=asc
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    views: 1,
                    isPublished: 1,
                    owner: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userDetails: {
                        _id: 1,
                        username: 1,
                        avatar: 1,
                        // Add other user fields
                    }
                }
            }
        ])
        return res.status(200).json(new ApiResponse(201, videos, "publish videos successfully fetched"))
        // return res.status(200).json({ videos })
    } catch (error) {
        console.log("error while fetching all publish videos : ", error);
    }


})


// endpoint to upload video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    if (title.trim() == "") {
        throw new ApiError(409, "title file is required")
    }
    console.log("req.files", req.files);

    // Check if req.files exists and contains the necessary files
    if (!req.files || !req.files.videoFile || req.files.videoFile.length === 0) {
        throw new ApiError(409, "videoFile is required");
    }

    if (!req.files.thumbnail || req.files.thumbnail.length === 0) {
        throw new ApiError(409, "thumbnail is required");
    }

    // get local path 
    const videoFileLocalPath = req.files?.videoFile[0].path
    const thumbnailLocalPath = req.files?.thumbnail[0].path

    // upload on cloudinary 
    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    // check if video file is not upload on cloud..
    if (!videoFile) {
        throw new ApiError(400, "Video file could not be upload on cloudinary")
    }

    // check if thumbnail file is not upload on cloud..
    if (!thumbnail) {
        throw new ApiError(400, "thumbnail could not be upload on cloudinary")
    }

    //console.log("videoFile : ", videoFile);

    // create new video document 
    const video = await Video.create({
        videoFile: videoFile.secure_url,
        thumbnail: thumbnail.secure_url,
        title: title,
        description: description,
        duration: videoFile.duration,
        owner: req.user._id
    })

    if (!video) {
        throw new ApiError(500, "Something went wrong while creating new video document")
    }

    // console.log("Created Video :", video);

    return res
        .status(201)
        .json(new ApiResponse(200, video, "video upload Successfully"));

})

const getVideoById = asyncHandler(async (req, res) => {

    const userId = req.user._id

    try {
        const { videoId } = req.params

        if (!videoId) {
            throw new ApiError(409, "Please provide videoId")
        }

        const video = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "userDetails",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                fullName: 1,
                                username: 1,
                                avatar: 1,
                            },
                        }
                    ]
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes"
                }
            },
            {
                $lookup: {
                    from: "dislikes",
                    localField: "_id",
                    foreignField: "video",
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
                    _id: 1,
                    videoFile: 1,
                    title: 1,
                    description: 1,
                    thumbnail: 1,
                    duration: 1,
                    views: 1,
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

        // const video = await Video.findById(videoId)
        console.log(video);

        if (!video) {
            throw new ApiError(404, "This Video is not present")
        }

        return res.status(200).json(new ApiResponse(200, video, "Video successfully fetched"))
    } catch (error) {
        console.log("error while getting video : ", error);
    }
})

const updateVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const { title, description } = req.body

        //TODO: update video details like title, description, thumbnail
        const video = await Video.findById(videoId) // find video based on videoId

        // console.log(req.file);
        let thumbnailLocalPath = ""

        if (req.file) {
            thumbnailLocalPath = req.file.path
            await deleteImageFromCloudinary(video.thumbnail)
        }

        // delete previous Image 
        let thumbnail = ""
        if (thumbnail) {
            thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        }

        // console.log("thumbnail : ", thumbnail);

        // update title, description and thumbnail values of video
        video.title = title || video.title
        video.description = description || video.description
        if (thumbnail) {
            video.thumbnail = thumbnail.secure_url || video.thumbnail
        }


        await video.save()

        return res.status(200).json({ video, message: "video successfully update" })
    } catch (error) {
        console.log("error while update video : ", error);
    }
})

const deleteVideo = asyncHandler(async (req, res) => {
    try {
        // console.log("Hiiiii");
        const { videoId } = req.params
        //TODO: delete video
        // console.log("videoId : ", videoId);
        const video = await Video.findById(videoId)
        // console.log("video : ", video);

        // check video found or not 
        if (!video) {
            return res.status(404).json(new ApiError(404, "video not found"))
            // throw new ApiError(404, "video not found")
        }

        // delete document from database 
        const deletedVideo = await Video.findByIdAndDelete(videoId)
        // console.log("deleteVideo : ", deletedVideo);

        // delete Video from cloudinary
        await deleteVideoFromCloudinary(video.videoFile)

        // delete thumbnail from cloudinary 
        await deleteImageFromCloudinary(video.thumbnail)

        return res
            .status(201)
            .json(new ApiResponse(200, "video delete successfully"));

    } catch (error) {
        console.log("error while deleting video : ", error);
    }

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // get video based on videoId
    const video = await Video.findById(videoId)

    // check video found or not 
    if (!video) {
        throw new ApiError(404, "video not found")
    }

    // toggle publish status 
    video.isPublished = !video.isPublished

    // save it 
    const updatedVideo = await video.save()

    return res.status(200).json(new ApiResponse(200, updatedVideo, `Video ${video.isPublished == true ? "publish" : "unPublish"} successfully`))

})

// get all user another user channel videos
const getChannelVideos = asyncHandler(async (req, res) => {
    const { userId } = req.params

    console.log(userId);
    try {
        const videos = await Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId),
                    isPublished: true,
                }
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
                $project: {
                    _id: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    views: 1,
                    isPublished: 1,
                    owner: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userDetails: {
                        _id: 1,
                        username: 1,
                        avatar: 1,
                        // Add other user fields
                    }

                }
            },

        ])

        console.log("videos ", videos);

        if (!videos || videos.length === 0) {
            throw new ApiError(404, "Videos not found for this user")
        }

        return res.status(200).json(new ApiResponse(200, videos, `Videos successfully  fetched`))

    } catch (error) {
        console.log("Internal server error while fetched videos", error);
        throw new ApiError(500, "Internal server error while fetched videos", error)
    }

})
const increaseVideoView = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    try {
        // get video based on videoId
        const video = await Video.findById(videoId)

        // check video found or not
        if (!video) {
            throw new ApiError(404, "video not found")
        }

        // increase the video views
        video.views = +1

        // save it 
        const updatedVideo = await video.save()

        return res.status(200).json(new ApiResponse(200, updatedVideo, `Video views successfully increased by one`))

    } catch (error) {
        throw new ApiError(500, "Internal server error while increased video views", error)
    }

})



export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllPublishVideo,
    increaseVideoView,
    getChannelVideos
}