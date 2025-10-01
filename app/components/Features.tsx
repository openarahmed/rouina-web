// File: app/components/FeaturesSection.tsx

'use client';

import React from 'react';
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

// ★★★ Feature list expanded to 9 items ★★★
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
    {
        icon: HeartPulse,
        title: "Wellness Reminders",
        description: "Protect your well-being with reminders to take short breaks to prevent eye strain during long sessions."
    },
    {
        icon: WifiOff,
        title: "Offline Support",
        description: "The app works seamlessly offline and syncs all your data automatically when you're back online."
    },
    {
        icon: Coins,
        title: "Coin Reward System",
        description: "Stay motivated by earning virtual coins for your completed tasks and unlock new features."
    }
];

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
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
        // ★★★ Section background updated to your primary color ★★★
        <section id="features" className="bg-[#6D46C1] py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    {/* ★★★ Heading colors updated for better readability ★★★ */}
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                        Everything You Need to Succeed
                    </h2>
                    <p className="mt-4 text-lg text-purple-200">
                        Routina is packed with powerful, intuitive features designed to help you organize your life and achieve your goals.
                    </p>
                </div>

                {/* ★★★ Grid updated for 9 features ★★★ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                            // ★★★ Cards made more compact and cool ★★★
                            className="bg-gradient-to-br from-[#4c0e4c] to-[#5f1f5f] p-6 rounded-2xl shadow-xl shadow-black/20 text-center"
                        >
                            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-white/10">
                                <feature.icon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-purple-200 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}