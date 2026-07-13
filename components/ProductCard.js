import Link from 'next/link';

export default function ProductCard({ product, layout = 'grid' }) {
  const {
    name,
    slug,
    price,
    discountPrice,
    images,
    isNew,
    category,
    stock,
  } = product;

  const displayPrice = discountPrice || price;
  const hasDiscount = discountPrice && discountPrice < price;
  
  const primaryImage = images?.[0] || '/placeholder-product.jpg';
  const secondaryImage = images?.[1];

  const isSoldOut = Number(stock) <= 0;

  return (
    <Link
      href={`/shop/${slug}`}
      className={`group block ${layout === 'list' ? 'flex flex-col sm:flex-row gap-6 border-b border-lumen-border pb-6 mb-6' : ''}`}
      aria-label={`View ${name}`}
    >
      {/* Image container */}
      <div className={`relative overflow-hidden bg-gray-100 ${layout === 'list' ? 'w-full sm:w-64 h-64 shrink-0' : 'aspect-square'}`}>
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            secondaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
          }`}
        />
        
        {/* Secondary Image (Hover State) */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isSoldOut ? (
            <span className="bg-lumen-error text-white text-[10px] font-sans font-medium tracking-[0.12em] uppercase px-2.5 py-1">
              Sold Out
            </span>
          ) : (
            <>
              {hasDiscount && (
                <span className="bg-lumen-gold text-white text-[10px] font-sans font-medium tracking-[0.12em] uppercase px-2.5 py-1">
                  Sale
                </span>
              )}
              {isNew && !hasDiscount && (
                <span className="bg-lumen-black text-white text-[10px] font-sans font-medium tracking-[0.12em] uppercase px-2.5 py-1">
                  New
                </span>
              )}
            </>
          )}
        </div>

        {/* Quick View / Hover Overlay Button */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <div className="bg-white/95 backdrop-blur-sm text-lumen-black text-xs font-sans tracking-[0.1em] uppercase py-3 text-center border border-lumen-border shadow-sm w-full font-medium">
            View Details
          </div>
        </div>

        {/* Darkening overlay for hover button contrast */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className={`mt-3 space-y-1 flex-1 ${layout === 'list' ? 'mt-0 sm:flex sm:justify-between sm:items-start' : ''}`}>
        
        {/* Left side info (or top if grid) */}
        <div>
          {category && (
            <p className="text-[10px] font-sans tracking-[0.1em] uppercase text-lumen-muted mb-1">
              {category}
            </p>
          )}
          <h3 className={`font-serif leading-snug text-lumen-black group-hover:text-lumen-gold transition-colors ${layout === 'list' ? 'text-xl' : 'text-base'}`}>
            {name}
          </h3>
        </div>

        {/* Right side pricing (or bottom if grid) */}
        <div className={`flex ${layout === 'list' ? 'flex-col items-end gap-1 mt-4 sm:mt-0' : 'items-center gap-2 mt-1'}`}>
          {layout === 'list' && (
            <span className="text-[10px] font-sans text-lumen-muted tracking-widest uppercase">From</span>
          )}
          <div className="flex items-center gap-2">
            <span className={`font-sans text-lumen-black ${layout === 'list' ? 'font-bold text-base' : 'text-sm'}`}>
              ${displayPrice?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {hasDiscount && (
              <span className="text-sm font-sans text-lumen-muted line-through">
                ${price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          {hasDiscount && layout === 'list' && (
            <span className="text-[11px] font-sans text-[#c9a96e]">
              Save ${(price - discountPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
