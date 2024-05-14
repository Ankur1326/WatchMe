import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteImageFromCloudinary, deleteVideoFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"

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
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    const videos = await Video.aggregate([
        {
            $match: {
                isPublished: true,
                ...(query && {
                    $or: [
                        { title: { $regex: new RegExp(query, 'i') } },
                        { description: { $regex: new RegExp(query, 'i') } },
                    ],
                }),
                // ...(userId && { owner: userId }),
            }
        },
        { $sample: { size: parseInt(limit) } }, // get rendom videos
        {
            $skip: (page - 1) * limit, //&query=o&sortBy=title&sortType=asc
        },
        {
            $limit: parseInt(limit)
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "userDetals"
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
                __v: 1,
                userDetals: {
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    // Add other user fields as needed
                }
            }
        }

    ])

    // console.log("videos ", videos);
    // console.log("videos.length ", videos.length);


    res.status(200).json({ videos })

})


// endpoint to upload video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    if (title.trim() == "") {
        throw new ApiError(409, "title file is required")
    }
    // console.log("req.files", req.files);

    if (req.files.videoFile.length == 0 && req.files.thumbnail.length == 0) {
        throw new ApiError(409, "videoFile is required")
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

    const { _id } = req.user
    const userId = _id

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
            }
        ])

        // const video = await Video.findById(videoId)
        // console.log(video);

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
        const thumbnailLocalPath = req.file.path

        // delete previous Image 
        await deleteImageFromCloudinary(video.thumbnail)

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        // console.log("thumbnail : ", thumbnail);

        // update title, description and thumbnail values of video
        video.title = title || video.title
        video.description = description || video.description
        video.thumbnail = thumbnail.secure_url || video.thumbnail


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
        // throw new ApiError(404, "video not found")
    }

    // toggle publish status 
    video.isPublished = !video.isPublished

    // save it 
    const updatedVideo = await video.save()

    return res.status(200).json(new ApiResponse(200, updatedVideo, `Video ${video.isPublished == true ? "publish" : "unPublish"} successfully`))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllPublishVideo,
}