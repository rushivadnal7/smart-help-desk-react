"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function ShootingStars() {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create multiple trail particles for each meteor
  const createTrailParticles = (count: number, delay = 0) => {
    return Array.from({ length: count }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-600"
        initial={{ 
          x: -50 - i * 8, 
          y: -50 - i * 5, 
          opacity: 0,
          scale: 1 - i * 0.1 
        }}
        animate={{
          x: [
            -50 - i * 8, 
            dimensions.width + 50 + i * 8, 
            -50 - i * 8
          ],
          y: [
            -50 - i * 5, 
            dimensions.height + 50 + i * 5, 
            -50 - i * 5
          ],
          opacity: [0, 0.8 - i * 0.1, 0.6 - i * 0.1, 0],
          scale: [1 - i * 0.1, 0.8 - i * 0.05, 0.3 - i * 0.02, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeOut",
          delay: delay + i * 0.03,
        }}
        style={{
          filter: `blur(${i * 0.3}px)`,
          boxShadow: `0 0 ${8 - i}px ${4 - i}px rgba(219, 112, 247, ${0.6 - i * 0.08})`
        }}
      />
    ));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Meteor 1 - Large Purple/Pink Meteor with intense trail */}
      <div className="absolute">
        {/* Main meteor body */}
        <motion.div
          className="absolute w-8 h-8 rounded-full"
          style={{
            background: "radial-gradient(circle, #ff6ec7 0%, #9d4edd 40%, #7209b7 80%)",
            filter: "blur(1px)",
          }}
          initial={{ x: -100, y: -100, opacity: 0, scale: 0.5 }}
          animate={{
            x: [-100, dimensions.width + 100, -100],
            y: [-100, dimensions.height + 100, -100],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        
        {/* Bright core */}
        <motion.div
          className="absolute w-4 h-4 rounded-full"
          style={{
            background: "radial-gradient(circle, #ffffff 0%, #ff6ec7 60%)",
            left: "2px",
            top: "2px",
          }}
          initial={{ x: -100, y: -100, opacity: 0 }}
          animate={{
            x: [-100, dimensions.width + 100, -100],
            y: [-100, dimensions.height + 100, -100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* Outer glow */}
        <motion.div
          className="absolute w-16 h-16 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255, 110, 199, 0.3) 0%, rgba(157, 78, 221, 0.1) 60%, transparent 100%)",
            left: "-4px",
            top: "-4px",
          }}
          initial={{ x: -100, y: -100, opacity: 0 }}
          animate={{
            x: [-100, dimensions.width + 100, -100],
            y: [-100, dimensions.height + 100, -100],
            opacity: [0, 0.8, 0.6, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* Sparkle particles around meteor */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              boxShadow: "0 0 4px 2px rgba(255, 255, 255, 0.8)"
            }}
            initial={{ 
              x: -100 + Math.cos(i * 45 * Math.PI / 180) * 15, 
              y: -100 + Math.sin(i * 45 * Math.PI / 180) * 15, 
              opacity: 0 
            }}
            animate={{
              x: [
                -100 + Math.cos(i * 45 * Math.PI / 180) * 15, 
                dimensions.width + 100 + Math.cos(i * 45 * Math.PI / 180) * 15, 
                -100 + Math.cos(i * 45 * Math.PI / 180) * 15
              ],
              y: [
                -100 + Math.sin(i * 45 * Math.PI / 180) * 15, 
                dimensions.height + 100 + Math.sin(i * 45 * Math.PI / 180) * 15, 
                -100 + Math.sin(i * 45 * Math.PI / 180) * 15
              ],
              opacity: [0, Math.random() * 0.8 + 0.2, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Long trailing particles */}
        {createTrailParticles(20)}
      </div>

      {/* Meteor 2 - Medium Blue/Purple Meteor */}
      <div className="absolute">
        <motion.div
          className="absolute w-6 h-6 rounded-full"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, #3b82f6 50%, #1e40af 80%)",
            filter: "blur(0.5px)",
          }}
          initial={{ x: dimensions.width + 100, y: -100, opacity: 0 }}
          animate={{
            x: [dimensions.width + 100, -100, dimensions.width + 100],
            y: [-100, dimensions.height + 100, -100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeOut",
            delay: 3,
          }}
        />

        {/* Core */}
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-white"
          style={{ left: "1.5px", top: "1.5px" }}
          initial={{ x: dimensions.width + 100, y: -100, opacity: 0 }}
          animate={{
            x: [dimensions.width + 100, -100, dimensions.width + 100],
            y: [-100, dimensions.height + 100, -100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeOut",
            delay: 3,
          }}
        />

        {/* Trail particles */}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ 
              x: dimensions.width + 100 + i * 6, 
              y: -100 + i * 4, 
              opacity: 0,
              scale: 1 - i * 0.05 
            }}
            animate={{
              x: [
                dimensions.width + 100 + i * 6, 
                -100 - i * 6, 
                dimensions.width + 100 + i * 6
              ],
              y: [
                -100 + i * 4, 
                dimensions.height + 100 - i * 4, 
                -100 + i * 4
              ],
              opacity: [0, 0.7 - i * 0.05, 0],
              scale: [1 - i * 0.05, 0.8 - i * 0.03, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeOut",
              delay: 3 + i * 0.05,
            }}
            style={{
              filter: `blur(${i * 0.2}px)`,
              boxShadow: `0 0 ${6 - i * 0.2}px ${3 - i * 0.1}px rgba(59, 130, 246, ${0.5 - i * 0.03})`
            }}
          />
        ))}
      </div>

      {/* Meteor 3 - Small Pink/White Meteor */}
      <div className="absolute">
        <motion.div
          className="absolute w-5 h-5 rounded-full"
          style={{
            background: "radial-gradient(circle, #f472b6 0%, #ec4899 50%, #be185d 80%)",
          }}
          initial={{ x: -100, y: dimensions.height + 100, opacity: 0 }}
          animate={{
            x: [-100, dimensions.width + 100, -100],
            y: [dimensions.height + 100, -100, dimensions.height + 100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeOut",
            delay: 6,
          }}
        />

        {/* Bright white core */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{ left: "1.5px", top: "1.5px" }}
          initial={{ x: -100, y: dimensions.height + 100, opacity: 0 }}
          animate={{
            x: [-100, dimensions.width + 100, -100],
            y: [dimensions.height + 100, -100, dimensions.height + 100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeOut",
            delay: 6,
          }}
        />

        {/* Smaller trail */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-pink-300 to-pink-600"
            initial={{ 
              x: -100 - i * 5, 
              y: dimensions.height + 100 - i * 3, 
              opacity: 0,
              scale: 1 - i * 0.08 
            }}
            animate={{
              x: [
                -100 - i * 5, 
                dimensions.width + 100 + i * 5, 
                -100 - i * 5
              ],
              y: [
                dimensions.height + 100 - i * 3, 
                -100 + i * 3, 
                dimensions.height + 100 - i * 3
              ],
              opacity: [0, 0.6 - i * 0.05, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeOut",
              delay: 6 + i * 0.04,
            }}
            style={{
              filter: `blur(${i * 0.15}px)`,
              boxShadow: `0 0 4px 2px rgba(244, 114, 182, ${0.4 - i * 0.03})`
            }}
          />
        ))}
      </div>

      {/* Additional ambient sparkles */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={`ambient-${i}`}
          className="absolute w-0.5 h-0.5 rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: "0 0 2px 1px rgba(255, 255, 255, 0.6)"
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}