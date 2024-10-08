import React from 'react';
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

interface WebsiteListProps {
    websites: AIWebsite[];
    onTagClick: (tag: string) => void;
    isSidebar?: boolean;
}

const WebsiteList: React.FC<WebsiteListProps> = ({ websites, onTagClick, isSidebar = false }) => {
    const router = useRouter();

    const handleWebsiteClick = (id: string) => {
        router.push(`/show?id=${id}`);
    };

    return (
        <div className={isSidebar ? "flex flex-col gap-4 mb-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
            {websites.map((website, index) => (
                <div
                    key={index}
                    onClick={() => handleWebsiteClick(website.id)}
                    className={`border border-gray-700 rounded-lg p-4 hover:shadow-lg hover:shadow-blue-500/50 transition-shadow flex flex-col bg-gray-800 cursor-pointer ${isSidebar ? 'h-auto' : 'h-full'}`}
                >
                    <h2 className={`font-semibold mb-2 text-blue-300 ${isSidebar ? 'text-lg' : 'text-xl'}`}>{website.name}</h2>
                    <div className="text-gray-300 mb-4 flex-grow overflow-hidden">
                        <p className={isSidebar ? "line-clamp-2" : "line-clamp-3"}>
                            {Array.isArray(website.description) ? website.description[0] : website.description}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {website.tags.map((tag, tagIndex) => (
                            <span
                                key={tagIndex}
                                className="bg-blue-900 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer hover:bg-blue-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTagClick(tag);
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WebsiteList;