import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);
  const [isFollowing, setIsFollowing] = useState(
    user?.following?.includes(userProfile?._id) || false
  );

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  // const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const dispatch = useDispatch();

  const followUnfollowHandler = async () => {
    try {
      const res = await axios.post(
        `https://instagramclone-m2gm.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`,
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
        toast.success(res.data.message);
      }
      console.log("Response từ server:", res.data);
    } catch (error) {
      console.error("Lỗi xảy ra:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="flex max-w-6xl justify-center mx-auto pl-18">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #d1d5db",
                          height: "32px",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#e5e7eb")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "white")
                        }
                      >
                        Edit profile
                      </Button>
                    </Link>

                    <Button
                      variant="secondary"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #d1d5db",
                        height: "32px",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e5e7eb")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #d1d5db",
                        height: "32px",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e5e7eb")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      onClick={followUnfollowHandler}
                      variant="secondary"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #d1d5db",
                        height: "32px",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#d1d5db")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      Unfollow
                    </Button>
                    <Link to="/chat">
                      <Button
                        variant="secondary"
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #d1d5db",
                          height: "32px",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#d1d5db")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "white")
                        }
                      >
                        Message
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={followUnfollowHandler}
                    style={{
                      backgroundColor: "#0095F6",
                      border: "1px solid #d1d5db",
                      height: "32px",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#3192d2")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#0095F6")
                    }
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  {userProfile?.username}
                </Badge>
                <span>💻 Learn Code with your style</span>
                <span>💻 Turning code into fun</span>
                <span>💻 DM for collaboration</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>
          <div className="grid grid-cols-3 gap-3 ml-20">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer ">
                  <img
                    src={post.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover group-hover:opacity-85"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart></Heart>
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle></MessageCircle>
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
