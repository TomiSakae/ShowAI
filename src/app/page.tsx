'use client'
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface AIWebsite {
  id: string;
  name: string;
  description: string;
  tags: string[];
  link: string;
}

export default function Home() {
  const [aiWebsites, setAiWebsites] = useState<AIWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://vercel-api-umber-ten.vercel.app/api/showai');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAiWebsites(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (term: string = searchTerm) => {
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  const handleTagSearch = (tag: string) => {
    router.push(`/search?tag=${encodeURIComponent(tag)}`);
  };

  const handleWebsiteClick = (id: string) => {
    router.push(`/show?id=${id}`);
  };

  return (
    <div className="bg-[#0F172A] text-white min-h-screen">
      <div className="bg-[#2A3284] text-center py-8 mb-8 px-4">
        <div className='py-4 sm:py-8'>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Tìm các công cụ và ứng dụng AI tốt nhất</h1>
          <p className="text-base sm:text-lg max-w-3xl mx-auto mb-6">
            Khám phá các công cụ AI miễn phí sử dụng được ở việt nam. Các AI hỗ trợ giúp công việc của bạn trở nên đơn giản hơn bao giờ hết.
          </p>
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
                onClick={() => handleSearch()}
              >
                <FaSearch />
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <button
                className="flex items-center bg-[#6366F1] hover:bg-[#93C5FD] text-white rounded-full px-4 py-2 transition-colors duration-300"
                onClick={() => handleTagSearch('Chat')}
              >
                <FaSearch className="mr-2" />
                Chat
              </button>
              <button
                className="flex items-center bg-[#6366F1] hover:bg-[#93C5FD] text-white rounded-full px-4 py-2 transition-colors duration-300"
                onClick={() => handleTagSearch('Data')}
              >
                <FaSearch className="mr-2" />
                Data
              </button>
              <button
                className="flex items-center bg-[#6366F1] hover:bg-[#93C5FD] text-white rounded-full px-4 py-2 transition-colors duration-300"
                onClick={() => handleTagSearch('Video')}
              >
                <FaSearch className="mr-2" />
                Video
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-8">
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiWebsites.map((website, index) => (
              <div
                key={index}
                onClick={() => handleWebsiteClick(website.id)}
                className="border border-gray-700 rounded-lg p-4 hover:shadow-lg hover:shadow-blue-500/50 transition-shadow h-full flex flex-col bg-gray-800 cursor-pointer"
              >
                <h2 className="text-xl font-semibold mb-2 text-blue-300">{website.name}</h2>
                <div className="text-gray-300 mb-4 flex-grow overflow-hidden">
                  <p className="line-clamp-3">
                    {website.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {website.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-blue-900 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagSearch(tag);
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}