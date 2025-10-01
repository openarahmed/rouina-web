import React from 'react';
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
    <section className="relative w-full bg-[#0a030a] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 -left-10 w-40 h-40 bg-[#6D46C1] rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute top-10 -right-10 w-40 h-40 bg-[#4c0e4c] rounded-full filter blur-3xl opacity-50"></div>

      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-normal">
          Choose the right plan for you
        </h1>
        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
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
              ${plan.isFeatured ? 'bg-gradient-to-br from-[#6D46C1] to-[#340a34]' : 'bg-gradient-to-br from-[#6D46C1]/40 to-transparent'}
            `}
          >
            <div className="relative rounded-[15px] bg-[#0a030a]/90 shadow-[#6D46C1]/20 shadow-lg p-6 h-full flex flex-col">
              {plan.isFeatured && (
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                  <span className="bg-[#6d46c1] text-white text-xs font-bold px-4 py-1 rounded-full">
                    Save 16%
                  </span>
                </div>
              )}
              
              <div className="flex-grow flex flex-col">
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <p className="mt-2 text-gray-400 text-sm min-h-[56px]">{plan.description}</p>
                
                <div className="mt-6 flex items-start gap-x-1">
                  <span className="text-2xl font-medium text-gray-400 pt-1">৳</span>
                  <p className="text-4xl sm:text-5xl font-bold tracking-tight">{plan.price}</p>
                   {plan.priceSuffix && <span className="text-sm text-gray-400 self-end pb-1 ml-1">{plan.priceSuffix}</span>}
                </div>

                <a
                  href="#"
                  className={`
                    block w-full text-center mt-8 py-3 rounded-lg font-semibold transition-all duration-300
                    ${plan.isFeatured
                      ? 'bg-transparent border border-white text-white hover:bg-[#6d46c1]'
                      : 'bg-[#6D46C1]/80 text-white hover:bg-[#6D46C1]'
                    }
                  `}
                >
                  {plan.ctaText}
                </a>
                
                <div className="border-t border-white/10 my-8"></div>

                <ul className="space-y-3 text-gray-300 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-x-3">
                      <CheckCircle2 className="h-5 w-5 text-[#6d46c1] flex-shrink-0 mt-0.5" />
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

