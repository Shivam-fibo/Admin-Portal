import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import jwt from 'jsonwebtoken'

export const verifyToken = asyncHandler(async(req, res, next) =>{
try {
        const token = req.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new ApiError(401, "Unauthroize request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
      const user =  User.findOne(decodedToken?._id).select("-password -refreshToken")
      if(!user){
        throw new ApiError(401, "Invalid Access token")
      }
    
      req.user = user;
      next()
    } catch (error) {
            throw new ApiError(401, error?.message || "Invalid access Token")
     }
})
