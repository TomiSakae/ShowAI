import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    onTagClick?: (tag: string) => void;
    allTags?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onTagClick, allTags = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleTagSearch = (tag: string) => {
        router.push(`/search?tag=${encodeURIComponent(tag)}`);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative flex w-full max-w-md">
                <input
                    type="text"
                    placeholder="Tìm kiếm công cụ AI..."
                    className="py-2 px-4 rounded-full w-full text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    className="bg-white text-black rounded-full px-4 py-2 ml-2"
                    onClick={handleSearch}
                >
                    <FaSearch />
                </button>
            </div>
            {allTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                    {allTags.map((tag, index) => (
                        <button
                            key={index}
                            className="flex items-center bg-[#6366F1] hover:bg-[#93C5FD] text-white rounded-full px-4 py-2 transition-colors duration-300"
                            onClick={() => onTagClick ? onTagClick(tag) : handleTagSearch(tag)}
                        >
                            <FaSearch className="mr-2" />
                            {tag}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;