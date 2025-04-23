import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { CommentDialog } from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { setAuthUser, setSelectedUser } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [isFollowing, setIsFollowing] = useState(
    user?.following?.includes(post?.author?._id) || false
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `https://instagramclone-m2gm.onrender.com/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filer((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://instagramclone-m2gm.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://instagramclone-m2gm.onrender.com/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `https://instagramclone-m2gm.onrender.com/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const followUnfollowHandler = async () => {
    try {
      const res = await axios.post(
        `https://instagramclone-m2gm.onrender.com/api/v1/user/followorunfollow/${post.author._id}`,
        {}, // không cần gửi body
        {
          withCredentials: true, // quan trọng để gửi cookie
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          following: res.data.user?.following,
          followers: res.data.user?.followers,
        };
        dispatch(setAuthUser(updatedUserData));
        setIsFollowing((prev) => !prev); // Đổi trạng thái
        setDialogOpen(false);
        toast.success(res.data.message);
      }
      console.log("Response từ server:", res.data);
    } catch (error) {
      console.error("Lỗi xảy ra:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div
          onClick={async () => {
            try {
              const res = await axios.get(
                `https://instagramclone-m2gm.onrender.com/api/v1/user/${post?.author?._id}/profile`,
                {
                  withCredentials: true,
                }
              );

              if (res.data.success) {
                dispatch(setSelectedUser(res.data.user));
                navigate(`/profile/${post?.author?._id}`);
              }
            } catch (error) {
              console.error("Failed to fetch user info:", error);
            }
          }}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200"
        >
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h3>{post.author?.username}</h3>
            {user?._id === post.author._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id && (
              <Button
                onClick={followUnfollowHandler}
                variant="ghost"
                style={{
                  backgroundColor: "white",
                }}
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                {isFollowing ? "Follow" : "Unfollow"}
              </Button>
            )}

            <Button
              variant="ghost"
              style={{
                backgroundColor: "white",
              }}
              className="cursor-pointer w-fit"
            >
              Add to favorites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                style={{
                  backgroundColor: "white",
                }}
                className="cursor-pointer w-fit"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size={"24"}
              onClick={likeOrDislikeHandler}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
