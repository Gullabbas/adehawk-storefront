'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Collection } from '@/lib/commerce/types';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/Button';

interface CollectionClientProps {
  collection: Collection;
  products: Product[];
}

type SortOption =
  | 'featured'
  | 'best-selling'
  | 'title-asc'
  | 'title-desc'
  | 'price-asc'
  | 'price-desc';

export const CollectionClient: React.FC<CollectionClientProps> = ({
  collection,
  products,
}) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [columns, setColumns] = useState<2 | 3 | 4>(3);
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters state
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(150);

  // Hover image index map
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Extract all unique color names from products
  const availableColors = useMemo(() => {
    const colorsSet = new Set<string>();
    products.forEach(p => {
      p.colors.forEach(c => colorsSet.add(c.name));
    });
    return Array.from(colorsSet);
  }, [products]);

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (p.price > maxPrice) return false;
        if (
          selectedColors.length > 0 &&
          !p.colors.some(c => selectedColors.includes(c.name))
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        if (sortOption === 'title-asc') return a.title.localeCompare(b.title);
        if (sortOption === 'title-desc') return b.title.localeCompare(a.title);
        if (sortOption === 'best-selling') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, maxPrice, selectedColors, sortOption]);

  const toggleColorFilter = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setMaxPrice(150);
  };

  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-xs uppercase tracking-kicker text-ink-muted font-sans">
            <li>
              <Link href="/" className="hover:text-cognac transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/collections/all" className="hover:text-cognac transition-colors">
                Collections
              </Link>
            </li>
            <li>/</li>
            <li className="text-ink font-semibold">{collection.title}</li>
          </ol>
        </nav>

        {/* Collection Header */}
        <div className="border-b border-ink/10 pb-10 mb-8 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block">
              Handcrafted Collection
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-ink mt-1">
              {collection.title}
            </h1>
            <p className="text-base text-ink-muted max-w-2xl font-sans mt-3">
              {collection.description}
            </p>
          </motion.div>
        </div>

        {/* Toolbar: Filter Trigger, Count, Sort, Column Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-b border-ink/10 text-xs uppercase tracking-kicker font-sans">
          {/* Left: Filter Toggle & Product Count */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-ink/20 hover:border-ink transition-colors cursor-pointer"
            >
              <AnimatedIcon type="search" size={14} />
              <span>Filters {selectedColors.length > 0 && `(${selectedColors.length})`}</span>
            </button>
            <span className="text-ink-muted">
              Showing {filteredProducts.length} of {products.length} pieces
            </span>
          </div>

          {/* Right: Sort & Column Grid Toggles */}
          <div className="flex items-center gap-6">
            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-ink-muted hidden sm:inline">Sort:</span>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value as SortOption)}
                className="bg-transparent border border-ink/20 px-3 py-2 outline-none font-sans text-xs uppercase tracking-wider text-ink cursor-pointer focus:border-cognac"
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-asc">Price, Low to High</option>
                <option value="price-desc">Price, High to Low</option>
                <option value="title-asc">Alphabetically, A-Z</option>
                <option value="title-desc">Alphabetically, Z-A</option>
              </select>
            </div>

            {/* Desktop Column Toggle */}
            <div className="hidden lg:flex items-center gap-1 border border-ink/20 p-1">
              {[2, 3, 4].map(col => (
                <button
                  key={col}
                  onClick={() => setColumns(col as 2 | 3 | 4)}
                  className={`px-2.5 py-1 text-xs cursor-pointer transition-colors ${
                    columns === col
                      ? 'bg-ink text-ivory font-bold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  aria-label={`${col} columns grid`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden border-b border-ink/10 mb-8 bg-ivory-subtle"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Price Range Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs uppercase tracking-kicker font-sans">
                    <span className="font-semibold text-ink">Max Price</span>
                    <span className="font-mono text-cognac font-bold">£{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="150"
                    step="5"
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-cognac cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-ink-muted font-mono">
                    <span>£25</span>
                    <span>£150</span>
                  </div>
                </div>

                {/* Colour Options */}
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-kicker font-semibold text-ink block">
                    Colour Palette
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(col => {
                      const isSelected = selectedColors.includes(col);
                      return (
                        <button
                          key={col}
                          onClick={() => toggleColorFilter(col)}
                          className={`px-3 py-1.5 text-xs font-sans border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-ink text-ivory border-ink'
                              : 'bg-ivory border-ink/20 text-ink hover:border-ink'
                          }`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clear Actions */}
                <div className="flex items-end justify-start md:justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2.5 text-xs uppercase tracking-kicker font-sans border border-ink/20 hover:border-ink text-ink transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="font-serif text-3xl text-ink">No matching pieces</p>
            <p className="text-sm text-ink-muted font-sans max-w-md mx-auto">
              No products match your selected filters. Try broadening your price range or clearing color selections.
            </p>
            <Button onClick={clearFilters} variant="primary" size="md">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-8 ${columnClasses[columns]}`}>
            {filteredProducts.map(product => {
              const inWishlist = isInWishlist(product.id);
              const isHovered = hoveredProduct === product.id;
              // Secondary image swap: check if product has second image or secondary color image
              const secondaryImage =
                product.images[1] || product.colors[1]?.image || product.images[0];
              const displayImage =
                isHovered && secondaryImage ? secondaryImage : product.images[0];

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group bg-ivory-subtle border border-ink/10 flex flex-col justify-between overflow-hidden"
                >
                  {/* Image Container with Hover Swap */}
                  <div className="relative aspect-[4/5] w-full bg-ivory overflow-hidden">
                    <Link
                      href={`/products/${product.handle}`}
                      className="block w-full h-full relative"
                    >
                      <Image
                        src={displayImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-luxury"
                      />
                    </Link>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-ivory/80 backdrop-blur-sm rounded-full text-ink hover:text-cognac transition-colors border border-ink/10 cursor-pointer z-10"
                      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <AnimatedIcon type="heart" size={16} isActive={inWishlist} />
                    </button>

                    {/* Quick Add Button */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <Button
                        onClick={() =>
                          addItem({
                            productId: product.id,
                            title: product.title,
                            handle: product.handle,
                            price: product.price,
                            image: product.images[0],
                            colorName: product.colors[0]?.name,
                          })
                        }
                        variant="primary"
                        size="sm"
                        className="w-full shadow-lg"
                        icon="plus"
                      >
                        Quick Add · £{product.price.toFixed(2)}
                      </Button>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-5 space-y-2">
                    {/* Color Swatch Dots */}
                    {product.colors.length > 1 && (
                      <div className="flex items-center gap-1.5 pb-1">
                        {product.colors.map(col => (
                          <span
                            key={col.name}
                            className="w-3.5 h-3.5 rounded-full border border-ink/20"
                            style={{ backgroundColor: col.hex }}
                            title={col.name}
                          />
                        ))}
                        <span className="text-[10px] text-ink-muted uppercase tracking-kicker ml-1 font-sans">
                          {product.colors.length} Colours
                        </span>
                      </div>
                    )}

                    <Link
                      href={`/products/${product.handle}`}
                      className="font-serif text-lg font-normal text-ink hover:text-cognac transition-colors line-clamp-1 block"
                    >
                      {product.title}
                    </Link>

                    <div className="flex items-center justify-between pt-1 border-t border-ink/10">
                      <span className="text-sm font-sans font-semibold text-ink">
                        £{product.price.toFixed(2)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-ink-muted line-through font-sans">
                          £{product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
