import {Router} from "express";
import {registerUser, loginUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getUserWatchHistory
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
    // send files in backend from frontend
    // multer is used to upload files in backend
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

//secured routes
// verifyJWT is a middleware that verifies the token and 
// attaches the user object to the request object
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeCurrentPassword);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-account").patch(verifyJWT,updateAccountDetails);//we use patch since we are only updating one field not all
router.route("/avatar").patch(verifyJWT, upload.single('avatar'),updateUserAvatar);
// we use upload.single because we are only uploading one file at a time
router.route("/cover-image").patch(verifyJWT, upload.single('coverImage'),updateUserCoverImage);
//now we are using params to get userchannel profile so,
router.route("/c/:username").get(verifyJWT,getUserChannelProfile),
router.route("/history").get(verifyJWT,getUserWatchHistory)





export default router;
