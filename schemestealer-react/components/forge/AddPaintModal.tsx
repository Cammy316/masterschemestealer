"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Paint } from '@/lib/types';
import paintsData from '@/lib/data/paints_groundtruth.json';
import { findTopAlternativeMatches } from '@/lib/colorMath';

interface AddPaintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Convert ground truth format to Paint type internally
const allPaints: Paint[] = (paintsData as any[]).map(p => ({
  id: p.paint_id,
  name: p.name,
  brand: p.brand,
  hex: p.hex,
  type: p.category || 'Base',
  colorFamily: p.color_family
}));

export default function AddPaintModal({ isOpen, onClose }: AddPaintModalProps) {
  const { inventory, addToInventory } = useAppStore();
  const [activeTab, setActiveTab] = useState<'search' | 'scan'>('search');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Scan State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanMatches, setScanMatches] = useState<Paint[] | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraError, setHasCameraError] = useState(false);

  // Search Logic
  const filteredPaints = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allPaints
      .filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query)
      )
      .slice(0, 50); // limit to 50 results for performance
  }, [searchQuery]);

  // Camera Logic
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen && activeTab === 'scan') {
      setHasCameraError(false);
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(err => {
        console.error("Camera error:", err);
        setHasCameraError(true);
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, activeTab]);

  const handleScan = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get center pixel data (10x10 area for average)
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const size = 10;
    const imageData = ctx.getImageData(centerX - size/2, centerY - size/2, size, size);
    
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      r += imageData.data[i];
      g += imageData.data[i+1];
      b += imageData.data[i+2];
    }
    const count = imageData.data.length / 4;
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
    
    const hex = '#' + [r, g, b].map(x => {
      const h = x.toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('');

    // Find closest matches
    const matches = findTopAlternativeMatches(hex);
    // map the match format back to standard paint
    const formattedMatches = matches.map((m: any) => ({
      id: m.paint_id,
      name: m.name,
      brand: m.brand,
      hex: m.hex,
      type: m.category || 'Base',
      colorFamily: m.color_family,
      deltaE: m.deltaE
    }));
    
    setTimeout(() => {
      setScanMatches(formattedMatches);
      setIsScanning(false);
    }, 800); // Artificial delay for effect
  };

  const handleAddPaint = (paint: Paint) => {
    addToInventory(paint);
  };

  const getPaintId = (p: Paint) => p.id || p.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20, transition: { duration: 0.1 } }}
            className="w-full max-w-lg bg-charcoal border border-brass rounded-lg overflow-hidden shadow-[0_0_40px_rgba(184,134,11,0.2)] flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-void-black">
              <h3 className="text-brass gothic-text tracking-widest text-lg text-shadow">ACQUISITION LOG</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 bg-void-black/50">
              <button 
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-3 text-xs tracking-widest font-bold uppercase transition-all ${activeTab === 'search' ? 'text-brass border-b-2 border-brass bg-brass/5' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Search Databanks
              </button>
              <button 
                onClick={() => { setActiveTab('scan'); setScanMatches(null); }}
                className={`flex-1 py-3 text-xs tracking-widest font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'scan' ? 'text-brass border-b-2 border-brass bg-brass/5' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Auspex Scan
                <span className="bg-red-900/30 text-red-500 text-[9px] px-1.5 py-0.5 rounded border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse uppercase tracking-widest">EXP</span>
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              
              {/* SEARCH TAB */}
              {activeTab === 'search' && (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Search by name or brand (e.g. Mephiston Red)" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-void-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-brass tech-text text-sm"
                  />
                  
                  {searchQuery.trim() === '' ? (
                    <div className="text-center py-12 text-gray-600 tech-text text-xs uppercase tracking-widest border border-dashed border-gray-800 rounded-lg">
                      AWAITING SEARCH QUERY...
                    </div>
                  ) : filteredPaints.length === 0 ? (
                    <div className="text-center py-12 text-red-500 tech-text text-xs uppercase tracking-widest border border-dashed border-red-900/30 rounded-lg">
                      NO RECORDS FOUND IN DATABANKS
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredPaints.map((paint) => {
                        const id = getPaintId(paint);
                        const isOwned = inventory.some(p => getPaintId(p) === id);
                        return (
                          <button
                            key={id}
                            disabled={isOwned}
                            onClick={() => handleAddPaint(paint)}
                            className={`w-full flex items-center p-3 rounded border transition-all ${
                              isOwned 
                                ? 'border-gray-800 bg-void-black opacity-50 cursor-not-allowed' 
                                : 'border-gray-700 bg-void-black/50 hover:border-brass hover:bg-charcoal group'
                            }`}
                          >
                            <div 
                              className="w-8 h-8 rounded-full border border-gray-600 mr-4 flex-shrink-0"
                              style={{ backgroundColor: paint.hex }}
                            />
                            <div className="text-left flex-1 min-w-0">
                              <div className={`font-bold truncate ${isOwned ? 'text-gray-500' : 'text-white group-hover:text-brass'}`}>
                                {paint.name}
                              </div>
                              <div className="text-[10px] text-gray-500 uppercase tracking-widest tech-text truncate">
                                {paint.brand}
                              </div>
                            </div>
                            <div>
                              {isOwned ? (
                                <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">OWNED</span>
                              ) : (
                                <span className="text-xs text-gray-400 group-hover:text-brass">ADD +</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SCAN TAB */}
              {activeTab === 'scan' && (
                <div className="space-y-4">
                  
                  <div className="bg-void-black/80 border border-imperial-gold/30 p-3 rounded text-xs text-gray-400 tech-text leading-relaxed">
                    <span className="text-imperial-gold font-bold">EXPERIMENTAL FEATURE:</span> Our software is optimized for painted miniatures, not glossy bottles. If the Auspex returns the wrong paint, please correct it via manual search! Every piece of data helps improve the Machine Spirit's accuracy.
                  </div>

                  {!scanMatches ? (
                    <div className="relative aspect-video bg-black rounded-lg border border-gray-800 overflow-hidden group">
                      {hasCameraError ? (
                        <div className="absolute inset-0 flex items-center justify-center text-red-500 tech-text text-xs uppercase tracking-widest p-6 text-center">
                          NO PICT-CAPTOR DEVICE DETECTED OR PERMISSION DENIED
                        </div>
                      ) : (
                        <>
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          
                          {/* Targeting UI */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-brass rounded-full opacity-50" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
                            {/* Corner brackets */}
                            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-brass opacity-70" />
                            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-brass opacity-70" />
                            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-brass opacity-70" />
                            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-brass opacity-70" />
                          </div>
                          
                          {isScanning && (
                            <motion.div 
                              className="absolute inset-0 bg-brass/20"
                              animate={{ opacity: [0, 0.5, 0] }}
                              transition={{ duration: 0.8, ease: "easeInOut", times: [0, 0.5, 1] }}
                            />
                          )}

                          <button
                            onClick={handleScan}
                            disabled={isScanning}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-void-black/80 border border-brass text-brass tech-text text-xs tracking-widest rounded hover:bg-brass/20 transition-colors backdrop-blur disabled:opacity-50"
                          >
                            {isScanning ? 'ANALYZING...' : 'CAPTURE COLOR'}
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-brass tech-text text-sm tracking-widest">TOP DETECTED MATCHES</h4>
                        <button 
                          onClick={() => setScanMatches(null)}
                          className="text-xs text-gray-500 hover:text-white uppercase tech-text"
                        >
                          RE-SCAN
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {scanMatches.slice(0, 3).map((paint, index) => {
                          const id = getPaintId(paint);
                          const isOwned = inventory.some(p => getPaintId(p) === id);
                          return (
                            <motion.button
                              key={id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              disabled={isOwned}
                              onClick={() => { handleAddPaint(paint); onClose(); }}
                              className={`w-full flex items-center p-3 rounded border transition-all ${
                                isOwned 
                                  ? 'border-gray-800 bg-void-black opacity-50 cursor-not-allowed' 
                                  : 'border-gray-700 bg-void-black/50 hover:border-brass hover:bg-charcoal group'
                              }`}
                            >
                              <div 
                                className="w-8 h-8 rounded-full border border-gray-600 mr-4 flex-shrink-0"
                                style={{ backgroundColor: paint.hex }}
                              />
                              <div className="text-left flex-1 min-w-0">
                                <div className={`font-bold truncate ${isOwned ? 'text-gray-500' : 'text-white group-hover:text-brass'}`}>
                                  {paint.name}
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest tech-text truncate flex gap-2">
                                  <span>{paint.brand}</span>
                                  <span className="text-imperial-gold/70">ΔE: {paint.deltaE?.toFixed(1)}</span>
                                </div>
                              </div>
                              <div>
                                {isOwned ? (
                                  <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">OWNED</span>
                                ) : (
                                  <span className="text-xs text-imperial-gold font-bold group-hover:text-brass">ADD +</span>
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <button onClick={() => setActiveTab('search')} className="text-xs text-gray-500 hover:text-white underline tech-text uppercase">
                          Not listed? Search manually
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
