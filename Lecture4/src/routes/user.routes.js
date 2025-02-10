import {Router} from "express";
import {registerUser, loginUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {logoutUser, refreshAccessToken} from "../controllers/user.controller.js";

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

export default router;
