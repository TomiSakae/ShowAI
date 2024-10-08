'use client'
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface AIWebsite {
  _id: string;
  id: string;
  name: string;
  description: string[];
  tags: string[];
  link: string;
  keyFeatures: string[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface ApiResponse {
  data: AIWebsite[];
  pagination: PaginationInfo;
  tags: string[];
}

export default function Home() {
  const [aiWebsites, setAiWebsites] = useState<AIWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchData(1);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = async (page: number) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      const response = await fetch(`https://vercel-api-five-nu.vercel.app/api/showai?page=${page}`, {
        signal: abortControllerRef.current.signal
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const apiResponse: ApiResponse = await response.json();
      setAiWebsites(apiResponse.data);
      setPaginationInfo(apiResponse.pagination);
      setAllTags(apiResponse.tags);
      setIsLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setIsLoading(false);
      }
    }
  };

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (paginationInfo?.totalPages || 1)) {
      setPaginationInfo(prev => prev ? { ...prev, currentPage: newPage } : null);
      fetchData(newPage);
    }
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
              {allTags.map((tag, index) => (
                <button
                  key={index}
                  className="flex items-center bg-[#6366F1] hover:bg-[#93C5FD] text-white rounded-full px-4 py-2 transition-colors duration-300"
                  onClick={() => handleTagSearch(tag)}
                >
                  <FaSearch className="mr-2" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            {error}
          </div>
        ) : (
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
        {paginationInfo && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            {paginationInfo.currentPage > 1 && (
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
              >
                <FaChevronLeft />
              </button>
            )}
            <span>{paginationInfo.currentPage}</span>
            {paginationInfo.currentPage < paginationInfo.totalPages && (
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
              >
                <FaChevronRight />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}