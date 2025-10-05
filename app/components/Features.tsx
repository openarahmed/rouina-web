'use client';

import { motion, Variants } from 'framer-motion';
import { 
    ListChecks, 
    BellRing, 
    BarChart3, 
    Sparkles, 
    Timer, 
    Lock,
    Briefcase,
    Lightbulb,
} from 'lucide-react';

// ★★★ Feature list has been reordered and simplified ★★★
const features = [
    {
        icon: ListChecks,
        title: "Daily Task Planner",
        description: "Easily organize your daily work. Set tasks that repeat so you never forget what's important."
    },
    {
        icon: Briefcase,
        title: "Find Your Job",
        description: "We find the best job openings for you from all over Bangladesh that match your skills."
    },
    {
        icon: Lightbulb,
        title: "Helpful Tips & Guides",
        description: "Get useful tips every day. Learn about new technology, get study help, and find career advice."
    },
    {
        icon: BarChart3,
        title: "See Your Progress",
        description: "Check how much work you are getting done. See your progress with simple charts and track daily habits."
    },
    {
        icon: Lock,
        title: "Private & Secure Notes",
        description: "Write down your personal thoughts safely. Lock your notes with a PIN so only you can see them."
    },
    {
        icon: BellRing,
        title: "Smart Break Reminder",
        description: "Protect your eyes and stay energized with automatic reminders to take scheduled breaks during long work sessions."
    },
    {
        icon: Timer,
        title: "Tools to Help You Focus",
        description: "Work without distractions. Use our timer and stopwatch to fully concentrate on your important tasks."
    },
    {
        icon: Sparkles,
        title: "Smart AI Helper",
        description: "Our smart technology helps you manage time better and gives helpful advice to improve your routine."
    },
];

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: "easeOut"
        }
    })
};

export default function FeaturesSection() {
    return (
        <section id="features" className="bg-[#1A1429] py-20 sm:py-28 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#4c0e4c]/20 rounded-full blur-3xl"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F3F4F6]">
                        Everything You <span className='text-[#6D46C1]'>Need to</span> Succeed
                    </h2>
                    <p className="mt-4 text-lg text-[#D1D5DB]">
                        Routina is packed with powerful, intuitive features designed to help you organize your life and achieve your goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                            className="bg-[#0D0915]/50 border border-[#2E284D] backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center transition-all duration-300 hover:border-[#6D46C1]/50 hover:-translate-y-1"
                        >
                            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-[#6D46C1]/10">

                                <feature.icon className="h-7 w-7 text-[#8B5CF6]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#F3F4F6] mb-2">{feature.title}</h3>
                            <p className="text-[#9CA3AF] text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}