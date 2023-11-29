import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    // console.log(req.body);
    // res.status(200).json(req.body)

    let userDetails = new User({
        username: req.body.username,
        email: req.body.email,
        fullName: req.body.fullName,
        avater: req.body.avater,
        coverImage: req.body.coverImage,
        password: req.body.password
    })

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

    if (
        [fullName, email, username, password].some((field) => field?.trim === "")
    ) {
        throw new ApiError(400, "All fuelds are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists") 
    }

})

export { registerUser }