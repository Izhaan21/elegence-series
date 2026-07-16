'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createMessage } from '@/lib/firestore';
import { Loader2, CheckCircle, Mail } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    setStatus('loading');
    setErrorMsg('');

    try {
      await createMessage({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setStatus('success');
      setForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
      setErrorMsg('Failed to send message. Please try again or email us directly.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-[#fcfbf9] min-h-screen text-lumen-black pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <header className="text-center mb-16">
            <p className="text-xs font-sans tracking-[0.3em] uppercase mb-4 text-lumen-gold">Client Support</p>
            <h1 className="font-serif text-4xl md:text-6xl text-lumen-black leading-tight mb-6">Contact Us</h1>
            <p className="font-sans text-lumen-muted max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              Our dedicated client service team is available to assist you with product inquiries, customization requests, and order support.
            </p>
          </header>

          <div className="bg-white p-8 md:p-12 shadow-sm border border-lumen-border relative overflow-hidden">
            
            {status === 'success' ? (
              <div className="text-center py-12 animate-fadeIn">
                <div className="w-16 h-16 bg-lumen-success-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} strokeWidth={1.5} className="text-lumen-success" />
                </div>
                <h2 className="font-serif text-2xl mb-4">Message Sent</h2>
                <p className="font-sans text-lumen-muted mb-8 max-w-md mx-auto">
                  Thank you for reaching out. A member of our client service team will get back to you within 24-48 business hours.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="btn-outline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status === 'error' && (
                  <div className="bg-lumen-error-light border border-lumen-error/30 text-lumen-error px-4 py-3 text-sm rounded-sm mb-6">
                    {errorMsg}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-sans text-xs tracking-wider uppercase mb-2">Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border-b border-lumen-border bg-transparent pb-2 text-sm focus:outline-none focus:border-lumen-black transition-colors" 
                      placeholder="Your full name" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-sans text-xs tracking-wider uppercase mb-2">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border-b border-lumen-border bg-transparent pb-2 text-sm focus:outline-none focus:border-lumen-black transition-colors" 
                      placeholder="your@email.com" 
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="inquiry" className="block font-sans text-xs tracking-wider uppercase mb-2">Subject</label>
                  <select 
                    id="inquiry" 
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border-b border-lumen-border bg-transparent pb-2 text-sm focus:outline-none focus:border-lumen-black transition-colors cursor-pointer"
                  >
                    <option>General Inquiry</option>
                    <option>Order Status</option>
                    <option>Trade & Architecture</option>
                    <option>Custom Modification</option>
                    <option>Press</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block font-sans text-xs tracking-wider uppercase mb-2">Message *</label>
                  <textarea 
                    id="message" 
                    rows="5" 
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-lumen-border bg-transparent p-4 text-sm focus:outline-none focus:border-lumen-black transition-colors resize-y" 
                    placeholder="How can we assist you?"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="btn-primary flex items-center justify-center min-w-[12rem]"
                  >
                    {status === 'loading' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      'Send Inquiry'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="font-sans text-xs tracking-wider uppercase mb-2 text-lumen-gold">Email</p>
              <p className="font-sans text-lumen-black">support@elegenceseries.com</p>
            </div>
            <div>
              <p className="font-sans text-xs tracking-wider uppercase mb-2 text-lumen-gold">Hours</p>
              <p className="font-sans text-lumen-black">Mon-Fri: 9am - 6pm EST</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
