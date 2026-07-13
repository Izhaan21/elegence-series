'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Do your fixtures work internationally?",
    answer: "Yes. All of our fixtures are equipped with universal voltage LED drivers (110V - 240V), making them fully compatible with electrical systems in North America, Europe, Asia, and Australia without the need for external transformers."
  },
  {
    question: "How long does shipping take?",
    answer: "In-stock items ship within 48 hours. Custom or made-to-order fixtures require a lead time of 4-6 weeks for manufacturing. Once dispatched, standard international insured shipping takes 5-10 business days depending on customs processing in your country."
  },
  {
    question: "Can I replace the LED bulbs?",
    answer: "Our fixtures utilize proprietary, integrated LED optical engines designed to last over 50,000 hours (roughly 15-20 years of normal use). Because they are integrated for superior optical performance, there are no 'bulbs' to change. If an array fails under warranty, we will replace the entire internal engine."
  },
  {
    question: "Are your fixtures dimmable?",
    answer: "Yes, all of our fixtures are fully dimmable. However, they require an ELV (Electronic Low Voltage) or TRIAC dimmer switch for smooth, flicker-free performance. Please consult with your electrician to ensure you have the correct switch installed."
  },
  {
    question: "Do you offer trade discounts for architects and designers?",
    answer: "Yes, we work closely with interior designers, architects, and developers globally. Please submit an inquiry through our Contact page with your firm's details to apply for our Trade Program."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <Navbar />
      <main className="bg-[#fcfbf9] min-h-screen text-lumen-black pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          
          <header className="mb-16 text-center">
            <p className="text-xs font-sans tracking-[0.3em] uppercase mb-4 text-lumen-gold">Client Support</p>
            <h1 className="font-serif text-4xl md:text-5xl text-lumen-black mb-6">Frequently Asked Questions</h1>
          </header>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`border border-lumen-border bg-white transition-all duration-300 ${isOpen ? 'shadow-sm' : ''}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full text-left px-6 py-6 flex items-center justify-between focus:outline-none"
                  >
                    <span className="font-serif text-lg md:text-xl text-lumen-black pr-8">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      size={20} 
                      className={`text-lumen-gold shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-6 pb-8 font-sans text-sm md:text-base text-lumen-muted leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
