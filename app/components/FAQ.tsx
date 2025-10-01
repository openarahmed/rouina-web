'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// FAQ Item Component
function FaqItem({ faq, index, activeIndex, toggleFaq }) {
  const isOpen = index === activeIndex;

  return (
    // ★★★ SPACING REDUCED HERE ★★★
    <div className="border-b border-[#6d46c1]/30 py-4">
      <button
        onClick={() => toggleFaq(index)}
        className="w-full flex justify-between items-start text-left focus:outline-none"
      >
        <span className={`text-lg font-medium transition-colors duration-300 ${
          isOpen ? 'text-[#6D46C1]' : 'text-gray-200'
        }`}>
          {faq.question}
        </span>
        <span className="text-[#6D46C1] flex-shrink-0 ml-4">
          {isOpen ? (
            <Minus className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
            <motion.div
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                    open: { opacity: 1, height: 'auto', marginTop: '16px' },
                    collapsed: { opacity: 0, height: 0, marginTop: '0px' },
                }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
                <p className="text-gray-400 pr-8">{faq.answer}</p>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// FAQ Section Component
export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What type of data do you collect?",
      answer: "We collect essential data to provide and improve our service, such as your name, email address, and the routines you create. We also collect anonymous usage data to understand how our app is used and how we can make it better."
    },
    {
      question: "How do you use my data?",
      answer: "Your data is used to personalize your experience, provide customer support, and improve our app's functionality. We never sell your personal data to third parties."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, protecting your data is our top priority. All personal data and routines are encrypted both in transit and at rest. We employ industry-standard security measures to safeguard your information."
    },
    {
      question: "Is there a free plan available?",
      answer: "Our 'Free' plan is more than a trial; it's free forever. It provides access to all essential features, allowing you to build routines and habits without any cost."
    },
    {
      question: "Can I change my plan later?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time directly from your account settings. Any changes will be prorated to ensure you only pay for what you use."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and popular mobile banking services. All payments are processed through a secure payment gateway to ensure your financial information is protected."
    },
    {
      question: "How do I create a new routine?",
      answer: "To create a new routine, simply navigate to the 'Routines' tab and tap the '+' icon. From there, you can name your routine, add specific tasks, set schedules, and customize reminders to fit your needs."
    },
    {
      question: "How does the 'curated job listings' feature work?",
      answer: "We aggregate relevant job postings from various top job portals and present them within the app. Our AI tailors the listings to your skills and preferences, saving you time and effort in your job search."
    },
    {
      question: "What is 'Personalized AI routine coaching'?",
      answer: "This is a premium feature available on our Yearly plan. Our AI analyzes your progress and habits to provide personalized tips, motivation, and suggestions to help you stay on track and achieve your goals more effectively."
    },
    {
      question: "Can I use the app on multiple devices?",
      answer: "Yes, your account and data are synced across all your devices. Simply log in with the same account on your phone, tablet, or computer to access your routines and progress seamlessly."
    }
  ];

  return (
    // ★★★ BACKGROUND COLOR CHANGED HERE ★★★
    <section id="faq" className="bg-black text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">
          Frequently Asked <span style={{ color: '#6D46C1' }}>Questions</span>
        </h2>
        <div>
          {faqs.map((faq, index) => (
            <FaqItem 
              key={index} 
              faq={faq} 
              index={index}
              activeIndex={activeIndex}
              toggleFaq={toggleFaq}
            />
          ))}
        </div>
      </div>
    </section>
  );
}