import { useState, useRef, useEffect } from "react";
import ChatbotForm from "./ChatbotForm";
import ChatbotIcon from "./chatBotIcon";
import ChatbotMessage from "./ChatbotMessage";

const ChatbotPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const generateBotResponse = async (history) => {
    // Helper: cập nhật chat history với phản hồi từ bot
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text },
      ]);
    };

    // Chuẩn hóa format chat gửi lên API
    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );

      const contentType = response.headers.get("content-type");

      // Trường hợp server trả về không phải JSON
      if (!contentType || !contentType.includes("application/json")) {
        const rawText = await response.text();
        console.error("Invalid response format. Raw:", rawText);
        throw new Error("Server did not return valid JSON.");
      }

      // Parse JSON sau khi chắc chắn là JSON
      const data = await response.json();

      // Kiểm tra lỗi từ phía API
      if (!response.ok) {
        throw new Error(data?.error?.message || "Something went wrong!");
      }

      // Lấy nội dung phản hồi của bot
      const apiResponseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!apiResponseText) {
        throw new Error("No content received from bot.");
      }

      // Làm sạch định dạng markdown nếu có
      const cleanedText = apiResponseText.replace(/\*\*(.*?)\*\*/g, "$1");

      // Cập nhật lịch sử chat
      updateHistory(cleanedText);
    } catch (error) {
      console.error("Bot API error:", error);
      updateHistory("⚠️ Sorry, something went wrong.");
    }
  };

  // Auto scroll to bottom on new chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChatbotIcon />
            <h2 className="text-white text-xl font-semibold">Chatbot</h2>
          </div>
        </div>

        {/* Body */}
        <div
          className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50 max-h-[400px]"
          ref={chatContainerRef}
        >
          {/* Bot welcome message */}
          <div className="flex items-start gap-3">
            <ChatbotIcon />
            <div className="bg-indigo-100 text-indigo-900 p-3 rounded-xl max-w-[80%] shadow">
              Hello! I am your virtual assistant. How can I help you today?
            </div>
          </div>

          {/* Render chat history */}
          {chatHistory.map((chat, index) => (
            <ChatbotMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Footer */}
        <div>
          <ChatbotForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
