import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0f172a]">
            <motion.div
                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%]"
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 50,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.15), transparent 50%)",
                }}
            />

            {/* Mesh Gradient Blobs */}
            <motion.div
                className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px]"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px]"
                animate={{
                    x: [0, -70, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            <motion.div
                className="absolute bottom-[10%] left-[30%] w-[50vw] h-[50vw] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[120px]"
                animate={{
                    x: [0, 60, 0],
                    y: [0, -60, 0],
                    scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                }}
            />

            {/* Grid Overlay for texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay pointer-events-none" />
        </div>
    );
};

export default AnimatedBackground;
