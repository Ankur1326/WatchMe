import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  console.log(req.body);
  console.log(req.files);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  console.log("avatarLocalPath : ", avatarLocalPath);
  console.log("coverImageLocalPath : ", coverImageLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file could not be uploaded to Cloudinary");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // check user is created or not and remove passsword and refreshToken field
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const generateRefreshAndAccessToken = async (user_id) => {
  try {
    const user = await User.findById(user_id);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error while generate refresh and access token");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // get user data form req.body
  // check username, email and password not empty
  // check user email and password is correct and metched any entry
  // if match so user can logged in otherwise not

  //get user data form req.body
  // username or email
  // find the user
  // password check
  // generate access and refresh token
  // send cookie

  const { username, email, password } = req.body;

  console.log("Request body: ", req.body);
  console.log("Provided credentials: ", username, email, password);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // find by username or email
  // const user = await User.findOne({
  //   $or: [{ username }, { email }],
  // });

  const user = await User.findOne({
    $or: [
      { username: username ? { $regex: new RegExp(username, 'i') } : null },
      { email: email ? { $regex: new RegExp(email, 'i') } : null },
    ],
  });

  console.log("user.password : ", user.password);


  if (password === user.password) {
    console.log("Password match!");
  } else {
    console.log("Password mismatch!");
  }

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password.trim());

  console.log("user ", user.password);
  console.log("isPasswordValid : ", isPasswordValid);
  
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials (Incorrect password)");
  }

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    user._id
  );

  // for send cookie
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logoutUser };
