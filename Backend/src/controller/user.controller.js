import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../model/user.model.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token in the user object
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Token Generation Error:', error); // Log the error for better debugging
        throw new ApiError(500, "Something went wrong");
    }
};

// Function to register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body

    // Validate that all required fields are present
    if (!fullName || !email || !username || !password) {
        throw new ApiError(400, "All fields are required")
    }

    // Check if the email is already in use
    const existedEmail = await User.findOne({ email })
    if (existedEmail) {
        throw new ApiError(409, "Email already exists")
    }

    // Check if the username is already in use
    const existedUsername = await User.findOne({ username })
    if (existedUsername) {
        throw new ApiError(409, "Username already exists")
    }

    // Get the avatar and cover image paths from the uploaded files
   

    // Create a new user with the provided details
    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
    })

    // Fetch the newly created user, excluding the password and refresh token
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

   

    // Respond with the created user details and a success message
    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"))
})
const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: false }; // Set secure based on your environment

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

// Function to log out a user (placeholder)
const logOutUser = asyncHandler(async (req, res) => {
    // Placeholder for user logout functionality
})

// Function to refresh the access token using the refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    // Ensure a refresh token is provided
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    // Verify the incoming refresh token
    const decodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodeToken?._id)
    if (!user) {
        throw new ApiError(401, "Invalid refresh token")
    }

    // Check if the refresh token matches the one stored in the user's profile
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired")
    }

    // Generate new access and refresh tokens
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user?._id)
    const options = { httpOnly: true, secure: true }

    // Respond with the new tokens
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"))
})


export const getUser = asyncHandler((req, res, next) =>{
    const user = req.user;
    res.status(200).json({
      success: true,
      user
    })
  })
    

export {registerUser, loginUser, logOutUser, getUser}