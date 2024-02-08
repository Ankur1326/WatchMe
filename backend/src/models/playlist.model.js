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
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: { // creater
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Playlist = mongoose.model("Playlist", playlistSchame)