// app/(main)/about/page.tsx

import Image from 'next/image';
import { Target, Lightbulb } from 'lucide-react';

const AboutUsPage = () => {
    return (
        <div className="bg-[#0D0915] text-white">
            {/* ★★★ Hero Section ★★★ */}
            <div className="relative text-center py-20 md:py-32">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4c0e4c]/20 rounded-full blur-3xl -z-0"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#F3F4F6]">
                        We&apos;re on a Mission to <span className="text-[#6D46C1]">Organize Ambition</span>.
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-[#D1D5DB]">
                        Routina was born from a simple idea: to create a tool that helps students and professionals in Bangladesh reclaim their time, focus on what matters, and achieve their biggest goals.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-20 sm:pb-28">
                
                {/* ★★★ Our Story Section ★★★ */}
                <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto mb-24">
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl font-bold text-[#F3F4F6] mb-4">Our Story</h2>
                        <div className="space-y-4 text-[#9CA3AF]">
                            <p>
                                The journey of Routina started not in a boardroom, but from the everyday chaos of a student&apos;s life. Juggling classes, assignments, job preparations, and personal goals felt like an endless battle against the clock. Existing productivity tools were either too simple or too complex, and none truly understood the unique challenges faced here in Bangladesh.
                            </p>
                            <p>
                                I decided to build the solution I wished I had: a single, smart app that does more than just list tasks. An app that provides guidance, tracks progress, and even helps you find your next career opportunity. That&apos;s how Routina was born—a tool built with passion, for our community.
                            </p>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <Image 
                            src="https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="A workspace with a laptop and notes"
                            width={600}
                            height={400}
                            className="rounded-2xl object-cover shadow-2xl"
                        />
                    </div>
                </div>

                {/* ★★★ Our Mission & Vision Section ★★★ */}
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-24 text-center md:text-left">
                    <div className="bg-[#1A1429] p-8 rounded-2xl border border-[#2E284D]">
                        <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-[#6D46C1]/10">
                            <Target className="h-7 w-7 text-[#8B5CF6]" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Our Mission</h3>
                        <p className="text-[#9CA3AF]">To provide a powerful, all-in-one productivity tool that empowers our users to conquer their daily tasks and build a successful future.</p>
                    </div>
                    <div className="bg-[#1A1429] p-8 rounded-2xl border border-[#2E284D]">
                        <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-[#6D46C1]/10">
                            <Lightbulb className="h-7 w-7 text-[#8B5CF6]" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Our Vision</h3>
                        <p className="text-[#9CA3AF]">To become the most trusted companion for every student and professional in Bangladesh on their journey to personal and career growth.</p>
                    </div>
                </div>

                {/* ★★★ Meet the Founder Section ★★★ */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#F3F4F6] mb-8">Meet the Founder</h2>
                    <Image 
                        // Replace with your own image URL
                        src="https://scontent.fdac99-1.fna.fbcdn.net/v/t39.30808-6/505412324_4113595312290564_6383082900356941881_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=tpTBcSOXIGQQ7kNvwF342hQ&_nc_oc=AdkmhHy02OACb5jXSS3IX1Lqb92Qm8Kg0YcYvOM4H6_3RjuKczG803zHdn6WPmD4W_8VgfpH_KhSIDZ-sTELGJMw&_nc_zt=23&_nc_ht=scontent.fdac99-1.fna&_nc_gid=uT-9F8DzkhIjZbyW5lw6Qg&oh=00_AfdGlOqYCeE-6FlHj_1m2qbzgM1aRusS42X1qRpSP3KXKw&oe=68E7883E"
                        alt="Founder of Routina"
                        width={128}
                        height={128}
                        className="rounded-full mx-auto mb-4 ring-4 ring-[#6D46C1]/50"
                    />
                    <h3 className="text-2xl font-semibold text-white">Shakil Ahmed</h3>
                    <p className="text-[#8B5CF6] mb-2">Founder & Developer</p>
                    <p className="text-[#9CA3AF]">
                        &quot;I believe that with the right tools, everyone has the potential to achieve great things. I built Routina to be that tool for you. Let&apos;s grow together.&quot;
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
