import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const AmbientBackground = () => {
    const mouseX = useMotionValue(-1000);
    const mouseY = useMotionValue(-1000);

    // Smooth physics spring for cursor spotlight
    const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 });
    const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', checkMobile);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
            {/* 1. Deep Obsidian Base Canvas */}
            <div className="absolute inset-0 bg-[#05060a]" />

            {/* 2. Top Horizon Laser Line */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            <div className="absolute top-0 inset-x-1/4 h-[30px] bg-gradient-to-b from-cyan-500/[0.07] to-transparent blur-md" />

            {/* 3. Precision Engineering Cartesian Grid Lines */}
            <div 
                className="absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_60%,transparent_100%)]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px'
                }}
            />

            {/* 4. Fine Dot-Matrix Intersection Crosshairs */}
            <div 
                className="absolute inset-0 opacity-[0.25] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_50%,transparent_100%)]"
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
                    backgroundSize: '48px 48px'
                }}
            />

            {/* 5. Interactive Cursor Spotlight (Illuminates the Grid on Desktop) */}
            {!isMobile && (
                <motion.div
                    className="fixed w-[550px] h-[550px] rounded-full pointer-events-none transition-opacity duration-300"
                    style={{
                        left: smoothX,
                        top: smoothY,
                        transform: 'translate(-50%, -50%)',
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)',
                    }}
                />
            )}
        </div>
    );
};

export default AmbientBackground;
