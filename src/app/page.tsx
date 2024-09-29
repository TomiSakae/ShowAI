import React from 'react';
import Link from 'next/link';

interface AIWebsite {
  title: string;
  description: string;
  tags: string[];
  url: string;
}

const aiWebsites: AIWebsite[] = [
  {
    title: "AI Image Generator",
    description: "Tạo hình ảnh từ mô tả văn bản bằng AI",
    tags: ["ảnh", "AI"],
    url: "/ai-image-generator"
  },
  {
    title: "AI Video Creator",
    description: "Tạo video ngắn bằng công nghệ AI",
    tags: ["video", "AI"],
    url: "/ai-video-creator"
  },
  {
    title: "AI Code Assistant",
    description: "Trợ lý lập trình thông minh sử dụng AI",
    tags: ["code", "AI"],
    url: "/ai-code-assistant"
  },
  // Thêm các trang web AI khác ở đây
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trang web AI</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiWebsites.map((website, index) => (
          <Link href={website.url} key={index}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{website.title}</h2>
              <p className="text-gray-600 mb-4">{website.description}</p>
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