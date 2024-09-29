'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AIWebsite {
  name: string;
  description: string;
  tags: string[];
  link: string;
}

export default function Home() {
  const [aiWebsites, setAiWebsites] = useState<AIWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return null; // Return null while loading to not render anything
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trang web AI</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiWebsites.map((website, index) => (
          <Link href={website.link} key={index} target="_blank" rel="noopener noreferrer">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{website.name}</h2>
              <div className="text-gray-600 mb-4 flex-grow overflow-hidden">
                <p className="line-clamp-3">
                  {website.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {website.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}