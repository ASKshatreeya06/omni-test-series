const express = require('express')
const router = express.Router()
const {Login, Register, Logout,  getMyProfile,  profileUpdate} = require('../controller/user_controller')
const {question, answer} = require('../controller/paper')
const auth = require('../middleware/protect')
router.route("/login").post(Login)
router.route("/register").post(Register)
router.route("/profileupdate").put(auth,profileUpdate)
router.route("/logout").get(auth,Logout)
router.route("/getmyprofile").get(auth,getMyProfile)
router.route("/paper").get(auth,question)
router.route("/answer_submit").post(auth,answer)


module.exports = router;