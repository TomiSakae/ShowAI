import React from 'react';
import { IoSend, IoStop, IoClose, IoExpand, IoContract, IoTrash } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    text: string;
    isUser: boolean;
    isError?: boolean;
    isSampleQuestion?: boolean;
}

interface ChatInterfaceProps {
    isOpen: boolean;
    onClose: () => void;
    messages: Message[];
    typingText: string;
    input: string;
    setInput: (input: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    isTyping: boolean;
    isLoadingAIWebsites: boolean;
    isExpanded: boolean;
    toggleExpand: () => void;
    handleClearMessages: () => void;
    stopTyping: () => void;
    handleSampleQuestionClick: (question: string) => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    isOpen,
    onClose,
    messages,
    typingText,
    input,
    setInput,
    handleSubmit,
    isLoading,
    isTyping,
    isLoadingAIWebsites,
    isExpanded,
    toggleExpand,
    handleClearMessages,
    stopTyping,
    handleSampleQuestionClick,
    messagesEndRef
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-[#0F172A] rounded-lg p-6 flex flex-col border border-[#3E52E8] transition-all duration-300 ${isExpanded ? 'w-[98%] h-[98%]' : 'w-full max-w-2xl h-3/4'}`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl md:text-2xl font-bold text-[#93C5FD]">Trò chuyện cùng AI</h2>
                            <div className="flex items-center">
                                <button
                                    onClick={handleClearMessages}
                                    className="text-gray-400 hover:text-white transition-colors duration-300 mr-4"
                                >
                                    <IoTrash className="h-5 w-5 md:h-6 md:w-6" />
                                </button>
                                <button
                                    onClick={toggleExpand}
                                    className="text-gray-400 hover:text-white transition-colors duration-300 mr-4"
                                >
                                    {isExpanded ? <IoContract className="h-5 w-5 md:h-6 md:w-6" /> : <IoExpand className="h-5 w-5 md:h-6 md:w-6" />}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    <IoClose className="h-6 w-6 md:h-7 md:w-7" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-grow overflow-hidden">
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
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatInterface;