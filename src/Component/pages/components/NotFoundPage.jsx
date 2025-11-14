import React, { useState, useEffect } from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 2 + 1
    }));
    setStars(newStars);
  }, []);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Floating astronaut */}
      <div
        className="absolute bottom-10 right-10 text-6xl transition-transform duration-300 ease-out md:text-8xl"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
        }}
      >
        🚀
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* 404 with glitch effect */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[180px] font-black text-white animate-bounce-slow">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[180px] font-black text-pink-500 opacity-70 animate-glitch-1">
            404
          </div>
          <div className="absolute inset-0 text-9xl md:text-[180px] font-black text-cyan-400 opacity-70 animate-glitch-2">
            404
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
          Houston, We Have a Problem
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-purple-100 mb-10 animate-fade-in-delayed leading-relaxed">
          The page you're looking for has drifted into the cosmic void. 
          It might have been moved, deleted, or never existed in this dimension.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-more-delayed">
          <button
            onClick={() => window.location.href = '/'}
            className="group flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-full font-semibold text-lg hover:bg-purple-50 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Back to Home
          </button>
          
          {/* <button
            onClick={() => window.location.href = '/search'}
            className="group flex items-center gap-2 px-8 py-4 bg-purple-500 text-white rounded-full font-semibold text-lg hover:bg-purple-400 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Search Site
          </button> */}
        </div>

        {/* Go back link */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 flex items-center gap-2 text-purple-200 hover:text-white transition-colors mx-auto group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Or go back to previous page
        </button>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes glitch-1 {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-3px, 3px);
          }
          40% {
            transform: translate(-3px, -3px);
          }
          60% {
            transform: translate(3px, 3px);
          }
          80% {
            transform: translate(3px, -3px);
          }
        }

        @keyframes glitch-2 {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(3px, -3px);
          }
          40% {
            transform: translate(3px, 3px);
          }
          60% {
            transform: translate(-3px, -3px);
          }
          80% {
            transform: translate(-3px, 3px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-glitch-1 {
          animation: glitch-1 2s infinite;
        }

        .animate-glitch-2 {
          animation: glitch-2 2s infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-fade-in-more-delayed {
          animation: fade-in 1s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
}