import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Coffee, ArrowUpRight, Heart } from 'lucide-react';

const Footer = () => {
  // Configurable data
  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/yourusername', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com/yourusername', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/yourusername', icon: Linkedin },
  ];

  const workLinks = [
    { name: 'Folio V1', href: '#' },
    { name: 'Project Alpha', href: '#' },
    { name: 'Case Studies', href: '#' },
  ];

  // Apple-grade animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(10px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
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
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Column 1: Identity & BMC */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Let's build something <span className="text-white/40">impossible.</span>
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm">
              Crafting digital experiences with focus, precision, and a little bit of obsession.
            </p>
            
            {/* Buy Me A Coffee - Highlighted */}
            <motion.a
              href="https://buymeacoffee.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors cursor-pointer group"
            >
              <div className="p-1.5 bg-yellow-400/10 rounded-full text-yellow-300">
                <Coffee size={14} />
              </div>
              <span className="text-sm font-medium text-slate-200">Buy me a coffee</span>
              <ArrowUpRight size={14} className="text-slate-500 group-hover:text-white transition-colors" />
            </motion.a>
          </motion.div>

          {/* Column 2: Selected Works */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500">Selected Works</h4>
            <ul className="space-y-3">
              {workLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    {link.name}
                    <ArrowUpRight 
                      size={12} 
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-slate-500" 
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Socials */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500">Connect</h4>
            <div className="flex flex-col space-y-3">
              {socialLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-3 group"
                >
                  <platform.icon size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                  {platform.name}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar: Tech Stack & Copyright */}
        <motion.div 
          variants={itemVariants} 
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} Manish R Shetty</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-slate-500 font-mono">
              System Status: Operational
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Built with Next.js & Framer Motion</span>
            <Heart size={10} className="text-red-500/50 fill-red-500/50" />
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;