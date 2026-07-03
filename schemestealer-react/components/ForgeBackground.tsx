'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion';

function ForgeFlare() {
  const [flareActive, setFlareActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let flareStartTimeout: NodeJS.Timeout;
    let flareEndTimeout: NodeJS.Timeout;

    const endFlare = () => {
      setFlareActive(false);
      flareStartTimeout = setTimeout(startFlare, 60000 + Math.random() * 30000);
    };

    const startFlare = () => {
      setFlareActive(true);
      flareEndTimeout = setTimeout(endFlare, 8000);
    };
    
    flareStartTimeout = setTimeout(startFlare, 3000 + Math.random() * 2000);

    return () => {
      clearTimeout(flareStartTimeout);
      clearTimeout(flareEndTimeout);
    };
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      className="absolute bottom-[-10%] left-[-10%] right-[-10%] h-[40vh] pointer-events-none mix-blend-screen z-10 origin-bottom"
      style={{
        background: 'radial-gradient(ellipse at bottom center, rgba(255, 120, 0, 0.8) 0%, rgba(220, 60, 0, 0.4) 40%, transparent 70%)'
      }}
      animate={{ 
        scaleY: flareActive ? 1.1 : 0.6,
        scaleX: flareActive ? 1.05 : 1.0,
        opacity: flareActive ? 0.7 : 0.25
      }}
      transition={{ duration: 4, ease: 'easeInOut' }}
    />
  );
}

function CanvasEmbers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    setSize();
    window.addEventListener('resize', setSize);
    
    interface Ember {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      opacity: number;
      phase: number;
    }
    
    const embers: Ember[] = [];
    const createEmber = (initial: boolean = false): Ember => {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 1.5 + 1.0),
        size: Math.random() * 2.5 + 1,
        life: 0,
        maxLife: 200 + Math.random() * 200,
        opacity: 0,
        phase: Math.random() * Math.PI * 2
      };
    };
    
    for(let i = 0; i < 40; i++) embers.push(createEmber(true));
    
    let animId: number;
    let lastTime = performance.now();
    let isVisible = true; // For intersection observer later if needed

    const animate = (time: number) => {
      if (!isVisible) return;
      const dt = (time - lastTime) / 16.666;
      lastTime = time;
      
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'screen';
      
      embers.forEach((ember, i) => {
        ember.life += dt;
        ember.x += (ember.vx + Math.sin(ember.phase + ember.life * 0.05) * 0.5) * dt;
        ember.y += ember.vy * dt;
        
        const lifeRatio = ember.life / ember.maxLife;
        if (lifeRatio < 0.2) ember.opacity = lifeRatio * 5;
        else if (lifeRatio > 0.8) ember.opacity = (1 - lifeRatio) * 5;
        else ember.opacity = 1;
        
        if (ember.y < -10 || ember.life > ember.maxLife) {
          embers[i] = createEmber(false);
          return;
        }
        
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, ember.size);
        gradient.addColorStop(0, `rgba(255, 200, 50, ${ember.opacity})`);
        gradient.addColorStop(1, `rgba(255, 100, 0, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      animId = requestAnimationFrame(animate);
    };
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        isVisible = true;
        lastTime = performance.now();
        animId = requestAnimationFrame(animate);
      } else {
        isVisible = false;
        cancelAnimationFrame(animId);
      }
    });
    observer.observe(canvas);
    
    return () => {
      window.removeEventListener('resize', setSize);
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
}

export const ForgeBackground = React.memo(function ForgeBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      mouseX.set(window.innerWidth / 2);
      mouseY.set(window.innerHeight / 2);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const spotlightStyle = useMotionTemplate`
    radial-gradient(
      circle 600px at ${mouseX}px ${mouseY}px,
      rgba(218, 165, 32, 0.15),
      transparent 80%
    )
  `;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-void-black">
      {!shouldReduceMotion && (
        <>
          <motion.div 
            className="absolute top-[10%] left-[20%] w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] rounded-full blur-[100px] mix-blend-screen"
            style={{ background: 'radial-gradient(circle, rgba(220,50,0,0.8), transparent 70%)' }}
            animate={{
              x: ['0%', '20%', '-10%', '0%'],
              y: ['0%', '-20%', '10%', '0%'],
              scale: [1, 1.2, 0.9, 1],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="absolute bottom-[10%] right-[10%] w-[70vw] h-[70vw] sm:w-[50vw] sm:h-[50vw] rounded-full blur-[120px] mix-blend-screen"
            style={{ background: 'radial-gradient(circle, rgba(200,100,0,0.6), transparent 70%)' }}
            animate={{
              x: ['0%', '-20%', '10%', '0%'],
              y: ['0%', '20%', '-10%', '0%'],
              scale: [1, 1.1, 0.8, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />

          <ForgeFlare />
          {mounted && <CanvasEmbers />}

          {mounted && (
            <motion.div 
              className="absolute inset-0 z-10 opacity-60 mix-blend-color-dodge"
              style={{ background: spotlightStyle }}
            />
          )}
        </>
      )}

      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='69.2820323027551' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 17.32050807568877l-20 11.547005383792516L0 17.32050807568877V-5.773502691896258l20-11.547005383792516 20 11.547005383792516V17.32050807568877zm0 46.18802153517006l-20 11.547005383792516-20-11.547005383792516V40.4145188432738l20-11.547005383792516 20 11.547005383792516v23.09401076758503z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '40px'
        }}
      />
      
      <div 
        className="absolute inset-0 z-20 opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
});
