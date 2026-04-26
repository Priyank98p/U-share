import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "@/api/axiosInstance";
import { io } from "socket.io-client";
import { Send, UserCircle2, MessageCircle, ArrowLeft, Check, CheckCheck } from "lucide-react";


export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const recipientId = searchParams.get("user");
  const { user } = useSelector(state => state.auth);

  // Scroll page to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const socketRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const roomRef = useRef("");
  const bottomRef = useRef(null);

  // Derive recipientInfo from conversations list (no setState needed)
  const recipientInfo = useMemo(() => {
    const conv = conversations.find(c => c._id?.toString() === recipientId);
    return conv?.user || null;
  }, [conversations, recipientId]);

  // Fetch conversation list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axiosInstance.get("/chat/conversations");
        setConversations(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };
    if (user?._id) fetchConversations();
  }, [user?._id]);

  // Connect socket and fetch chat when recipientId changes
  useEffect(() => {
    if (!user?._id || !recipientId) return;

    // Prevent chatting with yourself
    if (recipientId === user._id) return;

    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
    });
    socketRef.current = newSocket;

    // Fetch message history
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/chat/${recipientId}`);
        const data = res.data?.data?.messages || [];
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };
    fetchMessages();


    // Join room
    const roomId = [user._id, recipientId].sort().join("-");
    roomRef.current = roomId;
    
    newSocket.emit("join_room", roomId);

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [user?._id, recipientId, conversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMsg.trim() !== "" && socketRef.current) {
      const messageData = {
        room: roomRef.current,
        senderId: user._id,
        receiverId: recipientId,
        message: inputMsg,
      };
      socketRef.current.emit("send_message", messageData);
      setMessages((prev) => [...prev, messageData]);
      setInputMsg("");
    }
  };

  const selectConversation = (userId) => {
    setSearchParams({ user: userId });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 w-full min-h-[calc(100vh-16rem)] flex flex-col animate-in fade-in duration-500">
      <div className="flex gap-6 h-[75vh]">
        
        {/* Conversation Sidebar */}
        <div className={`${recipientId ? 'hidden md:flex' : 'flex'} w-full md:w-80 shrink-0 flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden`}>
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-heading text-lg font-bold text-slate-900 tracking-tight">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <MessageCircle className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-sm text-slate-400 font-bold">No conversations yet</p>
                <p className="text-xs text-slate-400 mt-1">Start a chat from an item's detail page</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => selectConversation(conv._id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 ${
                    recipientId === conv._id?.toString() ? 'bg-indigo-50' : ''
                  }`}
                >
                  <img
                    src={conv.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${conv.user?.fullname}`}
                    alt={conv.user?.fullname}
                    className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-sm text-slate-900 truncate">{conv.user?.fullname || "User"}</p>
                      <span className="text-[10px] text-slate-400 font-bold shrink-0 ml-2">
                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        {recipientId ? (
          <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-600/5 border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 text-white flex items-center gap-3 shadow-lg z-10">
              <button
                onClick={() => setSearchParams({})}
                className="md:hidden w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center overflow-hidden">
                {recipientInfo?.avatar ? (
                  <img src={recipientInfo.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle2 className="w-6 h-6 text-indigo-100" />
                )}
              </div>
              <div>
                <h2 className="font-bold font-heading tracking-tight">{recipientInfo?.fullname || "Chat"}</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-indigo-200 font-medium">Active now</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-50 to-white space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-12 h-12 text-slate-200 mb-3" />
                  <p className="text-sm font-bold text-slate-400">No messages yet. Say hello!</p>
                </div>
              )}
              {messages.map((msg, idx) => {
                const sendId = msg.senderId?._id || msg.senderId;
                const isMe = sendId === user?._id;
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[70%] px-5 py-3 rounded-2xl transition-all ${isMe ? 'bg-indigo-600 text-white rounded-br-sm shadow-lg shadow-indigo-600/20' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'}`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                    </div>
                    {isMe && (
                      <div className="flex items-center gap-1 mt-1 pr-1">
                        {msg.seen ? (
                          <CheckCheck className="w-3.5 h-3.5 text-indigo-500" title="Seen" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-slate-400" title="Sent" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-3">
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
              />
              <button 
                type="submit" 
                disabled={!inputMsg.trim()}
                className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <Send className="w-5 h-5 -ml-0.5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-white rounded-3xl border border-slate-200">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Select a conversation</h2>
              <p className="text-slate-500 font-medium">Pick a chat from the sidebar or start one from an item page.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
