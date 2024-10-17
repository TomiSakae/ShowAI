import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaExternalLinkAlt, FaEye, FaHeart, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import Image from 'next/image';

interface AIWebsite {
    _id: string;
    id: string;
    name: string;
    description: string[];
    tags: string[];
    link: string;
    keyFeatures: string[];
    view?: number;
    heart?: number;
    evaluation?: number;
    label?: string;
    labelColor?: string;
    labelIcon?: React.ReactNode;
    image?: string;
}

interface WebsiteListProps {
    websites: AIWebsite[];
    onTagClick: (tag: string) => void;
    isSidebar?: boolean;
    isRandom?: boolean;
    isShuffled?: boolean;
}

const WebsiteList: React.FC<WebsiteListProps> = ({ websites, onTagClick, isSidebar = false, isRandom = false, isShuffled = false }) => {
    const router = useRouter();
    const [hoveredWebsite, setHoveredWebsite] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const websiteRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleWebsiteClick = (id: string) => {
        router.push(`/show?id=${id}`);

        fetch('/api/incrementView', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        }).catch(error => {
            console.error('Lỗi khi tăng số lượt xem:', error);
        });
    };

    const handleMouseEnter = (id: string, index: number) => {
        setHoveredWebsite(id);
        gsap.to(websiteRefs.current[index], {
            scale: 1,
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
            duration: 0,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = (index: number) => {
        setHoveredWebsite(null);
        gsap.to(websiteRefs.current[index], {
            scale: 1,
            boxShadow: 'none',
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.div
            className={isSidebar
                ? "flex flex-col gap-4 mb-4"
                : isRandom
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
                    : isShuffled
                        ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
            }
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {websites.map((website, index) => (
                <motion.div
                    key={index}
                    ref={(el: HTMLDivElement | null) => {
                        if (el) websiteRefs.current[index] = el;
                    }}
                    variants={itemVariants}
                    onClick={() => handleWebsiteClick(website.id)}
                    onMouseEnter={() => handleMouseEnter(website.id, index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    className={`border border-gray-700 rounded-lg transition-all duration-300 flex flex-col cursor-pointer ${isSidebar ? 'h-auto' : 'h-full'} relative overflow-hidden`}
                >
                    {website.image && !isSidebar && (
                        <div className="p-3 pb-0 bg-gray-900">
                            <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
                                <Image
                                    src={website.image}
                                    alt={website.name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        </div>
                    )}
                    <div className="p-5 pt-3 bg-gray-800 flex-grow">
                        {website.label && (
                            <div className={`absolute top-0 left-0 m-2 flex items-center ${website.labelColor || 'text-blue-500'}`}>
                                {website.labelIcon}
                                <span className="text-xs font-bold">{website.label}</span>
                            </div>
                        )}
                        <div className="flex flex-col mb-2">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className={`font-semibold text-blue-300 ${isSidebar ? 'text-lg' : 'text-xl'}`}>
                                    {website.name}
                                </h2>
                                <a
                                    href={website.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`text-blue-300 hover:text-blue-500 ${isMobile || isSidebar || (!isSidebar && !isMobile && hoveredWebsite === website.id) ? 'block' : 'hidden'}`}
                                >
                                    <FaExternalLinkAlt />
                                </a>
                            </div>
                            <div className="flex items-center space-x-4 text-gray-400 text-sm">
                                {website.view !== undefined && (
                                    <div className="flex items-center">
                                        <FaEye className="mr-1" />
                                        <span>{website.view}</span>
                                    </div>
                                )}
                                {website.heart !== undefined && (
                                    <div className="flex items-center">
                                        <FaHeart className="mr-1 text-red-500" />
                                        <span>{website.heart}</span>
                                    </div>
                                )}
                                {website.evaluation !== undefined && (
                                    <div className="flex items-center">
                                        <FaStar className="mr-1 text-yellow-400" />
                                        <span>{website.evaluation.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <AnimatePresence>
                            <div className="text-gray-300 mb-4 flex-grow overflow-hidden">
                                <p className={isSidebar ? "line-clamp-3" : "line-clamp-4"}>
                                    {Array.isArray(website.description) ? website.description[0] : website.description}
                                </p>
                            </div>
                        </AnimatePresence>
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
                </motion.div>
            ))}
        </motion.div>
    );
};

export default WebsiteList;
