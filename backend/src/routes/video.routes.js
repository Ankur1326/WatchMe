import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllPublishVideo, getAllVideos, getChannelVideos, getVideoById, increaseVideoView, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()
router.use(verifyJWT) // Apply verifyJWT middleware to all routes in this file 

// to get all publish or unpublish videos
router.route("/").get(getAllVideos).post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        }
    ]),
    publishAVideo
)

// to get all publish videos
router.route("/getAll-publish-video").get(getAllPublishVideo)

// get another user channle videos
router.route("/getAll-anoter-channel-videos/:userId").get(getChannelVideos)

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);    

router.route("/views/:videoId").post(increaseVideoView);    

export default router
