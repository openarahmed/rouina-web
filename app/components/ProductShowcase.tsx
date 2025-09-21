import Image from 'next/image';

export default function ProductShowcase() {
  return (
    <section className="bg-gray-900 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your Routine, Everywhere
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            Whether you're at your desk or on the go, Routina keeps your life in perfect sync across all your devices.
          </p>
        </div>

        {/* Image Showcase Container */}
        {/* 1. Reduced max-width from 6xl to 5xl to make the container smaller */}
        <div className="mt-16 max-w-5xl mx-auto sm:mt-20"> 
          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <Image
              src="https://img.freepik.com/free-vector/child-daily-routine-clocks_74855-6296.jpg?w=360"
              alt="Routina app screenshot on multiple devices"
              width={2432}
              height={1442}
              // 2. Added w-full and h-auto to ensure responsive scaling
              className="w-full h-auto rounded-md shadow-2xl ring-1 ring-gray-900/10" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}