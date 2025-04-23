import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://instagramclone-m2gm.onrender.com/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h3 className="font-bold text-xl">Edit Profile</h3>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-sm">{user?.username}</h3>
              <span className="text-gray text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
          />
          <Button
            onClick={() => imageRef?.current.click()}
            style={{
              backgroundColor: "#0095F6",
              height: "32px",
              borderRadius: "8px",
              padding: "0 16px",
              color: "white",
              border: "none",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#318bc7")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#0095F6")
            }
          >
            Change photo
          </Button>
        </div>
        <div>
          <h3 className="font-bold text-xl mb-2">Bio</h3>
          <Textarea
            value={input?.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            className="focus-visible:ring-transparent"
          ></Textarea>
        </div>
        <div>
          <h3 className="font-bold mb-2">Gender</h3>
          <Select
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="w-full text-white">
              <SelectValue
                className="w-full text-white"
                placeholder="Select gender"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button
              style={{
                backgroundColor: "#0095F6",
                height: "32px",
                borderRadius: "8px",
                padding: "0 16px",
                color: "white",
                border: "none",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#318bc7")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#0095F6")
              }
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin">
                Please wait
              </Loader2>
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              style={{
                backgroundColor: "#0095F6",
                height: "32px",
                borderRadius: "8px",
                padding: "0 16px",
                color: "white",
                border: "none",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#318bc7")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#0095F6")
              }
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
