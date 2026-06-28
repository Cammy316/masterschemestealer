'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function CosmicBackground() {
  const [starLayers] = React.useState(() => {
    return [
      {
        stars: [...Array(30)].map(() => ({
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          size: 2 + Math.random() * 2,
          brightness: 0.8 + Math.random() * 0.2,
          speed: 2 + Math.random() * 2,
          delay: Math.random() * 2,
        })),
        parallax: 1.5,
      },
      {
        stars: [...Array(50)].map(() => ({
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          size: 1.5 + Math.random() * 1,
          brightness: 0.6 + Math.random() * 0.3,
          speed: 3 + Math.random() * 2,
          delay: Math.random() * 2,
        })),
        parallax: 1,
      },
      {
        stars: [...Array(70)].map(() => ({
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          size: 1,
          brightness: 0.4 + Math.random() * 0.3,
          speed: 4 + Math.random() * 3,
          delay: Math.random() * 2,
        })),
        parallax: 0.5,
      },
    ];
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-void-black" />
      {starLayers.map((layer, layerIndex) => (
        <motion.div
          key={layerIndex}
          className="absolute inset-0"
          style={{ willChange: 'transform' }}
          animate={{
            x: [0, -5 * layer.parallax, 0, 5 * layer.parallax, 0],
            y: [0, -3 * layer.parallax, 0, 3 * layer.parallax, 0],
          }}
          transition={{
            duration: 20 + layerIndex * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {layer.stars.map((star, i) => (
            <motion.div
              key={`${layerIndex}-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: `radial-gradient(circle, rgba(255, 255, 255, ${star.brightness}), transparent)`,
                boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness * 0.8})`,
              }}
              animate={{
                opacity: [star.brightness * 0.6, star.brightness, star.brightness * 0.6],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: star.speed,
                repeat: Infinity,
                delay: star.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1)_0%,transparent_80%)] pointer-events-none" />
    </div>
  );
}
