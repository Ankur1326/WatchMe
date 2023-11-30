import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    // console.log(req.body);
    // res.status(200).json(req.body)
    
    // get user details from frontend
    // validation  - not empty 
    // check if user already exists: with username, email
    // check for image, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res


    const { fullName, email, username, password } = req.body

    // Check fullName, email, username, password is not empty
    if (
        [fullName, email, username, password].some((field) => field?.trim === "")
    ) {
        console.log(field);
        throw new ApiError(400, "All fuelds are required")
    }

    // find username and email from db which user is entered
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    console.log("existedUsre : ", existedUser);

    // Check user is already registerd in db
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists") 
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })
    
    // find user by _id then password is remove from found user and refresh the response 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        // server error - 500
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
    
})

export { registerUser }