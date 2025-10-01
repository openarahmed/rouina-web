// File: app/components/UltimateTestimonialSlider.tsx

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';

const testimonialsData = [
    {
    quote: "Routina is not just an app; it's a paradigm shift in how I approach my day. The fluidity and design are simply unparalleled.",
    name: "Anika Tasnim",
    role: "Lead Product Designer",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8hUz-P7Cz2ZKn2DEN_EvFhjwmRiURX7r9TA&s",
    rating: 5,
  },
  {
    quote: "The performance is flawless. As a developer, I appreciate the fine-tuning that went into making this app so responsive and intuitive.",
    name: "Rohan Ahmed",
    role: "Principal Engineer",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8hUz-P7Cz2ZKn2DEN_EvFhjwmRiURX7r9TA&s",
    rating: 5,
  },
  {
    quote: "This is the first productivity tool that has actually increased my revenue. By structuring my goals, I'm closing deals faster.",
    name: "Sadia Islam",
    role: "Founder & CEO",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8hUz-P7Cz2ZKn2DEN_EvFhjwmRiURX7r9TA&s",
    rating: 5,
  },
];

const cardVariants = {
    enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1],
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1],
    },
  }),
};

const UltimateTestimonialSlider = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const testimonialIndex = page % testimonialsData.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const currentTestimonial = testimonialsData[testimonialIndex];

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-[#340a34] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6d46c1]/20 rounded-full blur-3xl"></div>
      
        <div className="container mx-auto px-4 relative z-10">
            {/* ★★★ SECTION TITLE UPDATED ★★★ */}
            <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                    What Our <span style={{ color: '#6D46C1' }}>Users</span> Say
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                    Real feedback from people who use Routina to achieve their goals.
                </p>
            </div>

            <div className="relative h-[450px] sm:h-[400px] w-full max-w-2xl mx-auto flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={cardVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset }) => {
                            if (Math.abs(offset.x) > 50) {
                                paginate(offset.x > 0 ? -1 : 1);
                            }
                        }}
                        className="absolute h-full w-full p-8 flex flex-col justify-between bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl border border-[#6d46c1]/30 cursor-grab active:cursor-grabbing"
                    >
                        <div>
                            <div className="flex items-center space-x-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`h-5 w-5 ${i < currentTestimonial.rating ? 'text-yellow-400' : 'text-gray-500'}`} fill="currentColor"/>
                                ))}
                            </div>
                            <p className="mt-6 text-xl sm:text-2xl italic text-gray-200 leading-relaxed">
                                "{currentTestimonial.quote}"
                            </p>
                        </div>
                        <div className="flex items-center mt-8">
                            <Image
                                className="h-16 w-16 rounded-full object-cover ring-2 ring-[#6d46c1]/50"
                                src={currentTestimonial.avatar}
                                alt={currentTestimonial.name}
                                width={64}
                                height={64}
                            />
                            <div className="ml-4">
                                <p className="font-bold text-white text-xl">{currentTestimonial.name}</p>
                                <p className="font-medium" style={{ color: '#6d46c1' }}>{currentTestimonial.role}</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                <button 
                    onClick={() => paginate(-1)} 
                    className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-12 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-[#6d46c1]/50 transition-all"
                >
                    <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button 
                    onClick={() => paginate(1)}
                    className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-12 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-[#6d46c1]/50 transition-all"
                >
                    <ChevronRight className="h-6 w-6 text-white" />
                </button>
            </div>
      </div>
    </section>
  );
};

export default UltimateTestimonialSlider;