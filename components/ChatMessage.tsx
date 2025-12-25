type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      style={{
        textAlign: role === "user" ? "right" : "left",
        margin: "8px 0",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "10px 14px",
          borderRadius: "12px",
          backgroundColor: role === "user" ? "#2563eb" : "#1f2937",
          color: "#fff",
          maxWidth: "70%",
        }}
      >
        {content}
      </div>
    </div>
  );
}
