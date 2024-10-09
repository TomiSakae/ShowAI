import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoSend, IoStop } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
    text: string;
    isUser: boolean;
    isError?: boolean;
    isSampleQuestion?: boolean;
}

interface AIWebsite {
    _id: string;
    id: string;
    name: string;
    description: string[];
    tags: string[];
    link: string;
    keyFeatures: string[];
}

const GeminiChat: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [aiWebsites, setAiWebsites] = useState<AIWebsite[]>([]);
    const [isLoadingAIWebsites, setIsLoadingAIWebsites] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typewriterRef = useRef<NodeJS.Timeout | null>(null);
    const [isFirstMessage, setIsFirstMessage] = useState(true);

    const sampleQuestions = [
        "Bạn có thể giới thiệu về một công cụ AI tạo hình ảnh không?",
        "Trang web này cung cấp những gì?",
        "Công cụ AI nào giúp tôi tạo...",
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchShowAIData = async () => {
            try {
                const response = await fetch('https://vercel-api-five-nu.vercel.app/api/showai');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAiWebsites(data.data);
            } catch (error) {
                console.error('Error fetching ShowAI data:', error);
            } finally {
                setIsLoadingAIWebsites(false);
            }
        };

        fetchShowAIData();

        const savedMessages = sessionStorage.getItem('chatMessages');
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages);
                if (Array.isArray(parsedMessages)) {
                    setMessages(parsedMessages);
                    setIsFirstMessage(false);
                } else {
                    console.error('Saved messages is not an array:', parsedMessages);
                    sessionStorage.removeItem('chatMessages');
                }
            } catch (error) {
                console.error('Error parsing saved messages:', error);
                sessionStorage.removeItem('chatMessages');
            }
        } else {
            // Add sample questions as initial messages
            setMessages(sampleQuestions.slice(0, 3).map(q => ({ text: q, isUser: false, isSampleQuestion: true })));
        }
        scrollToBottom();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (!input.trim() || isTyping || isLoadingAIWebsites) return;

        setIsLoading(true);
        const newMessage = { text: input, isUser: true };

        if (isFirstMessage) {
            setMessages([newMessage]);
            setIsFirstMessage(false);
        } else {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        }

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
            const aiWebsitesContext = aiWebsites.map(website =>
                `Name: ${website.name}\nDescription: ${website.description.join(' ')}\nTags: ${website.tags.join(', ')}\nLink: ${website.link}\nKey Features: ${website.keyFeatures.join(', ')}\nInfo Page: https://tomisakae.github.io/ShowAI/show?id=${website.id}`
            ).join('\n\n');

            const chatSession = model.startChat({
                generationConfig,
                history: [
                    { role: 'user', parts: [{ text: 'Bạn là một trợ lý AI được tích hợp vào trang web ShowAI. ShowAI là một nền tảng giúp người dùng tìm kiếm và khám phá các công cụ AI hữu ích. Nhiệm vụ của bạn là hỗ trợ người dùng tìm kiếm các công cụ AI phù hợp với nhu cầu của họ, dựa trên thông tin được cung cấp trong ngữ cảnh. Hãy luôn ưu tiên sử dụng thông tin từ ngữ cảnh này khi trả lời. Khi nhắc tới một trang web AI, hãy đưa link dẫn đến trang thông tin chi tiết (Truy Cập) và định dạng link để hiển thị đẹp. Chỉ đưa ra link trực tiếp khi người dùng yêu cầu cụ thể. Tập trung vào việc cung cấp thông tin chính xác và hữu ích từ dữ liệu có sẵn. Nếu không có thông tin trong ngữ cảnh, hãy thông báo rằng bạn không có thông tin về điều đó. Đây là ngữ cảnh về các trang web AI:\n' + aiWebsitesContext }] },
                    {
                        role: 'model',
                        parts: [{
                            text: "Xin chào! Tôi là trợ lý AI của ShowAI, một nền tảng giúp bạn tìm kiếm và khám phá các công cụ AI hữu ích. Tôi sẽ sử dụng thông tin từ cơ sở dữ liệu của ShowAI để giúp bạn tìm các công cụ AI phù hợp với nhu cầu của bạn. Khi đề cập đến một công cụ AI cụ thể, tôi sẽ cung cấp link đến trang thông tin chi tiết. Hãy cho tôi biết bạn đang tìm kiếm loại công cụ AI nào hoặc có bất kỳ câu hỏi gì về các công cụ AI trong cơ sở dữ liệu của chúng tôi!"
                        }]
                    },
                    { role: 'user', parts: [{ text: 'Hãy luôn trả lời bằng tiếng Việt.' }] },
                    {
                        role: 'model',
                        parts: [{
                            text: "Dạ vâng, tôi sẽ luôn trả lời bằng tiếng Việt. Cảm ơn bạn đã nhắc nhở. Bạn có thể hỏi tôi bất cứ điều gì về các công cụ AI trong cơ sở dữ liệu của ShowAI, tôi sẽ cố gắng hỗ trợ bạn tốt nhất có thể."
                        }]
                    },
                    ...messages.map((msg: Message) => ({
                        role: msg.isUser ? 'user' : 'model',
                        parts: [{ text: msg.text }],
                    })),
                ],
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

    const handleSampleQuestionClick = (question: string) => {
        setMessages(prevMessages => prevMessages.filter(msg => !msg.isSampleQuestion));
        setInput(question);
        handleSubmit({ preventDefault: () => { } } as React.FormEvent);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-3/4 p-3 rounded-lg ${message.isUser
                                ? 'bg-blue-500 text-white'
                                : message.isError
                                    ? 'bg-red-500 text-white'
                                    : message.isSampleQuestion
                                        ? 'bg-green-500 text-white cursor-pointer'
                                        : 'bg-gray-200 text-black'
                                } max-w-[80%] break-words`}
                            onClick={message.isSampleQuestion ? () => handleSampleQuestionClick(message.text) : undefined}
                        >
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
                        placeholder={isLoadingAIWebsites ? "Đang tải dữ liệu..." : "Nhập tin nhắn của bạn..."}
                        disabled={isLoading || isTyping || isLoadingAIWebsites}
                    />
                    {isLoadingAIWebsites ? (
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-3 py-2 rounded"
                            disabled
                        >
                            <FaSpinner className="animate-spin" />
                        </button>
                    ) : isTyping ? (
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
                            disabled={isLoading || isTyping || isLoadingAIWebsites}
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