import { useState } from "react";
import ChatbotPage from "./ChatbotPage";
import { motion, AnimatePresence } from "framer-motion";

const ChatbotWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all z-50"
      >
        🤖
      </button>

      {/* Chatbot Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-40"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <ChatbotPage />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWrapper;
