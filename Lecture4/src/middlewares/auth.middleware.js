// to verify user exists or not
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
//Mobile Apps Don't Automatically Handle Cookies :
/*          Unlike web browsers, mobile apps don’t automatically send cookies with every request.
            If you store the token in cookies, you’d have to manually attach it to each request, which is not ideal.
            The Authorization header provides a more direct and explicit way to send authentication tokens.
*/
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token)
        {
            throw new ApiError(401, "Unauthorized access. Please login again");
        }
        //verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        //check if user exists
        const user = await User.findById(decodedToken?._id);
        .select("-password -refreshToken")
    
        if(!user)
            {throw new ApiError(404, "Invalid access token");}
    
        //attach user to request object of request handler 
        req.user = user;
        next();
    
    } catch (error) {
        throw new ApiError(401, error?.message||"Invalid access token");
        
    }
})