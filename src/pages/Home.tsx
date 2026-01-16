import React, { useState, useRef } from 'react';

import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SearchModal from '../components/SearchModal';
import { BentoGrid, BentoGridItem } from '../components/BentoGrid';

import { AnimatedMonitor, AnimatedSettings, AnimatedDownload, AnimatedWrench, AnimatedBook, AnimatedSearch } from '../components/animated-icons';
import WindowsSkeleton from '../components/home/WindowsSkeleton';
import LinuxSkeleton from '../components/home/LinuxSkeleton';
import HardwareSkeleton from '../components/home/HardwareSkeleton';
import DriversSkeleton from '../components/home/DriversSkeleton';
import DocsSkeleton from '../components/home/DocsSkeleton';

const Home: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    // Initial container fade in
    tl.to(".hero-container", { opacity: 1, duration: 0.5 })
      
    // Logo pop
      .from(".hero-logo", { 
        y: 50, 
        opacity: 0, 
        ease: "back.out(1.7)", 
        duration: 0.8 
      })
      
    // Title animation - split feel without actual text splitting for now
      .from(".hero-title span", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        ease: "power4.out",
        duration: 1
      }, "-=0.4")
      
    // Subtitle reveal
      .to(".hero-subtitle", {
        opacity: 1,
        y: 0,
        x: 0, // Reset any implementation
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6")

    // Text fade up
      .to(".hero-text", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6")
      
    // Buttons pop in
      .to(".hero-buttons", {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, "-=0.4")
      
    // Bento Grid fade up
      .to(".bento-grid", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.2");

  }, { scope: containerRef });

  const guideCategories = [
    {
      title: 'Windows Guides',
      description: 'Comprehensive guides for Windows users',
      href: '/windows',
      icon: <AnimatedMonitor className="h-4 w-4 text-orange-400" />,
      header: <WindowsSkeleton />,
      className: "md:col-span-2",
    },
    {
      title: 'Linux Guides',
      description: 'Setup and optimization for Linux distributions',
      href: '/linux',
      icon: <AnimatedSettings className="h-4 w-4 text-orange-400" />,
      header: <LinuxSkeleton />,
      className: "md:col-span-1",
    },
    {
      title: 'Hardware Guides',
      description: 'Hardware upgrades and maintenance',
      href: '/hardware',
      icon: <AnimatedWrench className="h-4 w-4 text-orange-400" />,
      header: <HardwareSkeleton />,
      className: "md:col-span-1",
    },
    {
      title: 'Drivers & Software',
      description: 'Essential software and driver installation',
      href: '/drivers',
      icon: <AnimatedDownload className="h-4 w-4 text-orange-400" />,
      header: <DriversSkeleton />,
      className: "md:col-span-2",
    },
    {
      title: 'Guide Documentation',
      description: 'Comprehensive docs for everything',
      href: '/docs',
      icon: <AnimatedBook className="h-4 w-4 text-orange-400" />,
      header: <DocsSkeleton />,
      className: "md:col-span-3",
    },
  ];




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hero Section */}
        <div className="hero-container text-center mb-16 opacity-0"> {/* Changed to class selector */}
          <div className="hero-logo flex justify-center mb-8">
            <div className="w-20 h-20 bg-black/50 border border-orange-500/30 rounded-2xl flex items-center justify-center shadow-lg omen-glow relative p-3">
              <img 
                src="/HP_Omen_logo.svg" 
                alt="HP OMEN Logo" 
                className="w-full h-full object-contain"
              />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="hero-title text-5xl md:text-6xl font-bold text-white mb-6 overflow-hidden">
            <span className="inline-block relative">HP</span> <span className="text-orange-400 omen-text-glow inline-block relative">OMEN</span> 
            <span className="hero-subtitle text-gray-300 block text-3xl md:text-4xl mt-2 opacity-0">Documentation</span>
          </h1>
          
          <p className="hero-text text-xl text-gray-300 mb-8 max-w-3xl mx-auto opacity-0">
            Your comprehensive guide to getting the most out of your HP OMEN gaming laptop. 
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center opacity-0">
             <Link
              to="/quickstart"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 group"
            >
              <AnimatedBook className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Get Started
            </Link>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-200 group"
            >
              <AnimatedSearch className="mr-2 h-5 w-5 group-hover:text-orange-400" />
              Search Docs
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid mb-16 opacity-0">
          <BentoGrid className="max-w-4xl mx-auto">
            {guideCategories.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={item.className}
                href={item.href}
              />
            ))}
          </BentoGrid>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-800">
          <p>Unofficial HP OMEN Documentation Project</p>
        </div>
      </div>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
};

export default Home;
