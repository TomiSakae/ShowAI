import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoSend, IoStop } from "react-icons/io5";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
    text: string;
    isUser: boolean;
    isError?: boolean;
}

const GeminiChat: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typewriterRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const savedMessages = sessionStorage.getItem('chatMessages');
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages);
                if (Array.isArray(parsedMessages)) {
                    setMessages(parsedMessages);
                } else {
                    console.error('Saved messages is not an array:', parsedMessages);
                    sessionStorage.removeItem('chatMessages');
                }
            } catch (error) {
                console.error('Error parsing saved messages:', error);
                sessionStorage.removeItem('chatMessages');
            }
        }
        scrollToBottom();
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem('chatMessages', JSON.stringify(messages));
        }
        scrollToBottom();
    }, [messages]);

    const typeWriter = (text: string, index: number = 0) => {
        if (index < text.length) {
            setTypingText((prev) => prev + text.charAt(index));
            typewriterRef.current = setTimeout(() => typeWriter(text, index + 1), 20);
        } else {
            setMessages(prevMessages => [...prevMessages, { text: text, isUser: false }]);
            setTypingText('');
            setIsTyping(false);
        }
    };

    const stopTyping = () => {
        if (typewriterRef.current) {
            clearTimeout(typewriterRef.current);
        }
        setMessages(prevMessages => [...prevMessages, { text: typingText, isUser: false }]);
        setTypingText('');
        setIsTyping(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        setIsLoading(true);
        const newMessage = { text: input, isUser: true };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInput('');

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyB_eNpMTroPTupXzl_oey08M0d-luxJ3OE";
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
        };

        try {
            const chatSession = model.startChat({
                generationConfig,
                history: messages.map((msg: Message) => ({
                    role: msg.isUser ? 'user' : 'model',
                    parts: [{ text: msg.text }],
                })),
            });

            const result = await chatSession.sendMessage(input);
            const response = result.response.text();
            setIsTyping(true);
            typeWriter(response);
        } catch (error) {
            console.error('Lỗi:', error);
            setMessages(prevMessages => [...prevMessages, { text: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.', isUser: false, isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-3/4 p-3 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : message.isError ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'} max-w-[80%] break-words`}>
                            {message.isUser ? (
                                <div>{message.text}</div>
                            ) : (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({ inline, className, children, ...props }: {
                                            inline?: boolean;
                                            className?: string;
                                            children?: React.ReactNode;
                                        }) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    }}
                                >
                                    {message.text}
                                </ReactMarkdown>
                            )}
                        </div>
                    </div>
                ))}
                {typingText && (
                    <div className="flex justify-start">
                        <div className="max-w-3/4 p-3 rounded-lg bg-gray-200 text-black max-w-[80%] break-words">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ inline, className, children, ...props }: {
                                        inline?: boolean;
                                        className?: string;
                                        children?: React.ReactNode;
                                    }) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        )
                                    }
                                }}
                            >
                                {typingText}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
                {isLoading && !typingText && (
                    <div className="flex justify-start">
                        <div className="max-w-3/4 p-3 rounded-lg bg-gray-200 text-black max-w-[80%]">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-grow p-2 border rounded text-black"
                        placeholder="Nhập tin nhắn của bạn..."
                        disabled={isLoading || isTyping}
                    />
                    {isTyping ? (
                        <button
                            type="button"
                            className="bg-red-500 text-white px-3 py-2 rounded"
                            onClick={stopTyping}
                        >
                            <IoStop />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-3 py-2 rounded"
                            disabled={isLoading || isTyping}
                        >
                            <IoSend />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default GeminiChat;