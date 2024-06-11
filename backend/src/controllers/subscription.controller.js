import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO : toggle subscription
    // console.log("channeId : ", channelId);
    // console.log("user : ", req.user);
    const userId = req.user._id

    try {
        // check if subscribtion already exists for the given subscriber and channel 
        const existingSubscription = await Subscription.findOneAndDelete({
            $and: [
                { subscriber: userId },
                { channel: channelId },
            ]
        })

        // console.log("existingSubscription : ", existingSubscription);

        // Subscription doesn't exist, create a new one
        if (!existingSubscription) {
            const subscription = await Subscription.create({
                subscriber: userId, // another user channel
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
    // kitne subscribers hai channel ke
    console.log(channelId);
    if (!channelId) {
        throw new ApiError(409, "ChannelId is required")
    }

    // const subscribers = await Subscription.find({ channel: channelId })

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $sort: {
                createdAt: -1 // descending order based on createdAt time like first creation showing first like this...
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "channelDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers",
                        },

                    },
                    {
                        $addFields: {
                            subscribersCount: {
                                $size: "$subscribers"
                            }
                        },
                    },
                    {
                        $project: {
                            subscribersCount: 1,
                            avatar: 1,
                            username: 1,
                        },
                    },
                ]
            },
        },
        {
            $project: {
                avatar: 1,
                username: 1,
                subscribersCount: 1,
                channelDetails: 1,
            },
        },
    ])


    if (!subscribers) {
        throw new ApiError(404, "This channel has no subscribe")
    }

    // console.log("subscribers : ", subscribers);

    return res.status(201).json(new ApiResponse(200, subscribers, "subscribers successfully fetched"))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    // mne kinko subscribe kiya hai

    try {
        if (!subscriberId) {
            throw new ApiError(409, "subscriberId required")
        }

        const subscribedChannels = await Subscription.aggregate([
            {
                $match: {
                    subscriber: new mongoose.Types.ObjectId(subscriberId)
                }
            },
            {
                $sort: {
                    createdAt: -1 // descending order based on createdAt time like first creation showing first like this...
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "channelDetails",
                    pipeline: [
                        {
                            $lookup: {
                                from: "subscriptions",
                                localField: "_id",
                                foreignField: "channel",
                                as: "subscribers",
                            },

                        },
                        {
                            $addFields: {
                                subscribersCount: {
                                    $size: "$subscribers"
                                }
                            },
                        },
                        {
                            $project: {
                                subscribersCount: 1,
                                avatar: 1,
                                username: 1,
                            },
                        },
                    ]
                },
            },
            {
                $project: {
                    avatar: 1,
                    username: 1,
                    subscribersCount: 1,
                    channelDetails: 1,
                },
            },
        ])


        // console.log("subscribedChannels : ", subscribedChannels.channelDetails);

        return res.status(201).json(new ApiResponse(200, subscribedChannels, "subscribed channles successfully fetched"))

    } catch (error) {
        console.log("Error while getting subscribed channles");
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}