import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            picturePath,
            userPicturePath: user.picturePath,
            likes: {},
            comments: []
        });
        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        console.log('Error: ', err);
        res.status(409).json({
            error: err.message
        });
    }
};

// READ
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(201).json(posts);
    } catch (err) {
        console.log('Error: ', err);
        res.status(404).json({
            error: err.message
        });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({userId});
        res.status(201).json(post);
    } catch (err) {
        console.log('Error: ', err);
        res.status(404).json({
            error: err.message
        });
    }
};

// UPDATE
export const likePosts = async (req, res) => {
    try {
        const { id } = req.params; // from query string
        const { userId } = req.body; // from body
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked){ // dislike
            post.likes.delete(userId);
        } else{ // like
            post.likes.set(userId)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id, {
                likes: post.likes
            }
        );

        res.status(201).json(updatedPost);
    } catch (err) {
        console.log('Error: ', err);
        res.status(404).json({
            error: err.message
        });
    }
};