const express = require("express");
const router = express.Router();

const PostsController = require('../controllers/posts');

// router.get("/", PostsController.posts_get_all);

// router.get("/comments", PostsController.posts_comments);

router.get("/top_posts", PostsController.top_posts);

router.get("/posts_filter", PostsController.filter_posts);

module.exports = router;
