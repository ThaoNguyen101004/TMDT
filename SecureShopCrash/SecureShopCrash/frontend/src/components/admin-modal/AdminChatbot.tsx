import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { api } from '../../utils/axiosConfig';
import { toast } from 'react-toastify';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const AdminChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Chào Admin! Tôi có thể giúp bạn kiểm tra trạng thái đơn hàng, xác nhận đơn hàng, tìm kiếm thông tin hoặc khóa tài khoản người dùng vi phạm. Bạn cần hỗ trợ gì?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Note: Update to use actual endpoint. Need to ensure API allows this.
            const { data } = await api.post('/admin/chat/ask', { message: userMsg.content });
            
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer || 'Xin lỗi, tôi không thể xử lý yêu cầu.'
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            console.error('Chat error:', error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: error.response?.data?.error || error.response?.data?.message || 'Đã xảy ra lỗi khi kết nối tới hệ thống AI.'
            };
            setMessages(prev => [...prev, errorMsg]);
            toast.error('Lỗi khi gọi AI');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-pink-600 text-white p-4 rounded-full shadow-xl hover:bg-pink-700 transition-all hover:scale-110 z-50 flex items-center justify-center animate-bounce-slow group"
                title="Admin AI Assistant"
            >
                <Bot size={28} />
                <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Trợ lý AI Admin
                </span>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-white shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col transition-all duration-300 border border-pink-100 ${isExpanded ? 'w-[800px] h-[80vh]' : 'w-[380px] h-[550px]'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-600 to-pink-500 text-white p-4 flex justify-between items-center shrink-0 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">AI Assistant</h3>
                        <p className="text-xs text-pink-100 opacity-90 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Đang hoạt động (Function Calling)
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)} 
                        className="text-white hover:text-pink-200 transition p-1 hover:bg-white/10 rounded"
                    >
                        {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="text-white hover:text-pink-200 transition p-1 hover:bg-white/10 rounded"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                                msg.role === 'user'
                                    ? 'bg-pink-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center space-x-2">
                            <Loader2 className="animate-spin text-pink-600" size={16} />
                            <span className="text-sm text-gray-500">AI đang xử lý...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập yêu cầu quản trị (vd: Xác nhận đơn #123)..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm transition-all"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="bg-pink-600 text-white rounded-xl p-3 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md flex items-center justify-center aspect-square"
                    >
                        <Send size={20} className={input.trim() ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''} />
                    </button>
                </div>
                <div className="mt-2 text-xs text-center text-gray-400">
                    Sử dụng Github Models API để gọi hàm tự động.
                </div>
            </div>
        </div>
    );
};

export default AdminChatbot;
