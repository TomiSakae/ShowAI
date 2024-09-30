'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { useSearchParams, useRouter } from 'next/navigation';

interface AIWebsite {
    id: string;
    name: string;
    description: string[];
    tags: string[];
    link: string;
}

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [aiWebsites, setAiWebsites] = useState<AIWebsite[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayTerm, setDisplayTerm] = useState('');
    const [isTagSearch, setIsTagSearch] = useState(false);

    useEffect(() => {
        const query = searchParams.get('q');
        const tag = searchParams.get('tag');
        if (query) {
            setDisplayTerm(query);
            setIsTagSearch(false);
            handleSearch(query, 'q');
        } else if (tag) {
            setDisplayTerm(tag);
            setIsTagSearch(true);
            handleSearch(tag, 'tag');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleSearch = async (term: string = searchTerm, type: 'q' | 'tag' = 'q') => {
        if (!term.trim()) return;
        setIsLoading(true);
        setError(null);
        setDisplayTerm(term);
        setSearchTerm(''); // Clear the input after search
        try {
            const response = await fetch(`https://vercel-api-five-nu.vercel.app/api/showai?${type}=${encodeURIComponent(term)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAiWebsites(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTagClick = (tag: string) => {
        router.push(`/search?tag=${encodeURIComponent(tag)}`);
        setSearchTerm('');
    };

    const handleInputSearch = () => {
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <div className="bg-[#2A3284] text-center py-8 mb-8 px-4">
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
                    <p className="mt-4 text-base sm:text-lg font-bold">
                        {isTagSearch ? `Kết quả của tag: ${displayTerm}` : `Kết quả của: ${displayTerm}`}
                    </p>
                </div>
            </div>
            <div className="px-4 py-8">
                {isLoading && <p className="text-center"><FaSpinner className="inline-block animate-spin mr-2" /> Đang tìm kiếm...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!isLoading && !error && (
                    aiWebsites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {aiWebsites.map((website, index) => (
                                <div
                                    key={index}
                                    onClick={() => router.push(`/show?id=${website.id}`)}
                                    className="border border-gray-700 rounded-lg p-4 hover:shadow-lg hover:shadow-blue-500/50 transition-shadow h-full flex flex-col bg-gray-800 cursor-pointer"
                                >
                                    <h2 className="text-xl font-semibold mb-2 text-blue-300">{website.name}</h2>
                                    <div className="text-gray-300 mb-4 flex-grow overflow-hidden">
                                        <p className="line-clamp-3">
                                            {website.description[0]}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {website.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="bg-blue-900 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer hover:bg-blue-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTagClick(tag);
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-lg">Không tìm thấy kết quả</p>
                    )
                )}
            </div>
        </div>
    );
}

export default function Search() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
