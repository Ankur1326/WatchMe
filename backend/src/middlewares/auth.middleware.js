import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // using for web browser 
    const token = req.cookies?.accessToken || req.header("Authorization");

    console.log("accessToken :", req.header(("Authorization")));

    if (!token) {
      throw new ApiError(404, "Unauthorized request");
    }

    console.log("token : ", token);

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("decodedToken : ", decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error : ", error);
    throw new ApiError(401, error?.message || "Invalid access token")
  }
});
