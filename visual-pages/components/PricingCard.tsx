import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

export default function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  href,
  featured = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl p-8 ${
        featured
          ? 'bg-gradient-to-b from-blue-600 to-purple-600 text-white shadow-2xl scale-105'
          : 'bg-white dark:bg-gray-800 shadow-xl'
      }`}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
            MOST POPULAR
          </span>
        </div>
      )}
      
      <div className="mb-8">
        <h3 className={`text-2xl font-bold mb-2 ${featured ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          {name}
        </h3>
        <div className="flex items-baseline">
          <span className={`text-4xl font-bold ${featured ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            {price}
          </span>
          <span className={`ml-2 ${featured ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
            /{period}
          </span>
        </div>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
              featured ? 'text-green-300' : 'text-green-500'
            }`} />
            <span className={featured ? 'text-white' : 'text-gray-600 dark:text-gray-300'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>
      
      <Link
        href={href}
        className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
          featured
            ? 'bg-white text-blue-600 hover:bg-gray-100'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}