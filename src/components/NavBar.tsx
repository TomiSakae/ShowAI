'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IoClose, IoMenu } from 'react-icons/io5';
import GeminiChat from './GeminiChat';
import AIDesignModal from './AIDesignModal';
import Live2DModelComponent from './Live2DModelComponent';

const NavBar = () => {
    const [isGeminiChatOpen, setIsGeminiChatOpen] = useState(false);
    const [isAIDesignModalOpen, setIsAIDesignModalOpen] = useState(false);
    const [isLive2DModalOpen, setIsLive2DModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

        const storedLive2DState = localStorage.getItem('isLive2DModalOpen');
        if (storedLive2DState) {
            setIsLive2DModalOpen(JSON.parse(storedLive2DState));
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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleLive2DModal = () => {
        const newState = !isLive2DModalOpen;
        setIsLive2DModalOpen(newState);
        localStorage.setItem('isLive2DModalOpen', JSON.stringify(newState));
    };

    return (
        <nav className={`${navStyles.bgColor} ${navStyles.textColor} ${navStyles.padding}`}>
            <div className="container md:mx-4 flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold">
                    <Image
                        src="https://tomisakae.github.io/ShowAI/logo.jpg"
                        alt="ShowAI Logo"
                        className='rounded-full'
                        width={60}
                        height={60}
                        onMouseEnter={() => window.dispatchEvent(new CustomEvent('logoHover', { detail: 'Đây là logo của ShowAI, một nền tảng giúp bạn khám phá và tìm kiếm các công cụ AI hữu ích.' }))}
                        onMouseLeave={() => window.dispatchEvent(new CustomEvent('logoLeave'))}
                    />
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
                                setIsGeminiChatOpen(true);
                                setIsSidebarOpen(false);
                            }}
                            className="bg-white text-[#3E52E8] px-4 py-2 rounded mx-2 hover:bg-[#93C5FD] hover:text-white transition-colors duration-300 w-full md:w-auto"
                        >
                            AI Hỗ Trợ
                        </button>
                        <button
                            onClick={toggleLive2DModal}
                            className="hidden md:block bg-white text-[#3E52E8] px-4 py-2 rounded mx-2 hover:bg-[#93C5FD] hover:text-white transition-colors duration-300"
                        >
                            {isLive2DModalOpen ? 'Tắt Live Hướng Dẫn' : 'Bật Live Hướng Dẫn'}
                        </button>
                    </div>
                </div>
            </div>
            {isAIDesignModalOpen && (
                <AIDesignModal isOpen={isAIDesignModalOpen} onClose={() => setIsAIDesignModalOpen(false)} />
            )}
            {isLive2DModalOpen && (
                <Live2DModelComponent />
            )}
            {isGeminiChatOpen && (
                <GeminiChat isOpen={isGeminiChatOpen} onClose={() => setIsGeminiChatOpen(false)} />
            )}
        </nav>
    );
};

export default NavBar;