'use client';

import { motion } from 'framer-motion';
import { 
    ListChecks, 
    BellRing, 
    BarChart3, 
    Sparkles, 
    Timer, 
    HeartPulse,
    Lock,
    Coins,
    WifiOff
} from 'lucide-react';

const features = [
    {
        icon: ListChecks,
        title: "Smart Task Management",
        description: "Create, edit, and schedule recurring tasks to stay on top of your goals with ease."
    },
    {
        icon: Sparkles,
        title: "AI-Powered Assistant",
        description: "Our AI detects conflicts, suggests better times for missed tasks, and provides smart coaching."
    },
    {
        icon: BarChart3,
        title: "Powerful Analytics",
        description: "Visualize your productivity with daily, weekly, and monthly graphs. Track your consistency with day streaks."
    },
    {
        icon: BellRing,
        title: "Intelligent Notifications",
        description: "From voice alerts to bedtime summaries, our smart notifications ensure you never miss a beat."
    },
    {
        icon: Timer,
        title: "Built-in Focus Tools",
        description: "Use the integrated Focus Timer and Stopwatch to dedicate uninterrupted time to important tasks."
    },
    {
        icon: Lock,
        title: "Secure Notepad",
        description: "Keep your thoughts private with a secure, PIN-protected notepad for all your sensitive information."
    },
    
];

const cardVariants = {
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
                        Everything You Need to Succeed
                    </h2>
                    <p className="mt-4 text-lg text-[#D1D5DB]">
                        Routina is packed with powerful, intuitive features designed to help you organize your life and achieve your goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
