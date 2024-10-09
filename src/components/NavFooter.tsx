'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { IoClose, IoExpand, IoContract, IoTrash } from 'react-icons/io5';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import GeminiChat from './GeminiChat';

const NavBar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [clearTrigger, setClearTrigger] = useState(0);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleClearMessages = () => {
        sessionStorage.removeItem('chatMessages');
        setClearTrigger(prev => prev + 1);
    };

    return (
        <nav className="bg-[#3E52E8] text-white p-4">
            <div className="container md:mx-4 flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold">
                    <Image src="https://tomisakae.github.io/ShowAI/logo.jpg" alt="ShowAI Logo" className='rounded-full' width={60} height={60} />
                </Link>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-[#3E52E8] px-4 py-2 rounded mx-6 hover:bg-[#93C5FD] hover:text-white transition-colors duration-300"
                >
                    AI Hỗ Trợ
                </button>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`bg-[#0F172A] rounded-lg p-6 flex flex-col border border-[#3E52E8] transition-all duration-300 ${isExpanded ? 'w-[98%] h-[98%]' : 'w-full max-w-2xl h-3/4'}`}>
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
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    <IoClose className="h-6 w-6 md:h-7 md:w-7" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <GeminiChat key={clearTrigger} />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

const Footer = () => (
    <footer className="bg-[#3E52E8] text-white py-8">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">Về ShowAI</h3>
                    <p className="text-sm">ShowAI là nền tảng giúp bạn khám phá và tìm kiếm các công cụ AI hữu ích cho công việc và cuộc sống.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:text-gray-300">Trang chủ</Link></li>
                            <li><Link href="/about" className="hover:text-gray-300">Giới thiệu</Link></li>
                        </ul>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="hover:text-gray-300">Liên hệ</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-gray-300">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Kết nối với tôi</h3>
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/TomiSakaeAnime/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300"><FaFacebook size={24} /></a>
                        <a href="https://zalo.me/0762605309" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300"><SiZalo size={24} /></a>
                        <a href="https://github.com/TomiSakae" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300"><FaGithub size={24} /></a>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center">
                <p>&copy; {new Date().getFullYear()} ShowAI. Tất cả các quyền được bảo lưu.</p>
            </div>
        </div>
    </footer>
);

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;