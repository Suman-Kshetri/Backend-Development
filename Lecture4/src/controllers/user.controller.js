import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"



const generateAccessAndRefreshToken = async (userId) => {
    try {
        //generate access and refresh token
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //refresh token to database
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        //return access and refresh token 
        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

const registerUser = asyncHandler(
    async (req, res) => {
        
        //steps for register user
    //1. get data from frontend
    //2. validate data-> not empty
    //3. check if user already exists: username, email
    //4. check for images, check for avatar
    //5. upload them to cloudinary:,check avatar in cloudinary
    //6. Create user object - create entry in database
    //7. remove password and refresh token field from response
    //8. check for user creation
    //9. return response
    // get data from frontend
    const {fullName, email, username, password} = req.body;
    console.log('email:',  email);
    console.log("Request body:",req.body);
    //validation
    if(
        //ckecking if any of the fields are empty or not
        [fullName,email,username,password].some((field) => field?.trim() === "")
    )
    {
        throw new ApiError(400,"All fields are required");
    }

    //check if user already exists or not
    const existedUser = await User.findOne({
        //only one field can also be used
        // like: ({username})
        $or: [
            {username}, {email}
        ]
    })
    //returns if match is found
    if(existedUser){
        throw new ApiError(409, "User already exists with same username or email");
    }

    //check for images and avatar
    // in req.body all data comes  using express
    // multer gives the data in req.files
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    // to check if coverImage is present or not 
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;

    }

    console.log("request files: ",req.files);
    

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required");
    }

    //uploading both files to cloudinary [using utils/cloudinary.js]
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar)
    {
        throw new ApiError(400, "Avatar File is required");
    }

    //create user object
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", //if coverImage is not present then it will be empty 
        email,
        password,
        username: username.toLowerCase(),
    })

    // cheking if user is empty or not .
    // database add _id with each entry in database
    // and using select method to delete password and refreshToken
    const createdUsername = await User.findById(user._id).select(
        "-password -refreshToken"//what isnot needed
    )

    if(!createdUsername)
    {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    //return response
    return res.status(201).json(
        new ApiResponse(201, createdUsername, "User created successfully")
    )


});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(email || username)) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (!user) {
        throw new ApiError(404, "User or Email doesn't exist.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User credentials");
    }

    // Fix: Await token generation
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // Fix: Await user retrieval
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.
    status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken)
    {
        throw new ApiError(401, "unautorized access");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id);
    
        if(!user)
        {
            throw new ApiError(401, "Invalid refresh token");
        }
    
        if(incomingRefreshToken !== user?.refreshToken)
            {
                throw new ApiError(401, "Refresh token is expired");
            }
        
            const options = {
                httpOnly: true,
                secure: true
            }
            const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    
            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse (200, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed successfully")
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
        
    }

});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect)
    {
        throw new ApiError(400, "Invalid password");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    retrun res.
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullName, email} = req.body;

    if(!fullName || !email)
        {
            throw new ApiError(400, "All fields are required");
        }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email
            }
        },
        {
            new: true
        }
    ).select("-password");
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details updated successfully"));
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath)
        {
            throw new ApiError(400, "Avatar file is required");
        }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url)
        {
            throw new ApiError(400, "Error while uploading avatar");
        }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password");

    return res  
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));

})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverLocalPath = req.file?.path;

    if(!coverLocalPath)
        {
            throw new ApiError(400, "Cover Image is required");
        }
    const coverImage = await uploadOnCloudinary(coverLocalPath);

    if(!coverImage.url)
        {
            throw new ApiError(400, "Error while uploading avatar");
        }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-password");
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image updated successfully"));
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
} 