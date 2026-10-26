import { Metadata } from 'next';
import { LegalLayout, PolicySection } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Shipping Policy | ADEHAWK LEATHER GOODS',
  description: 'Detailed shipping timelines, delivery rates, and order tracking policies for Adehawk.',
};

const SECTIONS: PolicySection[] = [
  {
    id: 'commitment',
    title: 'Our Shipping Commitment',
    content: [
      'We are committed to making sure your order reaches you safely and efficiently. Please review our shipping policy below before placing an order.',
    ],
  },
  {
    id: 'processing',
    title: 'Order Processing',
    content: [
      'Orders are processed after payment confirmation. Please allow adequate processing time before your order is shipped.',
      'Processing times may vary depending on product availability, high order volumes, or public holidays. Once your order has been prepared and dispatched, you will receive a shipping confirmation email containing your tracking information.',
    ],
  },
  {
    id: 'rates-timelines',
    title: 'Shipping Rates & Estimated Delivery Times',
    content: [
      'Shipping rates are calculated at checkout based on destination and package dimensions.',
      'Standard United Kingdom orders typically arrive within 2 to 4 business days post-dispatch. Free UK standard shipping is automatically applied on qualifying orders above £75.',
      'Delivery dates provided at checkout are estimates and are not guaranteed. Actual transit times may vary due to carrier delays, weather conditions, or unforeseen logistical challenges beyond our control.',
    ],
  },
  {
    id: 'tracking',
    title: 'Order Tracking & Carrier Hand-Off',
    content: [
      'Once your order has shipped, you will receive a tracking link via email. Please allow up to 24 hours for the carrier system to update status updates online.',
      'We partner with reputable UK and international logistics services including Royal Mail, DPD, and DHL to ensure secure transport of all leather goods.',
    ],
  },
  {
    id: 'address',
    title: 'Shipping Address & Accuracy',
    content: [
      'Customers are responsible for providing an accurate and complete shipping address during checkout.',
      'We cannot be held responsible for delayed, lost, or misdelivered shipments resulting from incorrect or incomplete information provided at the time of purchase.',
    ],
  },
  {
    id: 'international',
    title: 'Customs, Duties & Import Taxes',
    content: [
      'For international deliveries outside the United Kingdom, customs duties, tariffs, and import taxes may be assessed by your local border agency. Any applicable fees are the sole responsibility of the customer.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Customer Support',
    content: [
      'If you have questions regarding your delivery or order tracking, please contact our team through our official customer channels or reach out via adehawk.official.',
    ],
  },
];

export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      title="Shipping Policy"
      lastUpdated="January 2026"
      sections={SECTIONS}
    />
  );
}
