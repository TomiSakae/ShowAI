// components/Live2DModel.tsx
'use client'
import Script from 'next/script';
import { useEffect, useState, useRef } from 'react';
import * as PIXI from 'pixi.js';

declare global {
    interface Window {
        PIXI: typeof PIXI;
    }
}

const Live2DModelComponent = () => {
    const [isLive2DScriptLoaded, setIsLive2DScriptLoaded] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const appRef = useRef<PIXI.Application | null>(null);
    const [chatMessage, setChatMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typewriterRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        window.PIXI = PIXI;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const scaleFactor = 1.0;
        PIXI.GRAPHICS_CURVES.adaptive = false;
        PIXI.settings.ANISOTROPIC_LEVEL = 0;
        PIXI.settings.RESOLUTION = devicePixelRatio;
        PIXI.settings.ROUND_PIXELS = true;
        const app = new PIXI.Application({
            view: document.getElementById('canvas') as HTMLCanvasElement,
            width: window.innerWidth * scaleFactor,
            height: window.innerHeight * scaleFactor,
            autoStart: true,
            resizeTo: window,
            antialias: true,
            autoDensity: true,
            resolution: devicePixelRatio,
            powerPreference: 'high-performance',
            backgroundAlpha: 0,
        });
        appRef.current = app;

        const loadLive2DModel = async () => {
            const { Live2DModel, MotionPreloadStrategy } = await import('pixi-live2d-display');
            const model = await Live2DModel.from(window.localStorage.getItem('model') || 'https://tomisakae.id.vn/live2d/models/abeikelongbi_3_hx/abeikelongbi_3_hx.model3.json', { motionPreload: MotionPreloadStrategy.IDLE });
            const pixiModel = model as unknown as PIXI.Container;
            app.stage.addChild(pixiModel);
            pixiModel.position.set(100, 0);
            pixiModel.scale.set(0.1);
            pixiModel.interactive = true;
            pixiModel.trackedPointers = {};
            setIsModelLoaded(true);
            typeText('Hãy dí chuột vào các thành phần trên web và tôi sẽ hiện thông tin về chức năng của nó!');
        };

        if (isLive2DScriptLoaded) {
            loadLive2DModel();
        }

        // Adjust canvas position and size
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (canvas) {
            canvas.style.position = 'fixed';
            canvas.style.right = '-15%';
            canvas.style.bottom = '0';
            canvas.style.width = '30%';
            canvas.style.height = 'auto';
            canvas.style.zIndex = '1000';
        }

        // Add event listeners for logo hover
        const handleLogoHover = (event: CustomEvent) => {
            typeText(event.detail);
        };

        const handleLogoLeave = () => {
            typeText('Hãy dí chuột vào các thành phần trên web và tôi sẽ hiện thông tin về chức năng của nó!');
        };

        window.addEventListener('logoHover', handleLogoHover as EventListener);
        window.addEventListener('logoLeave', handleLogoLeave);

        return () => {
            window.removeEventListener('logoHover', handleLogoHover as EventListener);
            window.removeEventListener('logoLeave', handleLogoLeave);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLive2DScriptLoaded]);

    const typeWriter = (text: string, index: number = 0) => {
        if (index < text.length) {
            setChatMessage((prev) => prev + text.charAt(index));
            typewriterRef.current = setTimeout(() => typeWriter(text, index + 1), 50);
        } else {
            setIsTyping(false);
        }
    };

    const typeText = (message: string) => {
        setIsTyping(true);
        setChatMessage('');
        if (typewriterRef.current) {
            clearTimeout(typewriterRef.current);
        }
        typeWriter(message);
    };

    return (
        <>
            <Script
                src="https://tomisakae.id.vn/live2d/core/live2dcubismcore.min.js"
                onLoad={() => setIsLive2DScriptLoaded(true)}
            />
            <Script
                src="https://tomisakae.id.vn/live2d/core/live2d.min.js"
                onLoad={() => setIsLive2DScriptLoaded(true)}
            />
            <canvas id="canvas" />
            {isModelLoaded && (
                <div className="fixed right-[1%] bottom-[31%] bg-white p-2.5 rounded-lg max-w-[200px] z-[1001]">
                    <p className="m-0 text-lg text-black text-sm">
                        {chatMessage}
                        {isTyping && <span className="animate-pulse">|</span>}
                    </p>
                </div>
            )}
        </>
    );
};

export default Live2DModelComponent;