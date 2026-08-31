import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import InfoPage from '../../components/info/InfoPage';

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Standard delivery takes 3–5 business days and is free on orders over $50. Express and next-day options are available at checkout.',
  },
  {
    q: 'What is your return policy?',
    a: 'You have 30 days from delivery to return or exchange any unworn item with tags attached. Returns are free.',
  },
  {
    q: 'How do I find my size?',
    a: 'Check our size guide for body measurements for shirts, pants and shoes. When between sizes, we recommend sizing up for a relaxed fit.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: "Orders are processed quickly. Contact us as soon as possible and we'll do our best to adjust or cancel before dispatch.",
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship worldwide. Delivery times and costs vary by destination and are shown at checkout.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <InfoPage
      title="Frequently Asked Questions"
      crumb="FAQ"
      intro="Everything you need to know about orders, shipping, returns and sizing. Can't find your answer? Get in touch via our contact page."
    >
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-display text-base font-bold text-neutral-900 sm:text-lg">
                  {f.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-neutral-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="pb-5 pr-6 text-[15px] leading-relaxed text-neutral-600 animate-fade-in">
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </InfoPage>
  );
}
