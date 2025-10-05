"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';

// Correct import path for your Firebase config
import { db } from '../lib/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy } from "firebase/firestore";

// ★★★ 1. Fake data has been removed ★★★

// Type definition (remains the same)
interface Testimonial {
  id?: string;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
}

// Animation variants for the slider cards
const cardVariants: Variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.8 }),
    center: {
        zIndex: 1, x: 0, opacity: 1, scale: 1,
        transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
    },
    exit: (direction: number) => ({
        zIndex: 0, x: direction < 0 ? 300 : -300, opacity: 0, scale: 0.8,
        transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
    }),
};

const UltimateTestimonialSlider = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  
  // ★★★ 2. Testimonials state now starts as an empty array ★★★
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({ name: '', role: '', quote: '', rating: 0 });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(testimonialsRef, where('approved', '==', true), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTestimonials: Testimonial[] = [];
      querySnapshot.forEach((doc) => {
        fetchedTestimonials.push({ id: doc.id, ...doc.data() } as Testimonial);
      });
      
      // ★★★ 3. Update state with fetched data (even if it's empty) ★★★
      setTestimonials(fetchedTestimonials);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching testimonials: ", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0 || !formData.name || !formData.quote) {
      alert('Please fill in your name, review, and select a rating.');
      return;
    }
    setIsSubmitting(true);
    setSubmissionStatus(null);
    try {
      await addDoc(collection(db, "testimonials"), {
        ...formData,
        // Set to `true` if you want reviews to be live instantly
        // Set to `false` if you want to approve them first
        approved: true,
        createdAt: serverTimestamp()
      });
      setSubmissionStatus('success');
      setFormData({ name: '', role: '', quote: '', rating: 0 });
        setTimeout(() => setSubmissionStatus(null), 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // This logic is now inside the return statement
  const testimonialIndex = testimonials.length > 0 ? page % testimonials.length : 0;
  const currentTestimonial = testimonials.length > 0 ? testimonials[testimonialIndex] : null;

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-[#0D0915] relative overflow-hidden border-t">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4c0e4c]/30 rounded-full blur-3xl"></div>
    
        <div className="container mx-auto px-4 relative z-10">
            
            <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold text-[#F3F4F6] tracking-tight">
                    What Our <span className="text-[#6D46C1]">Users</span> Say
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-[#D1D5DB]">
                    Real feedback from people who use our app to achieve their goals.
                </p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-8">
                
                {/* ★★★ 4. New logic to handle loading and empty states ★★★ */}
                <div className="w-full lg:w-2/3">
                    <div className="relative h-[465px] w-full max-w-2xl mx-auto flex items-center justify-center">
                        {isLoading ? (
                            <div className="text-white text-lg">Loading Reviews...</div>
                        ) : currentTestimonial ? (
                            <>
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={page} custom={direction} variants={cardVariants}
                                        initial="enter" animate="center" exit="exit" drag="x"
                                        dragConstraints={{ left: 0, right: 0 }} dragElastic={1}
                                        onDragEnd={(_, { offset }) => {
                                            if (Math.abs(offset.x) > 50) paginate(offset.x > 0 ? -1 : 1);
                                        }}
                                        className="absolute h-full w-full p-8 flex flex-col justify-between bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl border border-[#6D46C1]/30 cursor-grab active:cursor-grabbing"
                                    >
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`h-5 w-5 ${i < currentTestimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor"/>
                                                ))}
                                            </div>
                                            <p className="mt-6 text-xl sm:text-2xl italic text-[#D1D5DB] leading-relaxed">
                                                &ldquo;{currentTestimonial.quote}&rdquo;
                                            </p>
                                        </div>
                                        <div className="flex items-center mt-8">
                                            {currentTestimonial.avatar ? (
                                                <Image className="h-16 w-16 rounded-full object-cover ring-2 ring-[#6D46C1]/50" src={currentTestimonial.avatar} alt={currentTestimonial.name} width={64} height={64} />
                                            ) : (
                                                <Image src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name)}&background=6D46C1&color=FFFFFF&bold=true`} width={64} height={64} alt={currentTestimonial.name} className="rounded-full h-16 w-16 ring-2 ring-[#6D46C1]/50" />
                                            )}
                                            <div className="ml-4">
                                                <p className="font-bold text-[#F3F4F6] text-xl">{currentTestimonial.name}</p>
                                                <p className="font-medium text-[#6D46C1]">{currentTestimonial.role}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                                <button onClick={() => paginate(-1)} className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-8 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-[#6D46C1]/50 transition-all">
                                    <ChevronLeft className="h-6 w-6 text-white" />
                                </button>
                                <button onClick={() => paginate(1)} className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-8 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-[#6D46C1]/50 transition-all">
                                    <ChevronRight className="h-6 w-6 text-white" />
                                </button>
                            </>
                        ) : (
                           <div className="text-center text-white p-8 bg-white/5 rounded-3xl">
                               <h3 className="text-2xl font-bold">No Reviews Yet</h3>
                               <p className="mt-2 text-[#D1D5DB]">Be the first to share your experience!</p>
                           </div>
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-1/3">
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl border border-[#6D46C1]/30 p-8 py-8 flex flex-col h-[465px] flex flex-col justify-center">
                        {submissionStatus === 'success' ? (
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-green-400 mb-2">Thank You!</h3>
                                <p className="text-gray-300">Your review is now live.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-white mb-6 text-center">Share Your Experience</h3>
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div className="flex justify-center space-x-2 cursor-pointer">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={28}
                                                className={`transition-colors ${(hoverRating || formData.rating) >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                                                fill={(hoverRating || formData.rating) >= star ? 'currentColor' : 'none'}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <textarea id="quote" name="quote" rows={3} required value={formData.quote} onChange={handleInputChange} placeholder="Your review..." className="w-full bg-[#1F1A2A] text-white p-3 rounded-md border border-[#6D46C1]/50 focus:ring-2 focus:ring-[#6D46C1] focus:outline-none"></textarea>
                                    </div>
                                    <div>
                                        <input type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Your name..." className="w-full bg-[#1F1A2A] text-white p-3 rounded-md border border-[#6D46C1]/50 focus:ring-2 focus:ring-[#6D46C1] focus:outline-none"/>
                                    </div>
                                    <div>
                                        <input type="text" id="role" name="role" value={formData.role} onChange={handleInputChange} placeholder="Your role (e.g., Student)..." className="w-full bg-[#1F1A2A] text-white p-3 rounded-md border border-[#6D46C1]/50 focus:ring-2 focus:ring-[#6D46C1] focus:outline-none"/>
                                    </div>
                                    <button
                                        type="submit" disabled={isSubmitting}
                                        className="w-full bg-[#6D46C1] text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition-all duration-300 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    {submissionStatus === 'error' && <p className="text-red-500 text-center mt-2">Something went wrong. Please try again.</p>}
                                </form>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};

export default UltimateTestimonialSlider;