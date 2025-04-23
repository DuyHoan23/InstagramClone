import React from "react";
import ChatbotIcon from "./chatBotIcon";

const ChatbotMessage = ({ chat }) => {
  const isBot = chat.role === "model"; // true nếu là bot, false nếu là user

  return (
    !chat.hideInChat && (
      <div
        className={`flex items-start gap-3 ${
          isBot ? "justify-start" : "justify-end"
        }`}
      >
        {isBot && <ChatbotIcon />} {/* Hiển thị icon nếu là bot */}
        <div
          className={`p-3 rounded-xl max-w-[80%] shadow ${
            isBot
              ? "bg-indigo-100 text-indigo-900"
              : "bg-purple-100 text-purple-900"
          }`}
        >
          {chat.text}
        </div>
      </div>
    )
  );
};

export default ChatbotMessage;
