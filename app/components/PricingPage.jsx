import { CheckCircle2 } from 'lucide-react';

export default function RoutinaPricing() {
  const plans = [
    {
      name: 'Free',
      description: 'For starters who want to try all the essential features.',
      price: '0',
      priceSuffix: 'Forever',
      ctaText: 'Start for Free',
      features: [
        'Access to all core features',
        'Unlimited routine creation',
        'Community support',
        'Ad-supported experience',
      ],
      isFeatured: false,
    },
    {
      name: 'Monthly',
      description: 'For individuals who want an ad-free, focused experience.',
      price: '25',
      priceSuffix: '/ month',
      ctaText: 'Go Monthly',
      features: [
        'Everything in the Free plan',
        'Completely Ad-free experience',
        'Advanced analytics & reports',
        'Access to curated job listings',
        'Daily AI-powered tips & tricks',
      ],
      isFeatured: false,
    },
    {
      name: 'Yearly',
      description: 'For those committed to growth, with significant savings.',
      price: '250',
      priceSuffix: '/ year',
      ctaText: 'Go Yearly',
      features: [
        'Everything in the Monthly plan',
        'Save 16% annually (2 months free)',
        'Completely Ad-free experience',
        'Priority customer support',
        'Access to curated job listings',
        'Daily AI-powered tips & tricks',
      ],
      isFeatured: true,
    },
  ];

  return (
    <section className="relative w-full bg-[#0D0915] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background elements using theme colors */}
      <div className="absolute top-20 -left-10 w-40 h-40 bg-[#6D46C1] rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute top-10 -right-10 w-40 h-40 bg-[#4c0e4c] rounded-full filter blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-normal text-[#F3F4F6]">
          Choose the right plan for you
        </h1>
        <p className="mt-6 text-lg text-[#D1D5DB] max-w-2xl mx-auto">
          Start building lasting habits today. Pick a plan that works for you.
        </p>
      </div>

      {/* Pricing Cards Section */}
      <div className="relative max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`
              relative rounded-2xl p-[1.5px]
              ${plan.isFeatured ? 'bg-gradient-to-br from-[#6D46C1] to-[#4c0e4c]' : 'bg-gradient-to-br from-[#2E284D] to-transparent'}
            `}
          >
            <div className="relative rounded-[15px] bg-[#1A1429] shadow-[#6D46C1]/10 shadow-2xl p-6 h-full flex flex-col">
              {plan.isFeatured && (
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                  <span className="bg-[#6D46C1] text-white text-xs font-bold px-4 py-1 rounded-full">
                    Save 16%
                  </span>
                </div>
              )}
              
              <div className="flex-grow flex flex-col">
                <h3 className="text-2xl font-semibold text-[#F3F4F6]">{plan.name}</h3>
                <p className="mt-2 text-[#9CA3AF] text-sm min-h-[56px]">{plan.description}</p>
                
                <div className="mt-6 flex items-start gap-x-1">
                  <span className="text-2xl font-medium text-[#9CA3AF] pt-1">৳</span>
                  <p className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F3F4F6]">{plan.price}</p>
                  {plan.priceSuffix && <span className="text-sm text-[#9CA3AF] self-end pb-1 ml-1">{plan.priceSuffix}</span>}
                </div>

                <a
                  href="#"
                  className={`
                    block w-full text-center mt-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105
                    ${plan.isFeatured
                      ? 'bg-[#6D46C1] text-white hover:bg-[#8B5CF6] shadow-lg shadow-[#6D46C1]/30'
                      : 'bg-transparent border border-[#2E284D] text-[#F3F4F6] hover:bg-[#6D46C1]/20 hover:border-[#6D46C1]'
                    }
                  `}
                >
                  {plan.ctaText}
                </a>
                
                <div className="border-t border-[#2E284D] my-8"></div>

                <ul className="space-y-3 text-[#D1D5DB] text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-x-3">
                      <CheckCircle2 className="h-5 w-5 text-[#6D46C1] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
