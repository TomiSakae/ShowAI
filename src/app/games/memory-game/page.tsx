'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSync } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import ModalPortal from '@/components/ModalPortal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Card {
    id: number;
    word: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const toastStyle = {
    style: {
        background: '#1E293B',
        color: '#fff',
        border: '1px solid #3B82F6',
        borderRadius: '0.5rem',
        padding: '1rem',
    },
};

// Thêm component Skeleton
const CardSkeleton = () => (
    <div className="aspect-square">
        <Skeleton
            className="h-full"
            baseColor="#1F2937"
            highlightColor="#374151"
            borderRadius="0.5rem"
        />
    </div>
);

export default function MemoryGame() {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [moves, setMoves] = useState(0);

    const PAIR_COUNT = 10;

    // Tự động khởi tạo game khi component mount
    useEffect(() => {
        initializeGame();
    }, []);

    const generateWords = async (pairCount: number) => {
        try {
            const apiKeyResponse = await fetch('/api/Gemini');
            const apiKeyData = await apiKeyResponse.json();
            if (!apiKeyData.success) {
                throw new Error('Không lấy được khóa API');
            }
            const apiKey = apiKeyData.apiKey;
            const genAI = new GoogleGenerativeAI(apiKey);

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_NONE
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: HarmBlockThreshold.BLOCK_NONE
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_NONE
                    }
                ]
            });

            const prompt = `Tạo ${pairCount} từ tiếng Việt có dấu (bao gồm cả từ đơn và từ ghép), mỗi từ không quá 10 chữ cái.
            Các từ nên đa dạng và thuộc nhiều chủ đề khác nhau như:
            - Thiên nhiên (cây cối, động vật, thời tiết...)
            - Văn hóa Việt Nam (ẩm thực, lễ hội, trang phục...)
            - Cảm xúc, tính cách
            - Hoạt động, nghề nghiệp
            - Đồ vật, vật dụng hàng ngày
            
            CHỈ TRẢ VỀ DANH SÁCH CÁC TỪ, mỗi từ trên một dòng, không kèm theo số thứ tự hay bất kỳ ký tự nào khác.
            Ví dụ các từ có thể là: Phở, Áo Dài, Mưa Rào, Hạnh Phúc, Trăng Sáng, v.v.`;

            const result = await model.generateContent(prompt);
            const words = result.response.text().trim().split('\n');
            return words.slice(0, pairCount);
        } catch (error) {
            console.error('Lỗi khi tạo từ:', error);
            // Từ dự phòng khi có lỗi
            return ['Phở', 'Áo Dài', 'Nón Lá', 'Trăng', 'Mưa', 'Hạnh Phúc', 'Trà Đá', 'Cà Phê', 'Võng', 'Đèn Lồng'].slice(0, pairCount);
        }
    };

    const initializeGame = async () => {
        setIsLoading(true);
        try {
            const words = await generateWords(PAIR_COUNT);

            const cardPairs = words.flatMap((word) => [
                { id: Math.random(), word, isFlipped: false, isMatched: false },
                { id: Math.random(), word, isFlipped: false, isMatched: false }
            ]);

            const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
            setCards(shuffledCards);
            setFlippedCards([]);
            setMoves(0);
        } catch (error) {
            console.error('Lỗi khởi tạo game:', error);
            toast.error('Có lỗi xảy ra khi tạo game!', toastStyle);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = (cardId: number) => {
        if (flippedCards.length === 2 ||
            cards.find(card => card.id === cardId)?.isMatched) return;

        if (flippedCards.includes(cardId)) return;

        setCards(cards.map(card =>
            card.id === cardId ? { ...card, isFlipped: true } : card
        ));

        setFlippedCards([...flippedCards, cardId]);
    };

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstId, secondId] = flippedCards;
            const firstCard = cards.find(card => card.id === firstId);
            const secondCard = cards.find(card => card.id === secondId);

            setMoves(moves + 1);

            if (firstCard?.word === secondCard?.word) {
                setCards(cards.map(card =>
                    card.id === firstId || card.id === secondId
                        ? { ...card, isMatched: true }
                        : card
                ));
                setFlippedCards([]);

                const allMatched = cards.every(card =>
                    (card.id === firstId || card.id === secondId) ? true : card.isMatched
                );
                if (allMatched) {
                    toast.success('Chúc mừng! Bạn đã chiến thắng!', toastStyle);
                }
            } else {
                setTimeout(() => {
                    setCards(cards.map(card =>
                        card.id === firstId || card.id === secondId
                            ? { ...card, isFlipped: false }
                            : card
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
        }
    }, [flippedCards]);

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <ModalPortal>
                <Toaster position="top-center" />
            </ModalPortal>
            <div className="bg-[#2A3284] text-center py-8 mb-8 px-4">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">Trò Chơi Trí Nhớ</h1>
                <p className="text-base sm:text-lg max-w-3xl mx-auto">
                    Lật các thẻ để tìm cặp từ giống nhau
                </p>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center gap-4 mb-8">
                    <button
                        onClick={initializeGame}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                        disabled={isLoading}
                    >
                        <FaSync className={isLoading ? 'animate-spin' : ''} />
                        Chơi lại
                    </button>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg">
                        <span className="font-bold">Số lượt: {moves}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                    {isLoading ? (
                        // Hiển thị skeleton khi đang tải
                        Array(PAIR_COUNT * 2).fill(null).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))
                    ) : cards.length > 0 ? (
                        // Hiển thị thẻ thật khi đã tải xong và có dữ liệu
                        cards.map((card) => (
                            <motion.div
                                key={card.id}
                                onClick={() => handleCardClick(card.id)}
                                className={`aspect-square rounded-lg cursor-pointer ${card.isFlipped || card.isMatched
                                    ? 'bg-blue-600'
                                    : 'bg-gray-800 hover:bg-gray-700'
                                    }`}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    rotateY: card.isFlipped || card.isMatched ? 180 : 0
                                }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-lg font-bold" style={{
                                        transform: 'rotateY(180deg)',
                                        opacity: card.isFlipped || card.isMatched ? 1 : 0
                                    }}>
                                        {card.word}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        // Hiển thị thông báo lỗi nếu không có dữ liệu
                        <div className="col-span-full text-center text-gray-400">
                            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
