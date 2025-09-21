// File: app/components/Hero.tsx

import Link from 'next/link';
import { PlayCircle } from 'lucide-react';

export default function Hero() {
  return (
    // This is the only line that changed:
    <section className="relative flex items-center min-h-screen overflow-hidden bg-gradient-to-br from-white via-purple-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Column: Content */}
          <div className="text-center lg:text-left mb-12 lg:mb-0">
            {/* Badge */}
            <span className="inline-block bg-purple-100 text-purple-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
              ✨ Routina Web is Here!
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tighter">
              Organize Your Life with <span className="text-purple-600">Smart Routines</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 max-w-xl lg:max-w-md mx-auto lg:mx-0 text-lg text-gray-700">
              Transform chaos into consistency. Routina helps you build powerful habits, manage your tasks effortlessly, and achieve your goals with clarity.
            </p>

            {/* Call to Action Buttons */}
            <div className="mt-10 flex justify-center lg:justify-start items-center gap-4 flex-wrap">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl shadow-lg"
              >
                Start Free Today
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-8 py-3 border border-purple-200 text-base font-medium rounded-lg text-purple-700 bg-white hover:bg-purple-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
              >
                <PlayCircle className="w-5 h-5 mr-2" /> Watch Demo
              </Link>
            </div>
          </div>

          {/* Right Column: Image Placeholder */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-lg lg:max-w-none lg:w-[550px] aspect-[16/10] bg-gradient-to-br from-purple-200 to-indigo-300 rounded-2xl shadow-2xl overflow-hidden
                            flex items-center justify-center text-white text-xl font-bold p-8
                            transform rotate-3 scale-105 hover:rotate-0 hover:scale-100 transition-transform duration-500 ease-out">
              <span className="absolute inset-0 bg-grid-small-white/[0.2] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
              <span className="absolute inset-0 flex items-center justify-center text-purple-800 text-sm md:text-base font-semibold text-center leading-relaxed p-4">
                Imagine your beautifully designed app here, showcasing its key features.
              </span>
            </div>
            <div className="hidden lg:block absolute -bottom-16 -right-16 w-64 h-64 bg-purple-300 opacity-20 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
            <div className="hidden lg:block absolute -top-16 -left-16 w-72 h-72 bg-indigo-300 opacity-20 rounded-full mix-blend-multiply filter blur-xl animation-delay-2000 animate-blob" />
          </div>
        </div>
      </div>
    </section>
  );
}