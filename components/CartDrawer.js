'use client';

import Link from 'next/link';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-lumen-white z-50 flex flex-col animate-slideIn shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-lumen-border">
          <h2 className="font-serif text-xl">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-lumen-muted hover:text-lumen-gold transition-colors"
            aria-label="Close cart"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} strokeWidth={1} className="text-lumen-border" />
              <p className="font-serif text-xl text-lumen-muted">Your cart is empty</p>
              <p className="text-xs text-lumen-muted font-sans">
                Discover our curated lighting collection
              </p>
              <button onClick={onClose} className="btn-primary mt-2">
                Shop Now
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 pb-6 border-b border-lumen-border last:border-0">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base leading-snug truncate">{item.name}</p>
                    {item.variant && (
                      <p className="text-[11px] font-sans text-lumen-muted mt-0.5">{item.variant}</p>
                    )}
                    <p className="text-sm font-sans font-medium mt-1">
                      ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>

                    {/* Qty + Remove */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-lumen-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-lumen-muted hover:text-lumen-gold transition-colors text-base"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-sans">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-lumen-muted hover:text-lumen-gold transition-colors text-base"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-lumen-muted hover:text-lumen-error transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-lumen-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans tracking-[0.1em] uppercase text-lumen-muted">Subtotal</span>
              <span className="font-serif text-lg">
                ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-[11px] font-sans text-lumen-muted">
              Shipping & taxes calculated at checkout
            </p>
            <Link
              href="/cart"
              onClick={onClose}
              className="btn-primary w-full justify-center"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
