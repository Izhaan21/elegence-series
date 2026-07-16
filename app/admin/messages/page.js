'use client';

import { useState, useEffect } from 'react';
import { getMessages, deleteMessage } from '@/lib/firestore';
import { Loader2, MailOpen, Trash2, Mail } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    setDeletingId(id);
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('Failed to delete message.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <Loader2 size={32} className="text-lumen-gold animate-spin" />
        <p className="text-sm text-lumen-muted">Loading messages…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-lumen-border">
        <div>
          <h1 className="font-sans text-2xl text-lumen-black font-semibold mb-2">Inquiries</h1>
          <p className="text-[15px] text-lumen-muted">Manage messages from the contact form</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-lumen-white border border-lumen-border p-12 text-center rounded-sm">
          <div className="w-16 h-16 bg-lumen-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-lumen-border">
            <MailOpen size={24} className="text-lumen-muted" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-medium text-lumen-black mb-2">No messages</h3>
          <p className="text-sm text-lumen-muted">When customers contact you, their inquiries will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-lumen-white border border-lumen-border p-6 rounded-sm shadow-sm flex flex-col md:flex-row gap-6 items-start relative group transition-colors hover:border-lumen-gold/30">
              
              <div className="w-10 h-10 bg-lumen-bg flex-shrink-0 flex items-center justify-center border border-lumen-border rounded-full">
                <Mail size={16} className="text-lumen-gold" strokeWidth={1.5} />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lumen-black">{msg.name}</span>
                    <span className="text-lumen-muted text-sm">&lt;{msg.email}&gt;</span>
                  </div>
                  <span className="text-xs text-lumen-muted uppercase tracking-wider bg-lumen-bg px-2 py-1 border border-lumen-border">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                
                <h4 className="font-medium text-sm text-lumen-black mb-3 pb-3 border-b border-lumen-border inline-block">
                  {msg.subject || 'No Subject'}
                </h4>
                
                <p className="text-[15px] text-lumen-black/80 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>

              <button
                onClick={() => handleDelete(msg.id)}
                disabled={deletingId === msg.id}
                className="absolute top-6 right-6 p-2 text-lumen-muted hover:text-lumen-error hover:bg-lumen-error-light rounded-sm transition-all md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                title="Delete message"
              >
                {deletingId === msg.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
