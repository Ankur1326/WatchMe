import mongoose, { Schema } from "mongoose";

const playlistSchame = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isPublish: {
        type: Boolean,
        required: false,
    },
    owner: { // creater
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const playlistVideoSchame = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    playlist: {
        type: Schema.Types.ObjectId,
        ref: "Playlist",
        required: true
    },
    addedBy: { // owner
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })


export const Playlist = mongoose.model("Playlist", playlistSchame)
export const PlaylistVideo = mongoose.model("playlistVideo", playlistVideoSchame)