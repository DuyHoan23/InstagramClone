import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

function Comment({ comment }) {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h5 className="font-bold text-sm">
          {comment?.author.username}
          <span className="font-normal pl-1">{comment?.text}</span>
        </h5>
      </div>
    </div>
  );
}

export default Comment;
