'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IoClose, IoExpand, IoContract, IoTrash, IoMenu } from 'react-icons/io5';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import GeminiChat from './GeminiChat';
import AIDesignModal from './AIDesignModal';

const NavBar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [clearTrigger, setClearTrigger] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAIDesignModalOpen, setIsAIDesignModalOpen] = useState(false);
    const [navStyles, setNavStyles] = useState({
        bgColor: 'bg-[#3E52E8]',
        textColor: 'text-white',
        padding: 'p-4'
    });

    useEffect(() => {
        const storedNavStyles = localStorage.getItem('navStyles');
        if (storedNavStyles) {
            setNavStyles(JSON.parse(storedNavStyles));
        } else {
            localStorage.setItem('navStyles', JSON.stringify(navStyles));
        }

        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleClearMessages = () => {
        sessionStorage.removeItem('chatMessages');
        setClearTrigger(prev => prev + 1);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <nav className={`${navStyles.bgColor} ${navStyles.textColor} ${navStyles.padding}`}>
            <div className="container md:mx-4 flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold">
                    <Image src="https://tomisakae.github.io/ShowAI/logo.jpg" alt="ShowAI Logo" className='rounded-full' width={60} height={60} />
                </Link>
                <div className="md:hidden">
                    <button onClick={toggleSidebar} className="text-white">
                        <IoMenu size={32} />
                    </button>
                </div>
                <div className={`fixed top-0 right-0 h-full w-64 bg-[#3E52E8] z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 md:w-auto md:bg-transparent md:flex md:items-center`}>
                    <div className="flex flex-col h-full p-4 md:flex-row md:p-0">
                        <div className="flex justify-between items-center mb-4 md:hidden">
                            <p className="text-2xl font-bold">ShowAI</p>
                            <button
                                onClick={toggleSidebar}
                                className="text-white hover:text-gray-200 transition-colors duration-300"
                                aria-label="Close sidebar"
                            >
                                <IoClose size={28} />
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setIsAIDesignModalOpen(true);
                                setIsSidebarOpen(false);
                            }}
                            className="bg-white text-[#3E52E8] px-4 py-2 rounded mx-2 hover:bg-[#93C5FD] hover:text-white transition-colors duration-300 w-full md:w-auto mb-2 md:mb-0"
                        >
                            AI Giao Diện
                        </button>
                        <button
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsSidebarOpen(false);
                            }}
                            className="bg-white text-[#3E52E8] px-4 py-2 rounded mx-2 hover:bg-[#93C5FD] hover:text-white transition-colors duration-300 w-full md:w-auto"
                        >
                            AI Hỗ Trợ
                        </button>
                    </div>
                </div>
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
            {isAIDesignModalOpen && (
                <AIDesignModal onClose={() => setIsAIDesignModalOpen(false)} />
            )}
        </nav>
    );
};

const Footer = () => {
    const [footerStyles, setFooterStyles] = useState({
        bgColor: 'bg-[#3E52E8]',
        textColor: 'text-white',
        padding: 'py-8'
    });

    useEffect(() => {
        const storedFooterStyles = localStorage.getItem('footerStyles');
        if (storedFooterStyles) {
            setFooterStyles(JSON.parse(storedFooterStyles));
        } else {
            localStorage.setItem('footerStyles', JSON.stringify(footerStyles));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <footer className={`${footerStyles.bgColor} ${footerStyles.textColor} ${footerStyles.padding}`}>
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
};

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