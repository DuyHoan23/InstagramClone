import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";
import { SocketContext } from "@/context/socketContext";

const useGetRTM = () => {
  const socket = useContext(SocketContext); // ✅ Gọi đúng chỗ
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const isCurrentChat =
        selectedUser && newMessage.senderId === selectedUser._id;

      if (isCurrentChat) {
        dispatch(setMessages([...messages, newMessage]));
      } else {
        console.log("📬 Tin nhắn từ người khác - không hiển thị");
        // Thêm logic thông báo tại đây nếu cần
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, messages, selectedUser, dispatch]);
};

export default useGetRTM;
