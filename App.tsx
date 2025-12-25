
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatInput } from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import HistorySidebar from './components/HistorySidebar';
import { MenuIcon, ModelIcon } from './components/icons';
import { Message, Sender, MessagePart, ChatHistoryItem } from './types';
import { sendMessageToGemini } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Placeholder for history management
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setError(null);
    setSidebarOpen(false);
  };
  
  const handleSelectChat = (id: string) => {
    // In a real app, you would load the conversation from storage
    console.log("Selected chat:", id);
    setSidebarOpen(false);
  };

  const handleSendMessage = useCallback(async (messageText: string, file?: File) => {
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    const userMessageParts: MessagePart[] = [];
    if (messageText) {
      userMessageParts.push({ type: 'text', text: messageText });
    }
    if (file) {
      userMessageParts.push({ type: 'image', url: URL.createObjectURL(file) });
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      parts: userMessageParts,
    };

    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    
    try {
      // The history sent to the API should not include the latest user message
      const historyForApi = messages; 
      const modelResponseText = await sendMessageToGemini(historyForApi, messageText, file);

      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.MODEL,
        parts: [{ type: 'text', text: modelResponseText }],
      };
      
      setMessages(prev => [...prev, newModelMessage]);

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Error: ${errorMessage}`);
      const errorModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.MODEL,
        parts: [{ type: 'text', text: `Sorry, something went wrong: ${errorMessage}` }],
      };
      setMessages(prev => [...prev, errorModelMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);


  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <HistorySidebar 
        history={chatHistory} 
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
      />
      <div className="flex flex-col flex-1 relative">
        {/* Mobile menu button */}
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="lg:hidden absolute top-4 left-4 z-30 p-2 bg-gray-700 rounded-full"
          aria-label="Toggle history"
        >
          <MenuIcon className="w-6 h-6"/>
        </button>

        {/* Main chat area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                    <ModelIcon className="w-16 h-16 mb-4"/>
                    <h1 className="text-2xl font-semibold">How can I help you today?</h1>
                </div>
            ) : (
                messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                ))
            )}
             {isLoading && (
                <div className="flex items-start gap-4 flex-row">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
                        <ModelIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col p-3 rounded-xl max-w-lg md:max-w-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                        <div className="prose prose-invert prose-sm max-w-none">...</div>
                    </div>
                </div>
             )}
            <div ref={messagesEndRef} />
          </div>
        </main>
        
        {error && (
            <div className="px-4 pb-2 max-w-4xl mx-auto w-full">
                <p className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>
            </div>
        )}

        {/* Chat input */}
        <footer className="w-full">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </footer>
      </div>
    </div>
  );
};

export default App;
