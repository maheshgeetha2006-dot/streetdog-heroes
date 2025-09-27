import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Paperclip, Search, Circle, MessageCircle, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import io from 'socket.io-client';

interface User {
  id: string;
  name: string;
  role: "NGO" | "Citizen" | "Vet";
  online: boolean;
  lastSeen?: Date;
  avatar: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file";
  fileUrl?: string;
  fileName?: string;
  isAI?: boolean;
}

interface Chat {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
}

// Available users to chat with
const availableUsers: User[] = [
  {
    id: "1",
    name: "Paws & Hearts NGO",
    role: "NGO",
    online: true,
    avatar: "PH"
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    role: "Vet",
    online: true,
    avatar: "PS"
  },
  {
    id: "3",
    name: "Mumbai Animal Rescue",
    role: "NGO",
    online: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    avatar: "MR"
  },
  {
    id: "4",
    name: "Volunteer Rahul",
    role: "Citizen",
    online: true,
    avatar: "VR"
  }
];

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const currentUserId = user?.id || "current-user";

  // Mock chats data
  const chats: Chat[] = [
    {
      id: "1",
      participants: [availableUsers[0]], // NGO
      lastMessage: {
        id: "1",
        senderId: "1",
        receiverId: currentUserId,
        content: "Thank you for reporting the injured dog at Bandra. Our team is on the way!",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        type: "text"
      },
      unreadCount: 2
    },
    {
      id: "2", 
      participants: [availableUsers[1]], // Vet
      lastMessage: {
        id: "2",
        senderId: "2",
        receiverId: currentUserId,
        content: "I've examined the photos. It looks like a minor fracture. We should prioritize this case.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: "text"
      },
      unreadCount: 0
    },
    {
      id: "3",
      participants: [availableUsers[2]], // Another NGO
      lastMessage: {
        id: "3",
        senderId: "3",
        receiverId: currentUserId,
        content: "We have space available at our shelter for the rescued puppies.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        type: "text"
      },
      unreadCount: 1
    }
  ];

  const filteredChats = chats.filter(chat => 
    chat.participants[0].name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Socket.IO connection
  useEffect(() => {
    if (!token) return;

    const socketInstance = io('http://localhost:5000');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    socketInstance.on('newMessage', (message: any) => {
      // Convert timestamp string to Date object
      const messageWithDate = {
        ...message,
        timestamp: new Date(message.timestamp)
      };
      setMessages(prev => [...prev, messageWithDate]);
      
      // Show toast for AI responses
      if (message.isAI) {
        toast({
          title: "AI Assistant Reply",
          description: "New response received",
          duration: 3000,
        });
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [token, toast]);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChat && token) {
      const userIdNum = parseInt(currentUserId) || 999;
      const chatIdNum = parseInt(selectedChat);
      const chatId = `chat-${Math.min(userIdNum, chatIdNum)}-${Math.max(userIdNum, chatIdNum)}`;
      
      fetch(`http://localhost:5000/api/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        // Convert timestamp strings to Date objects
        const messagesWithDates = data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
        
        // Join chat room
        if (socket) {
          socket.emit('joinChat', chatId);
        }
      })
      .catch(err => {
        console.error('Failed to load messages:', err);
        // Initialize with empty messages if fetch fails
        setMessages([]);
        if (socket) {
          const userIdNum = parseInt(currentUserId) || 999;
          const chatIdNum = parseInt(selectedChat);
          const chatId = `chat-${Math.min(userIdNum, chatIdNum)}-${Math.max(userIdNum, chatIdNum)}`;
          socket.emit('joinChat', chatId);
        }
      });
    }
  }, [selectedChat, token, socket, currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !token) return;

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: selectedChat,
          content: newMessage,
          type: 'text'
        })
      });

      if (response.ok) {
        setNewMessage("");
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "NGO": return "bg-primary text-primary-foreground";
      case "Vet": return "bg-green-600 text-white";
      case "Citizen": return "bg-accent text-accent-foreground";
    }
  };

  const selectedChatData = selectedChat ? chats.find(chat => chat.id === selectedChat) : null;
  const chatMessages = selectedChat ? messages.filter(msg => 
    (msg.senderId === currentUserId && msg.receiverId === selectedChat) ||
    (msg.senderId === selectedChat && msg.receiverId === currentUserId)
  ) : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Please Login</h3>
          <p className="text-muted-foreground">
            You need to be logged in to access the chat feature
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 bg-gradient-card border-b">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Messages</h1>
              <p className="text-muted-foreground">
                Connect with NGOs, veterinarians, and volunteers for coordinated animal care.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {availableUsers.filter(u => u.online).length} Online
              </Badge>
              <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-2">
                <Circle className={cn("h-2 w-2", isConnected ? "fill-green-500" : "fill-red-500")} />
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
          {/* Chat List Sidebar */}
          <div className="lg:col-span-1 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-4 pt-0">
                    {filteredChats.map((chat) => {
                      const participant = chat.participants[0];
                      const isSelected = selectedChat === chat.id;
                      
                      return (
                        <div
                          key={chat.id}
                          onClick={() => setSelectedChat(chat.id)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                            isSelected 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-secondary"
                          )}
                        >
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className={cn(
                                isSelected ? "bg-primary-foreground text-primary" : getRoleColor(participant.role)
                              )}>
                                {participant.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <Circle 
                              className={cn(
                                "absolute -bottom-0.5 -right-0.5 h-3 w-3 border-2 border-background rounded-full",
                                participant.online ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"
                              )} 
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={cn(
                                "font-medium text-sm truncate",
                                isSelected ? "text-primary-foreground" : "text-foreground"
                              )}>
                                {participant.name}
                              </p>
                              {chat.unreadCount > 0 && (
                                <Badge 
                                  variant="destructive" 
                                  className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                >
                                  {chat.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className={cn(
                                "text-xs truncate",
                                isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                              )}>
                                {chat.lastMessage.content}
                              </p>
                              <p className={cn(
                                "text-xs",
                                isSelected ? "text-primary-foreground/60" : "text-muted-foreground"
                              )}>
                                {formatTime(chat.lastMessage.timestamp)}
                              </p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs mt-1",
                                isSelected ? "border-primary-foreground/20 text-primary-foreground/80" : ""
                              )}
                            >
                              {participant.role}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            {selectedChatData ? (
              <Card className="flex-1 flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={getRoleColor(selectedChatData.participants[0].role)}>
                          {selectedChatData.participants[0].avatar}
                        </AvatarFallback>
                      </Avatar>
                      <Circle 
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-3 w-3 border-2 border-background rounded-full",
                          selectedChatData.participants[0].online ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"
                        )} 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedChatData.participants[0].name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedChatData.participants[0].online 
                          ? "Online" 
                          : `Last seen ${formatLastSeen(selectedChatData.participants[0].lastSeen!)}`
                        }
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => {
                        const isOwnMessage = message.senderId === currentUserId;
                        return (
                          <div key={message.id} className={cn(
                            "flex",
                            isOwnMessage ? "justify-end" : "justify-start"
                          )}>
                            <div className={cn(
                              "max-w-[70%] px-4 py-2 rounded-lg",
                              isOwnMessage 
                                ? "bg-primary text-primary-foreground" 
                                : message.isAI 
                                  ? "bg-accent text-accent-foreground border border-accent-foreground/20"
                                  : "bg-secondary text-secondary-foreground"
                            )}>
                              <div className="flex items-start gap-2">
                                {message.isAI && (
                                  <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm">{message.content}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className={cn(
                                      "text-xs",
                                      isOwnMessage 
                                        ? "text-primary-foreground/70" 
                                        : "text-muted-foreground"
                                    )}>
                                      {formatTime(message.timestamp)}
                                    </p>
                                    {message.isAI && (
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        AI
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">Select a conversation</h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}