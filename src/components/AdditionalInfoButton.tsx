import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import { FaRobot } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AdditionalInfoButtonProps {
    websiteData: string;
}

interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
}

const AdditionalInfoButton: React.FC<AdditionalInfoButtonProps> = ({ websiteData }) => {
    const [additionalInfo, setAdditionalInfo] = useState<ChatMessage[]>([]);
    const [responseHistory, setResponseHistory] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [typingIndex, setTypingIndex] = useState(-1);
    const [displayedText, setDisplayedText] = useState('');
    const typingSpeed = 10; // milliseconds per character

    const generateAdditionalInfo = async () => {
        setIsLoading(true);
        setDisplayedText(''); // Clear displayed text
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyB_eNpMTroPTupXzl_oey08M0d-luxJ3OE";
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
        };

        const chatSession = model.startChat({
            generationConfig,
            history: additionalInfo.map(msg => ({ role: msg.role, parts: [{ text: msg.parts }] })),
        });

        try {
            const userMessage = `Dựa trên thông tin sau về một trang web AI, hãy cung cấp thêm một số thông tin bổ sung hoặc ví dụ cụ thể về cách sử dụng, khác với những gì đã được đề cập trước đó: ${websiteData}`;
            const newUserMessage: ChatMessage = { role: 'user', parts: userMessage };
            setAdditionalInfo(prevInfo => [...prevInfo, newUserMessage]);

            const result = await chatSession.sendMessage(userMessage);
            const text = result.response.text();
            const newModelMessage: ChatMessage = { role: 'model', parts: text };
            setAdditionalInfo(prevInfo => [...prevInfo, newModelMessage]);
            setResponseHistory(prevHistory => [...prevHistory, text]);
            setTypingIndex(additionalInfo.length + 1); // Set to the index of the new message
        } catch (error) {
            console.error('Error generating additional info:', error);
            const errorMessage: ChatMessage = { role: 'model', parts: 'Đã xảy ra lỗi khi tạo thông tin bổ sung.' };
            setAdditionalInfo(prevInfo => [...prevInfo, errorMessage]);
            setResponseHistory(prevHistory => [...prevHistory, 'Đã xảy ra lỗi khi tạo thông tin bổ sung.']);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (typingIndex >= 0 && typingIndex < additionalInfo.length) {
            const text = additionalInfo[typingIndex].parts;
            let charIndex = 0;
            const typingInterval = setInterval(() => {
                if (charIndex < text.length) {
                    setDisplayedText(prevText => prevText + text[charIndex]);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    setTypingIndex(-1); // Reset typing index when done
                }
            }, typingSpeed);
            return () => clearInterval(typingInterval);
        }
    }, [typingIndex, additionalInfo]);

    return (
        <div className="mt-4">
            {additionalInfo.length === 0 && (
                <button
                    onClick={generateAdditionalInfo}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaPlus className="mr-2" />}
                    {isLoading ? 'Đang tạo...' : 'Thêm thông tin'}
                </button>
            )}
            {responseHistory.map((response, index) => (
                <div key={index} className="mt-4 text-left">
                    <div className="inline-block p-3 rounded-lg bg-gray-900 text-white shadow-md border border-blue-500">
                        <div className="flex items-center mb-2">
                            <FaRobot className="text-blue-400 mr-2" />
                            <span className="text-blue-400 font-semibold">Thông tin từ AI</span>
                        </div>
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
                            {index === responseHistory.length - 1 && typingIndex !== -1 ? displayedText : response}
                        </ReactMarkdown>
                    </div>
                </div>
            ))}
            {(isLoading || typingIndex !== -1) && (
                <div className="mt-4 flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Đang tạo thông tin bổ sung...</span>
                </div>
            )}
            {responseHistory.length > 0 && typingIndex === -1 && !isLoading && (
                <button
                    onClick={generateAdditionalInfo}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 mt-4"
                    disabled={isLoading}
                >
                    <FaPlus className="mr-2" />
                    Thêm thông tin
                </button>
            )}
        </div>
    );
};

export default AdditionalInfoButton;