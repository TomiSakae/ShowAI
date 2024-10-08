'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaSpinner, FaStar, FaTimes } from 'react-icons/fa';
import WebsiteList from '@/components/WebsiteList';
import SearchBar from '@/components/SearchBar';
import ModalPortal from '@/components/ModalPortal';
import WebsiteDetails from '@/components/WebsiteDetails';

interface AIWebsite {
    _id: string;
    id: string;
    name: string;
    description: string[];
    tags: string[];
    link: string;
    keyFeatures: string[];
}

function ShowContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [website, setWebsite] = useState<AIWebsite | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [randomWebsites, setRandomWebsites] = useState<AIWebsite[]>([]);
    const [isRandomLoading, setIsRandomLoading] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [starredWebsites, setStarredWebsites] = useState<AIWebsite[]>([]);
    const [isStarredLoading, setIsStarredLoading] = useState(true);
    const [showStarredModal, setShowStarredModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [allTags, setAllTags] = useState<string[]>([]);

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            fetchWebsiteDetails(id);
            checkIfStarred(id);
        }
        fetchRandomWebsites();
        fetchStarredWebsites();

        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, [searchParams]);

    const fetchWebsiteDetails = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://vercel-api-five-nu.vercel.app/api/showai?id=${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Received data:', data);
            if (data && data.data && data.data.length > 0) {
                setWebsite(data.data[0]);
                setAllTags(data.tags);
            } else {
                setError('Không tìm thấy dữ liệu website');
            }
        } catch (error) {
            console.error('Error fetching website details:', error);
            setError('Không thể tải thông tin website');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRandomWebsites = async () => {
        setIsRandomLoading(true);
        try {
            const response = await fetch('https://vercel-api-five-nu.vercel.app/api/showai?random=9');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data && data.data) {
                setRandomWebsites(data.data);
                setAllTags(data.tags);
            }
        } catch (error) {
            console.error('Error fetching random websites:', error);
        } finally {
            setIsRandomLoading(false);
        }
    };

    const fetchStarredWebsites = async () => {
        setIsStarredLoading(true);
        const starredIds = JSON.parse(localStorage.getItem('starredIds') || '[]');
        if (starredIds.length === 0) {
            setStarredWebsites([]);
            setIsStarredLoading(false);
            return;
        }
        try {
            const starIdsQuery = starredIds.join(',');
            const response = await fetch(`https://vercel-api-five-nu.vercel.app/api/showai?star=${starIdsQuery}`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.data) {
                    setStarredWebsites(data.data);
                    setAllTags(data.tags);
                }
            }
        } catch (error) {
            console.error('Error fetching starred websites:', error);
        } finally {
            setIsStarredLoading(false);
        }
    };

    const handleTagClick = (tag: string) => {
        router.push(`/search?tag=${encodeURIComponent(tag)}`);
    };

    const checkIfStarred = (id: string) => {
        const starredIds = JSON.parse(localStorage.getItem('starredIds') || '[]');
        setIsStarred(starredIds.includes(id));
    };

    const handleStarClick = () => {
        if (website) {
            const starredIds = JSON.parse(localStorage.getItem('starredIds') || '[]');
            if (isStarred) {
                const updatedIds = starredIds.filter((id: string) => id !== website.id);
                localStorage.setItem('starredIds', JSON.stringify(updatedIds));
            } else {
                starredIds.push(website.id);
                localStorage.setItem('starredIds', JSON.stringify(starredIds));
            }
            setIsStarred(!isStarred);
            fetchStarredWebsites();
        }
    };

    const toggleStarredModal = () => {
        setShowStarredModal(!showStarredModal);
    };

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <div className="bg-[#2A3284] text-center py-4 mb-4 px-4">
                <div className="py-4 sm:py-8">
                    <SearchBar onTagClick={handleTagClick} allTags={allTags} />
                </div>
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {isLoading && (
                            <div className="text-center">
                                <FaSpinner className="inline-block animate-spin mr-2" /> Đang tải...
                            </div>
                        )}
                        {error && <p className="text-center text-red-500">{error}</p>}
                        {!isLoading && !error && website && (
                            <WebsiteDetails
                                website={website}
                                isStarred={isStarred}
                                onStarClick={handleStarClick}
                                onTagClick={handleTagClick}
                            />
                        )}
                        {!isLoading && !error && !website && (
                            <p className="text-center">Không có dữ liệu để hiển thị.</p>
                        )}

                        {isRandomLoading ? (
                            <div className="text-center mt-8">
                                <FaSpinner className="inline-block animate-spin mr-2" /> Đang tải đề xuất...
                            </div>
                        ) : randomWebsites.length > 0 ? (
                            <div className="mt-8">
                                <h3 className="text-xl text-center font-bold text-blue-300 mb-4">Đề xuất trang web AI ngẫu nhiên</h3>
                                <WebsiteList websites={randomWebsites} onTagClick={handleTagClick} />
                            </div>
                        ) : (
                            <p className="text-center mt-8">Không có đề xuất nào để hiển thị.</p>
                        )}
                    </div>

                    {/* Starred Websites Modal (only for mobile) */}
                    {isMobile && showStarredModal && (
                        <ModalPortal>
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                                <div className="bg-gray-800 w-full max-w-md h-full overflow-y-auto">
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-blue-300">Danh sách các trang nổi bật</h2>
                                            <button onClick={toggleStarredModal} className="text-white">
                                                <FaTimes />
                                            </button>
                                        </div>
                                        {isStarredLoading ? (
                                            <div>
                                                <FaSpinner className="inline-block animate-spin mr-2" /> Đang tải...
                                            </div>
                                        ) : starredWebsites.length > 0 ? (
                                            <WebsiteList websites={starredWebsites} onTagClick={handleTagClick} isSidebar={true} />
                                        ) : (
                                            <p className="text-center text-white">Không có trang nổi bật nào.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ModalPortal>
                    )}

                    {/* Starred Websites (for desktop) */}
                    {!isMobile && (
                        <div className="hidden lg:block">
                            <h2 className="text-xl font-bold text-blue-300 mb-4">Danh sách các trang nổi bật</h2>
                            <div className="h-[calc(100vh-40px)] overflow-y-auto">
                                {isStarredLoading ? (
                                    <div>
                                        <FaSpinner className="inline-block animate-spin mr-2" /> Đang tải...
                                    </div>
                                ) : starredWebsites.length > 0 ? (
                                    <WebsiteList websites={starredWebsites} onTagClick={handleTagClick} isSidebar={true} />
                                ) : (
                                    <p className="text-center text-white">Không có trang nổi bật nào.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isMobile && (
                <ModalPortal>
                    <button
                        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full"
                        onClick={toggleStarredModal}
                    >
                        <FaStar />
                    </button>
                </ModalPortal>
            )}
        </div>
    );
}

export default function Show() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShowContent />
        </Suspense>
    );
}