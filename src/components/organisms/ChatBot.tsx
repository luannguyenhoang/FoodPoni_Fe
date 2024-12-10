import { useState } from "react";

type Props = {
  showChatbot: boolean;
  toggleChatbot: () => void;
};

export default function ChatBot({ showChatbot, toggleChatbot }: Props) {
  const [isGifColored, setIsGifColored] = useState(false);
  const [chatbotImage, setChatbotImage] = useState("/chat-sleep.gif");

  const handleToggleChatbot = () => {
    toggleChatbot();
    setIsGifColored(!isGifColored);
    setChatbotImage((prev) =>
      prev === "/chat-sleep.gif" ? "/chat-run-2.gif" : "/chat-sleep.gif",
    );
  };

  return (
    <>
      <div
        className={`fixed bottom-0 right-5 z-30 transition-opacity duration-300 ${showChatbot ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <iframe
          src="https://docsbot.ai/iframe/QtQHengqIsNpGqyaJjnT/RmsS1cW33KOGKBgQcBvr"
          width="350"
          height="600"
        />
      </div>

      <span
        className="fixed bottom-24 z-50 right-2 w-auto h-10 p-5 rounded-lg flex items-center cursor-pointer transition-colors duration-300"
        onClick={handleToggleChatbot}
      >
        <div className="relative">
          <div className="group w-20 h-32">
            <img
              src={chatbotImage}
              alt="AI"
              className={`w-20 h-20 ${isGifColored ? "" : "filter grayscale"}`}
            />
          </div>
          <div className="font-bold absolute bottom-8 right-0 text-xl">
            chat<span className="text-orange-500">bot</span>
          </div>
        </div>
      </span>
    </>
  );
}
