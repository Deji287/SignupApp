import { Router } from "express";
const router = Router();

import * as controller from "../controllers/appController.js";
import { registerMail } from "../controllers/mailer.js";
import Auth, { localVariables } from "../middleware/auth.js";

// post
router.route("/register").post(controller.register); //register user
router.route("/registerMail").post(registerMail); //send email
router.route("/authenticate").post((req, res) => {
  res.end();
}); // authenticate user
router.route("/login").post(controller.verifyUser, controller.login); //login in the app

//get
router.route("/user/:username").get(controller.getUser); //get user with username
router.route("/user/id/:id").get(controller.getUser); //get user with username
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariables, controller.generateOTP); //generate OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP); //verify user
router.route("/createResetFunction").get(controller.createResetSession); //reset all variable

//put
router.route("/updateUser").put(Auth, controller.updateUser); // update user profile
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword); // reset password

export default router;
