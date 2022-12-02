const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
// @route post api/posts
// @desc Create post
//  @access Private
router.post(
  "/",
  [auth, [check("text", "Text is Required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route GET api/posts
// @desc Get all posts
//  @access private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //sorts by most recent one
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route GET api/posts/:id
// @desc Get post by id
//  @access private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route DELETE api/posts/:id
// @desc Delete all posts
//  @access private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); //sorts by most recent one
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //   check if user is authorized to delete the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await post.remove();
    res.json({ msg: "post removed" });
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
