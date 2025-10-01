// File: app/components/Hero.tsx (আপনার ফাইল)

"use client"; // Framer Motion ব্যবহারের জন্য এটি Client Component হতে হবে

import Link from 'next/link';
import { PlayCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Image কম্পোনেন্ট import করুন

// ★★★ ফোন মকআপ ডেটা: এখানে ফোনের ছবি, পজিশন এবং অ্যানিমেশন ডিলে সেট করা হয়েছে ★★★
const phoneMockups = [
  {
    src: "/mockups/phone-1.png", // public/mockups/ ফোল্ডারে ছবি রাখুন
    position: "bottom-[-10%] sm:bottom-[-20%] left-1/2 -translate-x-1/2",
    rotation: "rotate-0",
    animationDelay: 0.1,
  },
  {
    src: "/mockups/phone-2.png",
    position: "top-[15%] left-[-10%] sm:left-[-5%]",
    rotation: "-rotate-[25deg]",
    animationDelay: 0.3,
  },
  {
    src: "/mockups/phone-3.png",
    position: "top-[15%] right-[-10%] sm:right-[-5%]",
    rotation: "rotate-[25deg]",
    animationDelay: 0.5,
  },
  {
    src: "/mockups/phone-4.png",
    position: "bottom-[-5%] left-[5%] sm:left-[15%]",
    rotation: "rotate-[15deg]",
    animationDelay: 0.7,
  },
  {
    src: "/mockups/phone-5.png",
    position: "bottom-[-5%] right-[5%] sm:right-[15%]",
    rotation: "-rotate-[15deg]",
    animationDelay: 0.9,
  },
];

// ★★★ অ্যানিমেশনের জন্য ভ্যারিয়েন্ট ★★★
const floatingAnimation = {
    float: (delay: number) => ({
      y: ["-8px", "8px"],
      transition: {
        delay,
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    }),
};

// ★★★ লরেল আইকন (SVG) ★★★
const LaurelIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C14.0823 21 16.0344 20.3458 17.6568 19.1213C19.2792 17.8968 20.5 16.1623 21 14.25M12 21C9.91773 21 7.96561 20.3458 6.34315 19.1213C4.72068 17.8968 3.5 16.1623 3 14.25M12 21V15M3 14.25C3 10 7 3 12 3C17 3 21 10 21 14.25" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export default function Hero() { // ★★★ ফাংশনের নাম 'Hero' রাখা হয়েছে ★★★
  return (
    <section className="relative bg-black min-h-screen flex flex-col items-center justify-center text-center py-24 sm:py-28 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,_85,_247,_0.15),_transparent_70%)] -z-0"></div>
      
      {/* Text Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-x-2 text-gray-400 text-sm font-semibold mb-6">
            <LaurelIcon />
            <span>200K+ Active Installs</span>
            <LaurelIcon />
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight"
          >
            Your path to <span className='text-[#6D46C1]'>getting things done</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 max-w-2xl mx-auto text-lg text-gray-400"
          >
            Packed with powerful tools that are easy to use, Routina helps you stay productive without the overwhelm.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex justify-center items-center gap-4 flex-wrap"
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-7 py-3 gap-2 border border-transparent text-base font-semibold rounded-full text-white bg-[#6D46C1] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Download className="w-5 h-5" /> Download App
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-7 py-3 gap-2 border border-white/20 text-base font-semibold rounded-full text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <PlayCircle className="w-5 h-5" /> Discover More
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ★★★ Floating Phone Mockups ★★★ */}
      <div className="absolute inset-0 w-full h-full z-0">
          {phoneMockups.map((phone, index) => (
              <motion.div
                  key={index}
                  className={`absolute w-[150px] sm:w-[250px] ${phone.position} ${phone.rotation}`}
                  custom={phone.animationDelay}
                  variants={floatingAnimation}
                  animate="float"
              >
                  <Image
                      src={phone.src}
                      alt={`Routina app mockup ${index + 1}`}
                      width={250}
                      height={500}
                      className="object-contain"
                      priority={index < 3}
                  />
              </motion.div>
          ))}
      </div>
    </section>
  );
}