import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Coffee, ArrowUpRight, Globe } from 'lucide-react';

const Footer = () => {
  // CONFIGURATION
  const portfolioUrl = "https://manishshetty.dev"; 
  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/ManishRShetty', icon: Github },
    { name: 'Twitter', href: 'https://x.com/ManishShetty017', icon: Twitter },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/manishrshetty/', icon: Linkedin },
  ];

  // ANIMATION VARIANTS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="relative mt-32 py-16 border-t border-white/5 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          
          {/* LEFT: Identity & BMC */}
          <motion.div variants={itemVariants} className="flex-1 space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Manish R Shetty
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm max-w-sm">
                Engineering student & Designer. Building interfaces that feel like magic.
              </p>
            </div>
            
            {/* Buy Me A Coffee - Premium Card Style */}
            <motion.a
              href="buymeacoffee.com/manishshetty"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-4 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl transition-colors cursor-pointer group"
            >
              <div className="p-2 bg-yellow-400/10 rounded-full text-yellow-300 group-hover:bg-yellow-400/20 transition-colors">
                <Coffee size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fuel the work</span>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Buy me a coffee</span>
              </div>
            </motion.a>
          </motion.div>

          {/* RIGHT: Portfolio & Socials */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6 md:text-right md:items-end">
            
            {/* Primary Action: Portfolio Link */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500">Explore</h4>
              <a 
                href={portfolioUrl}
                className="group inline-flex items-center gap-2 text-lg font-medium text-slate-200 hover:text-white transition-colors"
              >
                <Globe size={18} className="text-indigo-400 group-hover:rotate-12 transition-transform duration-500" />
                <span>View Portfolio</span>
                <ArrowUpRight 
                  size={18} 
                  className="text-slate-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" 
                />
              </a>
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500">Connect</h4>
              <div className="flex flex-col md:items-end gap-3">
                {socialLinks.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-2 group"
                  >
                    <span>{platform.name}</span>
                    <platform.icon size={14} className="text-slate-500 group-hover:text-indigo-300 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM: Minimal Copyright */}
        <motion.div 
          variants={itemVariants} 
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <span className="text-xs text-slate-600">
            © {new Date().getFullYear()} Manish R Shetty. All rights reserved.
          </span>
          <span className="text-[10px] font-mono text-slate-700 bg-white/[0.02] px-2 py-1 rounded border border-white/5">
            MANGALURU • INDIA
          </span>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;