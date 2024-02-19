import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO : toggle subscription
    console.log("channeId : ", channelId);
    console.log("user : ", req.user);
    const user = req.user

    try {
        // check if subscribtion already exists for the given subscriber and channel 
        const existingSubscription = await Subscription.findOneAndDelete({
            $and: [
                { subscriber: user?._id },
                { channel: channelId },
            ]
        })

        console.log("existingSubscription : ", existingSubscription);

        // Subscription doesn't exist, create a new one
        if (!existingSubscription) {
            const subscription = await Subscription.create({
                subscriber: user?._id, // another user channel
                channel: channelId, // my channel
            })

            if (!subscription) {
                throw new ApiError(400, "not subscribed")
            }
            return res
                .status(200)
                .json(
                    new ApiResponse(200, "Subscribed create successfully")
                );
        }
        else { // if subscription exist
            return res
                .status(200)
                .json(
                    new ApiResponse(200, "Subscribed delete successfully")
                );
        }
    } catch (error) {
        console.log("Error while toggle subscription ", error);
    }

})

// controller to return subscription list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}