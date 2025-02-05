import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

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


export {registerUser} 