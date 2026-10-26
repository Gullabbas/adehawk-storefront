'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export interface PolicySection {
  id: string;
  title: string;
  content: string[];
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  lastUpdated,
  sections,
}) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop - 140;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
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
            <li>Legal</li>
            <li>/</li>
            <li className="text-ink font-semibold">{title}</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="border-b border-ink/10 pb-8 mb-12">
          <span className="text-xs uppercase tracking-kicker text-cognac font-sans font-medium block mb-2">
            Legal & Compliance
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-ink">
            {title}
          </h1>
          <p className="text-xs font-sans uppercase tracking-widest text-ink-muted mt-2">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Grid Layout: Sticky TOC + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sticky Table of Contents (Desktop) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32 p-6 bg-ivory-subtle border border-ink/10 space-y-4">
              <span className="text-xs uppercase tracking-kicker font-sans font-semibold text-ink block border-b border-ink/10 pb-2">
                Table of Contents
              </span>
              <ul className="space-y-2 text-xs font-sans uppercase tracking-wider">
                {sections.map(sec => (
                  <li key={sec.id}>
                    <button
                      onClick={() => scrollTo(sec.id)}
                      className={`text-left w-full py-1 transition-colors cursor-pointer ${
                        activeSection === sec.id
                          ? 'text-cognac font-bold translate-x-1'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      {sec.title}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-ink/10 space-y-2">
                <span className="text-[11px] text-ink-muted block uppercase tracking-kicker">
                  Related Policies
                </span>
                <div className="flex flex-col space-y-1 text-xs text-cognac">
                  <Link href="/pages/shipping-policy" className="hover:underline">
                    Shipping Policy →
                  </Link>
                  <Link href="/pages/return-refund-policy" className="hover:underline">
                    Return & Refund Policy →
                  </Link>
                  <Link href="/pages/privacy-policy" className="hover:underline">
                    Privacy Policy →
                  </Link>
                  <Link href="/pages/terms-of-service" className="hover:underline">
                    Terms of Service →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Text Measure */}
          <div className="lg:col-span-8 max-w-prose space-y-12">
            {sections.map(sec => (
              <section key={sec.id} id={sec.id} className="scroll-mt-32 space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-ink border-b border-ink/10 pb-2">
                  {sec.title}
                </h2>
                <div className="space-y-4 text-base text-ink/80 leading-relaxed font-sans">
                  {sec.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
