import express from "express";
import {
  followOrUnfollow,
  getSuggestedUsers,
  editProfile,
  getProfile,
  logout,
  login,
  register,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { User } from "../models/user.model.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePhoto"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthenticated, followOrUnfollow);
router.get("/search", async (req, res) => {
  const { username } = req.query;
  const users = await User.find({
    username: { $regex: username, $options: "i" },
  }).select("_id username profilePicture");
  res.json({ users });
});

export default router;
