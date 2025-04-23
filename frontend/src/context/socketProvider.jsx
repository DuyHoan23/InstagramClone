import { useEffect, useRef, useState } from "react";
import { SocketContext } from "./socketContext";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setOnlineUsers } from "@/redux/chatSlice";
import { setLikeNotification } from "@/redux/rtnSlice";

const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      socketRef.current = socketio;

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        if (socketio.readyState === 1) {
          // <-- This is important
          socketio.close();
          socketRef.current = null;
        }
      };
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
