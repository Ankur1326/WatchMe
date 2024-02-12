import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

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

    console.log("userId : ", req.query);

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

    console.log("queryObject : ", queryObject);
    console.log("sortObject : ", sortObject);

    const videos = await Video.find(queryObject)
        .sort(sortObject)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    if (!videos) {
        console.log("Videos does not available ");
        throw new ApiError(404, "Videos does not available")
    }

    console.log("videos : ", videos);

    res.status(200).json({ videos })

})


// endpoint to upload video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    if (title.trim() == "") {
        throw new ApiError(409, "title file is required")
    }
    console.log("req.files", req.files);

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

    console.log("videoFile : ", videoFile);

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

    console.log("Created Video :", video);

    return res
        .status(201)
        .json(new ApiResponse(200, video, "video upload Successfully"));

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!videoId) {
        throw new ApiError(409, "Please provide videoId")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "This Video is not present")
    }

    return res.status(200).json(new ApiResponse(video, "Video successfully fetched"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    await Video.findByIdAndDelete(videoId)

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}