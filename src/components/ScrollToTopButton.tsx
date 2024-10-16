'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isScrollComplete, setIsScrollComplete] = useState(true);
    const [showTop3, setShowTop3] = useState(false);
    const [top3Opacity, setTop3Opacity] = useState(1);
    const [imageSize, setImageSize] = useState(100);
    const [isPressed, setIsPressed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLive2DLoaded, setIsLive2DLoaded] = useState(false);
    const [isLive2DVisible, setIsLive2DVisible] = useState(false);
    const [isMobilePressed, setIsMobilePressed] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (isScrolling) return;
            if (window.pageYOffset > 300) {
                setIsVisible(true);
                setIsScrollComplete(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [isScrolling]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setImageSize(mobile ? 75 : 100);
            setIsMobile(mobile);
        };

        handleResize(); // Set initial size and mobile state
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleLive2DLoaded = () => {
            setIsLive2DLoaded(true);
            setIsLive2DVisible(true);
        };

        const handleLive2DClosed = () => {
            setIsLive2DVisible(false);
        };

        window.addEventListener('live2dModelLoaded', handleLive2DLoaded);
        window.addEventListener('live2dModelClosed', handleLive2DClosed);

        return () => {
            window.removeEventListener('live2dModelLoaded', handleLive2DLoaded);
            window.removeEventListener('live2dModelClosed', handleLive2DClosed);
        };
    }, []);

    const scrollToTop = useCallback(() => {
        setIsPressed(true);
        if (isMobile) {
            setIsMobilePressed(true);
        }
        setIsVisible(false);
        setIsScrolling(true);
        setIsScrollComplete(false);
        setShowTop3(true);
        setTop3Opacity(1);

        document.documentElement.classList.add('smooth-scroll');

        const startTime = performance.now();
        const startPosition = window.pageYOffset;
        const duration = Math.min(800, startPosition / 2); // Thời gian cuộn tối đa là 800ms hoặc nhanh hơn cho các trang ngắn

        const scrollStep = (timestamp: number) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeOutQuint(progress);

            window.scrollTo(0, startPosition * (1 - easeProgress));

            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            } else {
                finishScroll();
            }
        };

        requestAnimationFrame(scrollStep);

        const finishScroll = () => {
            document.documentElement.classList.remove('smooth-scroll');
            window.scrollTo(0, 0);
            setIsScrolling(false);
            setIsScrollComplete(true);

            let opacity = 1;
            const fadeInterval = setInterval(() => {
                opacity -= 0.1;
                setTop3Opacity(opacity);
                if (opacity <= 0) {
                    clearInterval(fadeInterval);
                    setShowTop3(false);
                }
            }, 50);
            setIsPressed(false);
            if (isMobile) {
                setIsMobilePressed(false);
            }
        };
    }, [isMobile]);

    // Hàm easing mới để tạo chuyển động nhanh hơn
    const easeOutQuint = (t: number): number => {
        return 1 - Math.pow(1 - t, 5);
    };

    const handleTouchStart = () => {
        setIsPressed(true);
        if (isMobile) {
            setIsMobilePressed(true);
        }
    };

    const handleTouchEnd = () => {
        setIsPressed(false);
        if (isMobile) {
            // Don't reset isMobilePressed here, it will be reset after scrolling
        }
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (!isLive2DLoaded || !isLive2DVisible) && (
                    <motion.button
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3 }}
                        onClick={scrollToTop}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        className="fixed bottom-5 right-0 bg-transparent p-0 shadow-none"
                        aria-label="Cuộn lên đầu trang"
                    >
                        <Image
                            src={
                                isMobile
                                    ? (isMobilePressed ? '/Top2.png' : '/Top1.png')
                                    : (!isMobile && (isHovered || isPressed) && isScrollComplete ? '/Top2.png' : '/Top1.png')
                            }
                            alt="Cuộn lên đầu trang"
                            width={imageSize}
                            height={imageSize}
                            style={{
                                opacity: isMobile
                                    ? (isMobilePressed ? 1 : 0.5)
                                    : ((isHovered || isPressed) ? 1 : 0.5)
                            }}
                        />
                    </motion.button>
                )}
            </AnimatePresence>
            {showTop3 && (!isLive2DLoaded || !isLive2DVisible) && (
                <div className="fixed bottom-0 right-0 bg-transparent p-0 shadow-none">
                    <Image
                        src="/Top3.png"
                        alt="Đang cuộn lên đầu trang"
                        width={imageSize}
                        height={imageSize}
                        style={{ opacity: top3Opacity }}
                    />
                </div>
            )}
        </>
    );
};

export default ScrollToTopButton;
