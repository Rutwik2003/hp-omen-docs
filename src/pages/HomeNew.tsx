import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SearchModal from '../components/SearchModal';
import { 
  Zap, 
  Monitor, 
  Settings, 
  HelpCircle, 
  Download, 
  Wrench, 
  ChevronRight, 
  Star, 
  Users, 
  BookOpen, 
  Gamepad2,
  Clock,
  TrendingUp,
  Search
} from 'lucide-react';

const Home: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const quickLinks = [
    {
      title: 'Quick Start Guide',
      description: 'Get your HP OMEN laptop set up and running in minutes',
      href: '/quickstart',
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      glow: 'omen-glow',
    },
    {
      title: 'Performance Optimization',
      description: 'Maximize your gaming and productivity performance',
      href: '/performance',
      icon: Gamepad2,
      color: 'from-red-500 to-orange-600',
      glow: 'omen-glow-red',
    },
    {
      title: 'Troubleshooting',
      description: 'Solve common issues and get back to gaming',
      href: '/troubleshooting',
      icon: HelpCircle,
      color: 'from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/30',
    },
  ];

  const guideCategories = [
    {
      title: 'Windows Guides',
      description: 'Comprehensive guides for Windows users',
      href: '/windows',
      icon: Monitor,
      topics: ['Gaming Setup', 'Driver Installation', 'BIOS Configuration', 'Cooling Management'],
      count: '12 guides'
    },
    {
      title: 'Linux Guides',
      description: 'Setup and optimization for Linux distributions',
      href: '/linux',
      icon: Settings,
      topics: ['Ubuntu Setup', 'Gaming on Linux', 'Driver Configuration', 'Thermal Management'],
      count: '8 guides'
    },
    {
      title: 'Hardware Guides',
      description: 'Hardware upgrades and maintenance',
      href: '/hardware',
      icon: Wrench,
      topics: ['RAM Upgrades', 'SSD Installation', 'Thermal Paste', 'Port Guide'],
      count: '15 guides'
    },
    {
      title: 'Drivers & Software',
      description: 'Essential software and driver installation',
      href: '/drivers',
      icon: Download,
      topics: ['OMEN Gaming Hub', 'Graphics Drivers', 'Audio Drivers', 'HP Support Assistant'],
      count: '6 guides'
    },
  ];

  const stats = [
    { label: 'Total Guides', value: '50+', icon: BookOpen },
    { label: 'Active Users', value: '2.5K+', icon: Users },
    { label: 'Community Rating', value: '4.8/5', icon: Star },
    { label: 'Last Updated', value: 'Aug 2025', icon: Clock },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-black/50 border border-orange-500/30 rounded-2xl flex items-center justify-center shadow-lg omen-glow relative p-3">
              <img 
                src="/HP_Omen_logo.svg" 
                alt="HP OMEN Logo" 
                className="w-full h-full object-contain"
              />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            HP <span className="text-orange-400 omen-text-glow">OMEN</span> 
            <span className="text-gray-300 block text-3xl md:text-4xl mt-2">Documentation</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Your comprehensive guide to getting the most out of your HP OMEN gaming laptop. 
            Find troubleshooting steps, performance tips, and setup instructions all in one place.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/quickstart"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-200"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Docs
            </button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="bg-black/50 border border-gray-700 rounded-lg p-6 text-center hover:border-orange-500/50 transition-all duration-200"
            >
              <stat.icon className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Start Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-8 text-center">
            Quick Start
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickLinks.map((link) => (
              <motion.div
                key={link.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={link.href}
                  className={`block p-6 bg-gradient-to-br ${link.color} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${link.glow} border border-white/10`}
                >
                  <link.icon className="h-12 w-12 text-white mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{link.title}</h3>
                  <p className="text-white/90 mb-4">{link.description}</p>
                  <div className="flex items-center text-white font-medium">
                    Start Guide
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Documentation Categories */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-8 text-center">
            Documentation Categories
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guideCategories.map((category) => (
              <motion.div
                key={category.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-black/50 border border-gray-700 rounded-lg p-6 hover:border-orange-500/50 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <category.icon className="h-8 w-8 text-orange-400 mr-3" />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                      <p className="text-gray-400 text-sm">{category.count}</p>
                    </div>
                  </div>
                  <Link
                    to={category.href}
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
                <p className="text-gray-300 mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></div>
                      {topic}
                    </div>
                  ))}
                </div>
                <Link
                  to={category.href}
                  className="inline-flex items-center mt-4 text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  View All Guides
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Community Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Join the <span className="text-orange-400">OMEN</span> Community
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Connect with other HP OMEN users, share tips, get help, and contribute to making this documentation even better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://discord.com/invite/omen-by-hp-750760232954888363"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Join Discord Community
                <Users className="ml-2 h-5 w-5" />
              </a>
              <a
                href="https://github.com/hp-omen-community"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-orange-500 hover:text-orange-400 transition-colors"
              >
                Contribute on GitHub
                <TrendingUp className="ml-2 h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="pt-8 border-t border-gray-700 text-center text-sm text-gray-400"
        >
          <p className="mb-2">
            This guide provides troubleshooting steps, performance tips, and setup instructions for HP OMEN devices.
          </p>
          <p className="mb-2">
            <strong>Disclaimer:</strong> This documentation is a community-driven, fan-made project and is not officially affiliated with HP Inc.
            All rights, trademarks, and copyrights belong to their respective owners. HP and OMEN are registered trademarks of HP Inc.
          </p>
          <p>
            Last updated {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
};

export default Home;
