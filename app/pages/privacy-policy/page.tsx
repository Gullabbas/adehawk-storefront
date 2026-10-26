import { Metadata } from 'next';
import { LegalLayout, PolicySection } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | ADEHAWK LEATHER GOODS',
  description: 'How Adehawk collects, protects, and handles personal data.',
};

const SECTIONS: PolicySection[] = [
  {
    id: 'intro',
    title: 'Commitment to Privacy',
    content: [
      'We value your privacy and are committed to protecting your personal information.',
      'This Privacy Policy explains how we collect, use, and protect information when you visit or make a purchase from our website.',
    ],
  },
  {
    id: 'collection',
    title: 'Information We Collect',
    content: [
      'When you visit our website or place an order, we may collect information such as:',
      '• Name and contact information (including email address and phone number)',
      '• Shipping and billing address details',
      '• Transaction details and purchase history',
      '• Device information, IP address, and browsing actions gathered through analytics cookies',
    ],
  },
  {
    id: 'usage',
    title: 'How We Use Your Information',
    content: [
      'We utilize the collected information strictly for legitimate commercial purposes:',
      '• To process, fulfill, and ship your orders',
      '• To communicate updates, shipping confirmations, and customer support responses',
      '• To maintain site security and prevent fraudulent transactions',
      '• To improve storefront performance, typography, and browsing experience',
    ],
  },
  {
    id: 'sharing',
    title: 'Sharing with Third Parties',
    content: [
      'We do not sell, rent, or trade your personal data to third parties. We share information solely with trusted third-party service providers who assist us in operating our storefront (e.g. payment gateways, logistics partners, and hosting infrastructure).',
      'All providers are obligated to uphold strict confidentiality and data protection standards under UK GDPR.',
    ],
  },
  {
    id: 'security',
    title: 'Data Security & Storage',
    content: [
      'We implement rigorous industry-standard encryption, SSL protocols, and administrative controls to safeguard your personal data from unauthorized access or disclosure.',
    ],
  },
  {
    id: 'rights',
    title: 'Your UK GDPR Rights',
    content: [
      'Under UK data protection law, you have the right to request access to your personal data, request correction of inaccurate data, or request the erasure of your personal records from our systems.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="January 2026"
      sections={SECTIONS}
    />
  );
}
