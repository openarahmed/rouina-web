'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Firestore functions
import { db } from '../lib/firebaseConfig'; // Adjust the path if necessary
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// FAQ Item Component (No changes here)
function FaqItem({ faq, index, activeIndex, toggleFaq }: { faq: { question: string; answer: string }, index: number, activeIndex: number | null, toggleFaq: (index: number) => void }) {
  const isOpen = index === activeIndex;

  return (
    <div className="border-b border-[#2E284D] py-4">
      <button
        onClick={() => toggleFaq(index)}
        className="w-full flex justify-between items-start text-left focus:outline-none"
      >
        <span className={`text-lg font-medium transition-colors duration-300 ${
          isOpen ? 'text-[#6D46C1]' : 'text-[#D1D5DB]'
        }`}>
          {faq.question}
        </span>
        <span className="text-[#8B5CF6] flex-shrink-0 ml-4 mt-1">
          {isOpen ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
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
              <p className="text-[#9CA3AF] pr-8">{faq.answer}</p>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// FAQ Section Component
export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Form state (No changes here)
  const [submissionType, setSubmissionType] = useState<'Question' | 'Feature Request'>('Question');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // All of your original questions
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
    
  ];

  // Form submission handler (No changes here)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      alert('Please write your message before submitting.');
      return;
    }
    setIsSubmitting(true);
    setSubmissionStatus(null);
    try {
      await addDoc(collection(db, 'userSubmissions'), {
        type: submissionType,
        message: message,
        email: email || 'Not provided',
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setSubmissionStatus('success');
      setMessage('');
      setEmail('');
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="faq" className="bg-[#1A1429] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#F3F4F6] mb-12">
          Frequently Asked <span className="text-[#6D46C1]">Questions</span>
        </h2>
        
        <div className="mt-16 flex flex-col lg:flex-row gap-16 lg:gap-8">
            
            {/* ★★★ Left Column (Form): Now takes 1/3 of the width ★★★ */}
            <div className="w-full lg:w-1/3">
                <div className="p-8 bg-[#0D0915]/30 rounded-2xl border border-[#2E284D]">
                    <h3 className="text-2xl font-bold text-[#F3F4F6] text-center">
                        Still Have Questions?
                    </h3>
                    <p className="mt-2 text-center text-[#9CA3AF]">
                        Let us know how we can help.
                    </p>
                    <div className="mt-8">
                        {submissionStatus === 'success' ? (
                            <div className="text-center py-10 h-[280px] flex flex-col justify-center">
                                <h4 className="text-2xl font-bold text-green-400">Thank You!</h4>
                                <p className="mt-2 text-gray-300">Your feedback has been received.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="text-left space-y-6">
                                <div>
                                    
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setSubmissionType('Question')} className={`w-full p-3 rounded-full text-sm font-semibold transition-all ${submissionType === 'Question' ? 'bg-[#6D46C1] text-white' : 'bg-[#2E284D] text-[#9CA3AF] hover:bg-opacity-70'}`}>
                                            Ask a Question
                                        </button>
                                        <button type="button" onClick={() => setSubmissionType('Feature Request')} className={`w-full p-3 rounded-full text-sm font-semibold transition-all ${submissionType === 'Feature Request' ? 'bg-[#6D46C1] text-white' : 'bg-[#2E284D] text-[#9CA3AF] hover:bg-opacity-70'}`}>
                                            Request a Feature
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <textarea
                                        id="message" value={message} onChange={(e) => setMessage(e.target.value)}
                                        rows={4} required placeholder={submissionType === 'Question' ? "What's your question?" : "Describe the feature..."}
                                        className="w-full bg-[#1F1A2A] text-white p-3 rounded-md border border-[#4A3F74] focus:ring-2 focus:ring-[#6D46C1] focus:outline-none transition"
                                    />
                                </div>
                                <div>
                                    <input
                                        id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your Email (Optional, for a reply)"
                                        className="w-full bg-[#1F1A2A] text-white p-3 rounded-md border border-[#4A3F74] focus:ring-2 focus:ring-[#6D46C1] focus:outline-none transition"
                                    />
                                </div>
                                <button
                                    type="submit" disabled={isSubmitting}
                                    className="w-full bg-[#6D46C1] text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transition-all duration-300 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                                </button>
                                {submissionStatus === 'error' && <p className="text-red-500 text-center mt-2">Something went wrong. Please try again.</p>}
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* ★★★ Right Column (FAQs): Now takes 2/3 of the width ★★★ */}
            <div className="w-full lg:w-2/3">
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

        </div>
      </div>
    </section>
  );
}