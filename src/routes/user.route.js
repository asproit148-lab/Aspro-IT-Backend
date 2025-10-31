import express from 'express';
import {getUser,registerUser,logoutUser,loginUser,refreshAccessToken,googleLogin}  from '../controllers/userController.js'
import {authenticate} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/google", googleLogin);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/logout').post(authenticate,logoutUser);
router.route('/get-info').get(authenticate,getUser);

export default router;