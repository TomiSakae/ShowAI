'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaSpinner, FaSearch } from 'react-icons/fa';
import Link from 'next/link';

interface AIWebsite {
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
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            fetchWebsiteDetails(id);
        }
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
            if (Array.isArray(data) && data.length > 0) {
                setWebsite(data[0]);
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

    const handleInputSearch = () => {
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <div className="bg-[#2A3284] text-center py-4 mb-4 px-4">
                <div className="py-4 sm:py-8">
                    <div className="flex justify-center items-center">
                        <div className="relative flex w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Tìm kiếm công cụ AI..."
                                className="py-2 px-4 rounded-full w-full text-black"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleInputSearch()}
                            />
                            <button
                                className="bg-white text-black rounded-full px-4 py-2 ml-2"
                                onClick={handleInputSearch}
                            >
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-8">
                {isLoading && (
                    <div className="text-center">
                        <FaSpinner className="inline-block animate-spin mr-2" /> Đang tải...
                    </div>
                )}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!isLoading && !error && website && (
                    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-blue-300 mb-2">{website.name}</h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {website.tags && website.tags.map((tag, index) => (
                                        <Link href={`/search?tag=${encodeURIComponent(tag)}`} key={index}>
                                            <span className="bg-blue-900 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer hover:bg-blue-800 transition-colors duration-300">
                                                {tag}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <a
                                href={website.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-[#6366F1] hover:bg-[#93C5FD] text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 mt-4 sm:mt-0"
                            >
                                Truy cập trang web
                            </a>
                        </div>
                        <p className="text-gray-300 mb-4 whitespace-pre-wrap">
                            {Array.isArray(website.description)
                                ? website.description.join('\n\n')
                                : website.description}
                        </p>
                        {website.keyFeatures && website.keyFeatures.length > 0 && (
                            <div>
                                <strong className="text-blue-300">Tính năng chính:</strong>
                                <ul className="list-disc list-inside mt-2 text-gray-300">
                                    {website.keyFeatures.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                {!isLoading && !error && !website && (
                    <p className="text-center">Không có dữ liệu để hiển thị.</p>
                )}
            </div>
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