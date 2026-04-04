import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  Search, 
  MoreVertical, 
  CheckCircle,
  FileIcon,
  MessageSquare,
  UserPlus,
  XCircle,
  ShieldCheck,
  Zap,
  ChevronRight
} from "lucide-react";

const API = "http://localhost:5000";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const authHeader = token ? `Bearer ${token}` : "";
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API}/api/messages/conversations`, {
        headers: { Authorization: authHeader },
      });
      if (res.ok) setConversations(await res.json());
    } catch (_) {}
    finally { setLoading(false); }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await fetch(`${API}/api/messages/${convId}`, {
        headers: { Authorization: authHeader },
      });
      if (res.ok) setMessages(await res.json());
    } catch (_) {}
  };

  const markAsRead = async (convId) => {
    try {
      await fetch(`${API}/api/messages/${convId}/read`, {
        method: "PATCH",
        headers: { Authorization: authHeader },
      });
      fetchConversations(); // Refresh counts
    } catch (_) {}
  };

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (val.length < 2) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(`${API}/api/messages/search-users?q=${val}`, {
        headers: { Authorization: authHeader },
      });
      if (res.ok) setSearchResults(await res.json());
    } catch (_) {}
    finally { setIsSearching(false); }
  };

  const startConversation = async (otherUser) => {
    if (!otherUser?._id) return alert("User ID missing from signal.");
    
    try {
      console.log("Initiating link with:", otherUser.name, otherUser._id);
      const res = await fetch(`${API}/api/messages/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ recipientId: otherUser._id, text: "Hi! I'd like to connect." }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Link established:", data._id);
        setSearchQuery("");
        setSearchResults([]);
        fetchConversations();
        setActiveConv(data);
      } else {
        alert(data.msg || "Failed to start conversation.");
      }
    } catch (_) {
      alert("Failed to connect to transmission node.");
    }
  };

  const updateConvStatus = async (convId, status) => {
    try {
      const res = await fetch(`${API}/api/messages/${convId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchConversations();
        if (activeConv?._id === convId) {
           setActiveConv(prev => ({ ...prev, status }));
        }
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv._id);
      markAsRead(activeConv._id);
      const interval = setInterval(() => fetchMessages(activeConv._id), 4000);
      return () => clearInterval(interval);
    }
  }, [activeConv?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv || sending) return;

    setSending(true);
    try {
      const res = await fetch(`${API}/api/messages/${activeConv._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ text: newMessage }),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages(activeConv._id);
      } else {
        const data = await res.json();
        alert(`Transmission Error: ${data.msg || data.error || "Unknown Failure"}`);
      }
    } catch (err) {
      alert("Critical Node Connection Failure");
    }
    finally { setSending(false); }
  };

  const getOtherParticipant = (conv) => {
    return conv.participants.find(p => p._id !== currentUser._id);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex flex-col h-full z-20">
          <div className="p-6 border-b border-gray-50 bg-white sticky top-0 z-10">
            <h3 className="text-2xl font-black text-gray-900 mb-5 tracking-tight flex items-center gap-2 italic">
               <Zap className="text-blue-600 fill-blue-600" size={20} /> Signals
            </h3>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Find people to connect..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all placeholder:text-gray-300"
              />
              
              {/* Search Results Dropdown */}
              {searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">Search Results</div>
                  {isSearching ? (
                    <div className="p-6 text-center text-xs text-gray-400 font-bold animate-pulse">Scanning Grid...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400 font-bold uppercase tracking-tighter">No User Found</div>
                  ) : searchResults.map(u => (
                    <button 
                      key={u._id} 
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        console.log("Requesting link with:", u._id);
                        startConversation(u);
                      }} 
                      className="w-full text-left p-4 hover:bg-blue-50 cursor-pointer flex items-center justify-between group transition-all border-none outline-none relative z-[110]"
                    >
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs uppercase">{u.name?.[0]}</div>
                         <div>
                            <p className="text-xs font-black text-gray-900 leading-none mb-1">{u.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{u.role}</p>
                         </div>
                       </div>
                       <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-100 transition-colors pointer-events-none">
                          <UserPlus size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                       </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 bg-gray-50/20">
            {loading ? (
              <div className="mt-20 text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-4">Calibrating...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl shadow- inner mx-auto flex items-center justify-center text-gray-100 mb-6">
                   <MessageSquare className="w-10 h-10" />
                </div>
                <h4 className="text-gray-900 font-black text-sm mb-1">Silence is Golden</h4>
                <p className="text-gray-400 text-xs font-medium leading-relaxed">Search above to initiate your first frequency.</p>
              </div>
            ) : conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isActive = activeConv?._id === conv._id;
              
              // Ensure unreadCount is a Map
              const unreadCount = conv.unreadCount && typeof conv.unreadCount.get === "function" 
                ? conv.unreadCount 
                : new Map(Object.entries(conv.unreadCount || {}));
              const unread = unreadCount.get(currentUser._id) || 0;

              return (
                <div 
                  key={conv._id}
                  onClick={() => { setActiveConv(conv); setMessages([]); }}
                  className={`p-5 cursor-pointer transition-all relative border-l-[6px] ${isActive ? "bg-blue-50/60 border-blue-600" : "hover:bg-white border-transparent"}`}
                >
                  <div className="flex gap-4 relative z-10">
                    <div className="relative shrink-0">
                      <div className={`w-14 h-14 rounded-2xl ${isActive ? "bg-blue-600 text-white" : "bg-white border border-gray-100 text-blue-600"} flex items-center justify-center font-black text-xl shadow-sm transition-all group-hover:scale-105`}>
                        {other?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      {unread > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-xl border-4 border-gray-50 animate-bounce">
                          {unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className={`text-sm font-black truncate tracking-tight ${isActive ? "text-blue-700" : "text-gray-900"}`}>{other?.name}</h4>
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter shrink-0">{conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-2 truncate">Project Ref: <span className="text-blue-500">{conv.job?.title || "Direct Connection"}</span></p>
                      <p className={`text-xs truncate transition-colors ${unread > 0 ? "text-gray-900 font-black" : "text-gray-500 font-medium"}`}>
                        {conv.lastMessage?.text || "New wave connection..."}
                      </p>
                    </div>
                  </div>
                  {isActive && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 opacity-20"><Zap size={48} /></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-white relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/10 rounded-full filter blur-[120px] -z-10 pointer-events-none"></div>
            
            {/* Chat Header */}
            <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-30">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-xl shadow-blue-500/20">
                   <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-black text-blue-600 text-xl italic uppercase">
                    {getOtherParticipant(activeConv)?.name?.[0]}
                   </div>
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1.5 flex items-center gap-2">
                    {getOtherParticipant(activeConv)?.name}
                    <ShieldCheck size={16} className="text-blue-500" />
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    <span className="text-green-600/80">Active Frequency</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shadow-inner bg-gray-50 p-2 rounded-2xl">
                <button title="Audio Call" className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white hover:rounded-xl transition-all cursor-not-allowed group relative">
                  <Phone size={18} />
                </button>
                <div className="w-[1px] h-4 bg-gray-200"></div>
                <button title="Video Call" className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white hover:rounded-xl transition-all cursor-not-allowed group relative">
                  <Video size={18} />
                </button>
                <div className="w-[1px] h-4 bg-gray-200"></div>
                <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white hover:rounded-xl transition-all">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Request Handling UI */}
            {activeConv.status === "pending" && activeConv.lastMessage?.sender?._id !== currentUser._id && (
              <div className="mx-8 mt-6 p-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 filter blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                 <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mx-auto mb-6 flex items-center justify-center text-white border border-white/20">
                       <Zap size={32} className="fill-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight italic">New Transmission Incoming</h3>
                    <p className="text-blue-100/80 text-sm font-medium mb-8 max-w-sm mx-auto">Connecting with a new talent partner requires synchronization. Review the message below then synchronize to start collaborating.</p>
                    <div className="flex gap-4 justify-center">
                       <button onClick={() => updateConvStatus(activeConv._id, "accepted")} className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2">
                          <CheckCircle size={14} /> Synchronize Link
                       </button>
                       <button onClick={() => updateConvStatus(activeConv._id, "ignored")} className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2">
                          <XCircle size={14} /> Ignore Signal
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {/* Messages container */}
            <div className={`flex-1 p-8 space-y-8 overflow-y-auto scroll-smooth bg-gray-50/10 ${activeConv.status === "pending" && "grayscale-30 filter blur-[2px] pointer-events-none opacity-40"} transition-all duration-700`}>
              {messages.length === 0 && !loading && (
                <div className="text-center py-20">
                   <div className="p-4 bg-blue-50 inline-block rounded-3xl text-blue-400 mb-4 animate-bounce"><Zap size={24} /></div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Connection established. Awaiting signals...</p>
                </div>
              )}
              {messages.map((msg, i) => {
                const isMine = msg.sender?._id === currentUser._id;
                return (
                  <div key={msg._id || i} className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[85%] ${isMine ? "ml-auto" : "mr-auto"}`}>
                    <div className={`px-6 py-4 rounded-[1.8rem] text-sm font-bold leading-relaxed shadow-sm  relative group transition-all hover:shadow-xl ${isMine ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-blue-500/5"}`}>
                      {msg.text}
                      {msg.file && (
                        <a 
                          href={`${API}${msg.file}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`mt-4 flex items-center gap-3 p-3 rounded-2xl border transition-all hover:scale-[1.02] ${isMine ? "bg-white/10 border-white/20 text-white" : "bg-gray-50 border-gray-100 text-blue-600"}`}
                        >
                          <div className={`p-2 rounded-xl ${isMine ? "bg-white/10" : "bg-white"}`}><FileIcon size={14} /></div>
                          <span className="text-[10px] truncate font-black uppercase tracking-widest">Download Asset</span>
                          <ChevronRight size={14} className="ml-auto opacity-50" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2.5 px-2">
                      <span className="text-[9px] text-gray-400 font-black uppercase italic tracking-tighter bg-white px-2 py-0.5 rounded-lg border border-gray-50">
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      {isMine && (
                        <div className="flex items-center">
                           <CheckCircle size={10} className={`${msg.isRead ? "text-blue-600" : "text-gray-300"} transition-colors`} />
                           {msg.isRead && <CheckCircle size={10} className="text-blue-600 -ml-1.5" />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSendMessage} className={`p-8 bg-white border-t border-gray-100 transition-all ${activeConv.status === "pending" && "opacity-20 pointer-events-none"}`}>
              <div className="relative flex items-center gap-4 bg-gray-50 p-2 rounded-[2.5rem] border border-gray-100 shadow-inner group-focus-within:ring-4 ring-blue-500/5 transition-all">
                <label className="p-4 text-gray-400 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-3xl transition-all cursor-pointer group shadow-sm hover:scale-105 active:scale-95">
                  <Paperclip size={20} />
                  <input type="file" className="hidden" />
                </label>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-700 placeholder:text-gray-300 md:pr-10"
                  placeholder="Initiate communication protocol..."
                />
                <button 
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center hover:scale-105 overflow-hidden group/btn relative"
                >
                  <Send size={20} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.2em] text-center mt-5 italic opacity-50">Secure E2E Node Connection Beta (V2.0)</p>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 bg-white relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/5 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>
             <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 rounded-full filter blur-xl opacity-20 animate-ping"></div>
                <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center text-blue-200 mb-8 relative z-10 border border-white shadow-inner">
                   <Zap size={56} className="fill-blue-50 opacity-20" />
                   <MessageSquare className="w-16 h-16 absolute -rotate-12 transition-transform group-hover:rotate-0 duration-500" />
                </div>
             </div>
             <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter italic">Command Selection Required</h3>
             <p className="text-gray-400 text-sm max-w-xs text-center font-bold font-mono tracking-tighter bg-gray-50 px-4 py-2 rounded-xl">SELECT A FREQUENCY FROM THE SIDEBAR TO SYNC SIGNALS</p>
          </div>
        )}
      </div>
    </div>
  );
}
