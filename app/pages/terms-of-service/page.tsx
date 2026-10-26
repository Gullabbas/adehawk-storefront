import { Metadata } from 'next';
import { LegalLayout, PolicySection } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | ADEHAWK LEATHER GOODS',
  description: 'Terms and legal conditions governing purchases and usage of Adehawk.',
};

const SECTIONS: PolicySection[] = [
  {
    id: 'intro',
    title: 'Agreement to Terms',
    content: [
      'Welcome to our website. By accessing or using our website, you agree to comply with and be bound by these Terms of Service.',
      'Please read these terms carefully before using our website or placing an order.',
    ],
  },
  {
    id: 'use-of-site',
    title: 'Use of Our Website',
    content: [
      'You agree to use our website only for lawful purposes and in a manner that does not interfere with the operation, security, or integrity of the platform.',
      'Unauthorized reproduction, automated scraping, or commercial exploitation of brand photography, trademarks, or content is strictly prohibited.',
    ],
  },
  {
    id: 'products-pricing',
    title: 'Products and Pricing',
    content: [
      'All product descriptions, specifications, and prices are subject to change without notice. We make every reasonable effort to display accurate product photography, leather grain characteristics, and colors.',
      'Because genuine leather is a natural material, slight natural variations in grain texture, hue, and surface markings are authentic characteristics of genuine leather craft.',
    ],
  },
  {
    id: 'orders-payments',
    title: 'Orders, Payments & Acceptance',
    content: [
      'We reserve the right to accept or decline any order at our discretion. If your order is canceled or modified after payment confirmation, we will notify you and issue a full prompt refund.',
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: [
      'All content on this site, including logos, product photography, editorial texts, design tokens, and digital assets, are the exclusive property of ADEHAWK LEATHER GOODS and protected by international intellectual property copyright laws.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: [
      'These Terms of Service are governed by and construed in accordance with the laws of the United Kingdom.',
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="January 2026"
      sections={SECTIONS}
    />
  );
}
