import React from 'react';
import { Volume2, Wifi, ExternalLink } from 'lucide-react';
import { AnimatedSettings, AnimatedMonitor, AnimatedShield, AnimatedDownload } from '../components/animated-icons';

const DriversAndSoftware: React.FC = () => {
  const essentialDrivers = [
    {
      category: 'System Management',
      icon: AnimatedSettings,
      color: 'bg-blue-500',
      drivers: [
        {
          name: 'HP Support Assistant',
          description: 'Automatic driver updates and system diagnostics',
          version: 'Latest',
          url: 'https://support.hp.com/us-en/help/hp-support-assistant',
          priority: 'Critical',
        },
        {
          name: 'OMEN Gaming Hub',
          description: 'Performance monitoring, RGB control, and system optimization',
          version: 'Latest',
          url: 'ms-windows-store://pdp/?productid=9NRDR7P8S58S',
          priority: 'Critical',
        },
        {
          name: 'HP System Software Manager',
          description: 'Core system software and BIOS updates',
          version: 'Latest',
          url: 'https://support.hp.com/drivers',
          priority: 'Important',
        },
      ],
    },
    {
      category: 'Graphics Drivers',
      icon: AnimatedMonitor,
      color: 'bg-green-500',
      drivers: [
        {
          name: 'NVIDIA GeForce Drivers',
          description: 'Latest drivers for RTX/GTX graphics cards',
          version: 'Game Ready Driver',
          url: 'https://www.nvidia.com/Download/index.aspx',
          priority: 'Critical',
        },
        {
          name: 'NVIDIA GeForce Experience',
          description: 'Game optimization and driver management',
          version: 'Latest',
          url: 'https://www.nvidia.com/en-us/geforce/geforce-experience/',
          priority: 'Recommended',
        },
        {
          name: 'AMD Radeon Software',
          description: 'AMD graphics drivers and Radeon software suite',
          version: 'Latest',
          url: 'https://www.amd.com/en/support',
          priority: 'Critical',
        },
        {
          name: 'Intel Graphics Driver',
          description: 'Integrated graphics driver for Intel processors',
          version: 'DCH Driver',
          url: 'https://downloadcenter.intel.com/product/80939/Graphics',
          priority: 'Important',
        },
      ],
    },
    {
      category: 'Audio Drivers',
      icon: Volume2,
      color: 'bg-purple-500',
      drivers: [
        {
          name: 'Realtek High Definition Audio',
          description: 'Primary audio driver for built-in speakers and jack',
          version: 'Latest',
          url: 'https://www.realtek.com/en/component/zoo/category/pc-audio-codecs-high-definition-audio-codecs-software',
          priority: 'Important',
        },
        {
          name: 'Bang & Olufsen Audio Control',
          description: 'Premium audio enhancement software',
          version: 'Latest',
          url: 'https://support.hp.com/drivers',
          priority: 'Recommended',
        },
        {
          name: 'DTS Audio Enhancement',
          description: 'Spatial audio and sound enhancement',
          version: 'Latest',
          url: 'https://support.hp.com/drivers',
          priority: 'Optional',
        },
      ],
    },
    {
      category: 'Network Drivers',
      icon: Wifi,
      color: 'bg-yellow-500',
      drivers: [
        {
          name: 'Intel Wi-Fi Drivers',
          description: 'Wireless network adapter drivers',
          version: 'Latest',
          url: 'https://downloadcenter.intel.com/product/59485/Wireless-Networking',
          priority: 'Critical',
        },
        {
          name: 'Realtek Ethernet Driver',
          description: 'Wired network connection driver',
          version: 'Latest',
          url: 'https://www.realtek.com/en/component/zoo/category/network-interface-controllers-10-100-1000m-gigabit-ethernet-pci-express-software',
          priority: 'Important',
        },
        {
          name: 'Bluetooth Drivers',
          description: 'Bluetooth connectivity and device pairing',
          version: 'Latest',
          url: 'https://support.hp.com/drivers',
          priority: 'Important',
        },
      ],
    },
  ];

  const utilitySoftware = [
    {
      name: 'MSI Afterburner',
      description: 'GPU overclocking and monitoring tool',
      category: 'Performance',
      url: 'https://www.msi.com/Landing/afterburner',
      features: ['GPU overclocking', 'Real-time monitoring', 'Custom fan curves', 'On-screen display'],
    },
    {
      name: 'HWiNFO64',
      description: 'Comprehensive hardware monitoring and diagnostics',
      category: 'Monitoring',
      url: 'https://www.hwinfo.com/',
      features: ['Hardware sensors', 'Real-time monitoring', 'Logging capabilities', 'System reports'],
    },
    {
      name: 'CPU-Z & GPU-Z',
      description: 'Hardware information and validation tools',
      category: 'Information',
      url: 'https://www.cpuid.com/softwares/cpu-z.html',
      features: ['CPU details', 'Memory information', 'GPU specifications', 'Validation database'],
    },
    {
      name: 'CrystalDiskInfo',
      description: 'SSD/HDD health monitoring and SMART data',
      category: 'Storage',
      url: 'https://crystalmark.info/en/software/crystaldiskinfo/',
      features: ['Drive health status', 'Temperature monitoring', 'SMART attributes', 'Alerts and warnings'],
    },
    {
      name: 'DDU (Display Driver Uninstaller)',
      description: 'Complete graphics driver removal tool',
      category: 'Maintenance',
      url: 'https://www.guru3d.com/files-details/display-driver-uninstaller-download.html',
      features: ['Clean driver removal', 'Safe mode operation', 'Registry cleanup', 'Multiple GPU support'],
    },
    {
      name: 'Revo Uninstaller',
      description: 'Advanced software removal with registry cleanup',
      category: 'Maintenance',
      url: 'https://www.revouninstaller.com/',
      features: ['Deep scan removal', 'Registry cleanup', 'Leftover file removal', 'Forced uninstall'],
    },
  ];

  const installationGuide = [
    {
      step: 'Download HP Support Assistant',
      description: 'Start with the official HP tool for automatic driver detection',
      actions: [
        'Visit HP Support website',
        'Download HP Support Assistant',
        'Run full system scan',
        'Install all critical updates',
      ],
    },
    {
      step: 'Install Graphics Drivers',
      description: 'Update to latest graphics drivers for optimal gaming performance',
      actions: [
        'Identify your GPU (NVIDIA/AMD)',
        'Download latest drivers from manufacturer',
        'Uninstall old drivers with DDU if needed',
        'Install new drivers with clean installation',
      ],
    },
    {
      step: 'Update Audio and Network',
      description: 'Ensure connectivity and audio drivers are current',
      actions: [
        'Update audio drivers from HP Support',
        'Install latest Wi-Fi drivers',
        'Test Bluetooth connectivity',
        'Configure audio enhancements',
      ],
    },
    {
      step: 'Install Utilities',
      description: 'Add monitoring and optimization tools',
      actions: [
        'Install OMEN Gaming Hub',
        'Add performance monitoring tools',
        'Configure automatic updates',
        'Create system restore point',
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'Important': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'Recommended': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'Optional': return 'bg-gray-700 text-gray-300 border border-gray-600';
      default: return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header - Enhanced for mobile */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Drivers & Software</h1>
        <p className="text-base sm:text-lg text-gray-300">
          Essential drivers and software for your HP OMEN laptop. Keep your system up-to-date 
          for optimal performance and compatibility.
        </p>
      </div>

      {/* Essential Drivers - Enhanced for mobile */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Essential Drivers</h2>
        <div className="space-y-6 sm:space-y-8">
          {essentialDrivers.map((category, index) => (
            <div key={index} className="bg-black/50 border border-gray-700 rounded-lg p-6 hover:border-orange-500/50 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center">
                  <category.icon className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{category.category}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.drivers.map((driver, driverIndex) => (
                  <div key={driverIndex} className="border border-gray-600 rounded-lg p-4 bg-gray-800/50">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-white">{driver.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(driver.priority)}`}>
                        {driver.priority}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{driver.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Version: {driver.version}</span>
                      <a
                        href={driver.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        <AnimatedDownload className="h-3 w-3 mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Installation Guide */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Installation Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {installationGuide.map((guide, index) => (
            <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center text-sm font-bold border border-orange-500/30">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-white">{guide.step}</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">{guide.description}</p>
              <ul className="space-y-2">
                {guide.actions.map((action, actionIndex) => (
                  <li key={actionIndex} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-300">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Utility Software */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Recommended Utility Software</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilitySoftware.map((software, index) => (
            <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{software.name}</h3>
                <span className="px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">
                  {software.category}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4">{software.description}</p>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Features:</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  {software.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <span className="text-orange-400">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={software.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Visit Website
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Driver Update Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-white mb-2">Do's</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>✓ Create system restore point before updates</li>
              <li>✓ Use HP Support Assistant for HP-specific drivers</li>
              <li>✓ Download drivers directly from manufacturer websites</li>
              <li>✓ Read release notes before installing</li>
              <li>✓ Update graphics drivers regularly for gaming</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Don'ts</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>✗ Install beta drivers on production systems</li>
              <li>✗ Use driver update software from unknown sources</li>
              <li>✗ Skip compatibility checks</li>
              <li>✗ Install drivers without proper uninstall</li>
              <li>✗ Update all drivers at once without testing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Support */}
      <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AnimatedShield className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Driver Issues?</h3>
            <p className="text-gray-300 mb-4">
              If you encounter issues after driver installation, try these recovery steps:
            </p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Boot into Safe Mode and uninstall problematic driver</li>
              <li>• Use System Restore to revert to previous working state</li>
              <li>• Download and use DDU to completely remove graphics drivers</li>
              <li>• Contact HP Support for BIOS-related driver issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriversAndSoftware;
