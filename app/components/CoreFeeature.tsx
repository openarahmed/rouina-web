import { ListTodo, Repeat, BarChart3, AppWindow, BellRing, Target } from 'lucide-react';

// ... (features array remains the same)

const features = [
  {
    name: 'Smart Task Management',
    description: 'Organize your day with an intuitive drag-and-drop interface. Prioritize tasks, set deadlines, and conquer your to-do list.',
    icon: ListTodo,
  },
  {
    name: 'Powerful Habit Tracking',
    description: 'Build lasting habits with our advanced tracker. Monitor your streaks, get motivated by your progress, and stay consistent.',
    icon: Repeat,
  },
  {
    name: 'Goal Setting & Milestones',
    description: 'Define your long-term goals and break them down into actionable milestones. Routina keeps you focused on the bigger picture.',
    icon: Target,
  },
  {
    name: 'Customizable Notifications',
    description: 'Never miss a beat. Set personalized reminders for tasks and habits to keep you on track throughout your busy day.',
    icon: BellRing,
  },
  {
    name: 'Insightful Analytics',
    description: 'Get detailed reports on your productivity. Understand where your time goes and how you can improve with our visual dashboards.',
    icon: BarChart3,
  },
  {
    name: 'Cross-Platform Sync',
    description: 'Seamlessly switch between your phone, tablet, and desktop. Your data is always in sync, wherever you are.',
    icon: AppWindow,
  },
];


export default function CoreFeatures() {
  return (
    <section id="features" className="bg-gradient-to-b from-white to-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base font-semibold leading-7 text-purple-600">Unleash Your Potential</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            A Better Way to Be Productive
          </h2>
          {/* FIXED a ' and ' here */}
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Routina isn&apos;t just another planner. It&apos;s a complete ecosystem of tools designed to help you organize your life and achieve your ambitions.
          </p>
        </div>

        {/* Features Card Grid */}
        <div className="mt-16 max-w-2xl mx-auto sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div 
                key={feature.name}
                className="flex flex-col p-8 bg-white border border-gray-200 rounded-2xl shadow-md
                           hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out"
              >
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600 text-white">
                    <feature.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-grow mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}