import { useState } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
};

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #374151",
          backgroundColor: "#111827",
          color: "white",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}
