import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Bot, ChevronRight, FileText, Plus, Send, Trash2, Upload, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Chat, Message } from "@/types/chat";
import { addMessage, createChat, deleteChat, generateAIResponse, getActiveChat, getChats, setActiveChat } from "@/utils/chat";

const AIAssistant = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chats from localStorage on mount
  useEffect(() => {
    const storedChats = getChats();
    setChats(storedChats);
    
    const storedActiveChat = getActiveChat();
    if (storedActiveChat) {
      setActiveChat(storedActiveChat);
    } else if (storedChats.length > 0) {
      setActiveChat(storedChats[0]);
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // Handle new chat creation
  const handleNewChat = () => {
    const newChat = createChat();
    setChats([...chats, newChat]);
    setActiveChat(newChat);
    setMessage("");
  };

  // Handle chat selection
  const handleSelectChat = (chatId: string) => {
    const selectedChat = chats.find(chat => chat.id === chatId);
    if (selectedChat) {
      setActiveChat(selectedChat);
      // Also update in localStorage
      localStorage.setItem('medzen-active-chat-id', chatId);
    }
  };

  // Handle chat deletion
  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (deleteChat(chatId)) {
      const updatedChats = getChats();
      setChats(updatedChats);
      
      const active = getActiveChat();
      setActiveChat(active);
    }
  };

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isProcessing) return;
    
    let currentActiveChat = activeChat;
    
    // If no active chat, create a new one
    if (!currentActiveChat) {
      const newChat = createChat();
      setChats([...chats, newChat]);
      setActiveChat(newChat);
      currentActiveChat = newChat;
    }
    
    // Add user message
    const updatedChat = addMessage(currentActiveChat.id, message, "user");
    if (updatedChat) {
      setActiveChat(updatedChat);
      
      // Update chats list
      const updatedChats = getChats();
      setChats(updatedChats);
    }
    
    // Clear input
    setMessage("");
    
    // Generate AI response
    setIsProcessing(true);
    try {
      const aiResponse = await generateAIResponse(updatedChat?.messages || []);
      
      // Add AI response
      const finalChat = addMessage(currentActiveChat.id, aiResponse, "assistant");
      if (finalChat) {
        setActiveChat(finalChat);
        
        // Update chats list
        const finalChats = getChats();
        setChats(finalChats);
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle document upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real implementation, this would handle file uploads
    // For now, we'll simulate document analysis
    
    setIsProcessing(true);
    
    // Create chat if needed
    let currentActiveChat = activeChat;
    if (!currentActiveChat) {
      const newChat = createChat(`Document: ${file.name}`);
      setChats([...chats, newChat]);
      setActiveChat(newChat);
      currentActiveChat = newChat;
    }
    
    // Add user message about document
    const userMessage = `I've uploaded a document: ${file.name}. Can you analyze it for me?`;
    const updatedChat = addMessage(currentActiveChat.id, userMessage, "user");
    if (updatedChat) {
      setActiveChat(updatedChat);
      setChats(getChats());
    }
    
    // Simulate document processing
    setTimeout(() => {
      const aiResponse = "I've analyzed your document. This is a simulated response as document processing is not fully implemented in this demo. In a complete implementation, I would extract text from your document and provide insights based on its content.";
      
      const finalChat = addMessage(currentActiveChat.id, aiResponse, "assistant");
      if (finalChat) {
        setActiveChat(finalChat);
        setChats(getChats());
      }
      
      setIsProcessing(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 2000);
  };

  // Suggested prompts
  const suggestedPrompts = [
    "What does a healthy diet look like?",
    "Can you explain what cholesterol is?",
    "What are common symptoms of stress?",
    "How much exercise should I get weekly?",
    "What are the side effects of ibuprofen?",
    "Can you explain what blood pressure readings mean?"
  ];

  // Handle using a suggested prompt
  const handleUseSuggestedPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  // Export conversation
  const handleExportChat = () => {
    if (!activeChat) return;
    
    const chatContent = activeChat.messages
      .map(msg => `${msg.role === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medzen-chat-${activeChat.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Conversation Exported",
      description: "Your conversation has been exported as a text file.",
    });
  };

  // Format message content (simple markdown-like parsing)
  const formatMessageContent = (content: string) => {
    // Split by newlines and render paragraphs
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return <br key={index} />;
      
      // Simple bullet list detection
      if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
        return <li key={index}>{paragraph.slice(2)}</li>;
      }
      
      return <p key={index}>{paragraph}</p>;
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col h-full border rounded-lg overflow-hidden bg-card">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold">Conversations</h2>
            <Button variant="ghost" size="icon" onClick={handleNewChat} title="New Chat">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {chats.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">No conversations yet</p>
              ) : (
                chats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={cn(
                      "flex items-center justify-between p-3 text-sm rounded-md cursor-pointer hover:bg-accent/30 transition-colors duration-200",
                      activeChat?.id === chat.id ? "bg-accent/40" : ""
                    )}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Bot className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-start gap-2"
              onClick={handleUploadClick}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-start gap-2"
              onClick={handleExportChat}
              disabled={!activeChat || activeChat.messages.length === 0}
            >
              <Clipboard className="h-4 w-4" />
              <span>Export Conversation</span>
            </Button>
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col h-full border rounded-lg overflow-hidden bg-card">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 border-b flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={handleNewChat}>
              <Plus className="h-4 w-4" />
            </Button>
            <h2 className="font-semibold">AI Health Assistant</h2>
            <Button variant="ghost" size="icon" onClick={handleExportChat} disabled={!activeChat || activeChat.messages.length === 0}>
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {!activeChat || activeChat.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-xl font-semibold">MedZen AI Health Assistant</h3>
                  <p className="text-muted-foreground">
                    I can help answer your health questions, explain medical terms, and provide general health information.
                  </p>
                </div>
                
                <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-2 pt-6">
                  {suggestedPrompts.slice(0, 4).map((prompt, index) => (
                    <Button 
                      key={index} 
                      variant="outline"
                      className="justify-start text-left h-auto py-3"
                      onClick={() => handleUseSuggestedPrompt(prompt)}
                    >
                      <span className="truncate">{prompt}</span>
                    </Button>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleUploadClick}
                >
                  <FileText className="h-4 w-4" />
                  <span>Upload a Medical Document</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-6 pb-4">
                {activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-start gap-3 max-w-3xl",
                      msg.role === "user" ? "ml-auto justify-end" : "mr-auto"
                    )}
                  >
                    {msg.role !== "user" && (
                      <div className="flex-shrink-0 rounded-full w-8 h-8 bg-accent/20 text-accent flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm space-y-2",
                        msg.role === "user"
                          ? "bg-primary/10 text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {formatMessageContent(msg.content)}
                    </div>
                    {msg.role === "user" && (
                      <div className="flex-shrink-0 rounded-full w-8 h-8 bg-primary/20 text-primary flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-current opacity-80" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
                
                {isProcessing && (
                  <div className="flex items-start gap-3 max-w-3xl mr-auto">
                    <div className="flex-shrink-0 rounded-full w-8 h-8 bg-accent/20 text-accent flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex space-x-2 p-3 bg-muted rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-150" />
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-300" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          
          {/* Input Area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="pr-20 resize-none min-h-[80px] max-h-[300px]"
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={handleUploadClick}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button 
                  type="submit" 
                  className="h-8 w-8 rounded-full p-0"
                  disabled={!message.trim() || isProcessing}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf,image/jpeg,image/png,image/jpg"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-muted-foreground mt-2">
              MedZen AI provides general information, not medical advice. Always consult healthcare professionals for medical concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
