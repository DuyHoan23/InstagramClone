import React, { useRef } from "react";

const ChatbotForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = ""; // Clear the input field

    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]); // Update chat history with user message

    setTimeout(
      () => {
        setChatHistory((history) => [
          ...history,
          { role: "model", text: "Thinking..." },
        ]);
        generateBotResponse([
          ...chatHistory,
          { role: "user", text: userMessage },
        ]); // Call the function to generate bot response
      },

      600
    ); // add a "thinking..." placeholder for the bot's response
  };
  return (
    <form
      className="bg-white p-4 border-t flex items-center gap-2"
      onSubmit={handleFormSubmit}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        required
      />
      <button
        type="submit"
        className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition duration-200 shadow"
      >
        <span className="material-symbols-outlined">arrow_upward</span>
      </button>
    </form>
  );
};

export default ChatbotForm;
