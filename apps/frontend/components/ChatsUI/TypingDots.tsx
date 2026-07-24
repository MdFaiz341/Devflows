"use client"


export default function TypingDots() {
  return (
    <div className="flex gap-1 items-center p-2 bg-gray-700 rounded-2xl">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>

      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></span>

      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></span>
    </div>
  );
}