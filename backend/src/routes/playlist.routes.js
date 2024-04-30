import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.route("/")
    .post(verifyJWT, createPlaylist)

router.route("/user/:userId")
    .get(getUserPlaylists)

router.route("/:playlistId")
    .get(getPlaylistById)
    .delete(verifyJWT, deletePlaylist)
    .patch(verifyJWT, updatePlaylist)

router.route("/:playlistId/:videoId")
    .post(verifyJWT, addVideoToPlaylist)
    .delete(verifyJWT, removeVideoFromPlaylist)

export default router;    