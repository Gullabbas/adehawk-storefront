import { Metadata } from 'next';
import { LegalLayout, PolicySection } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Return & Refund Policy | ADEHAWK LEATHER GOODS',
  description: 'Returns, exchanges, and final sale policies for Adehawk.',
};

const SECTIONS: PolicySection[] = [
  {
    id: 'intro',
    title: 'Policy Overview',
    content: [
      'Thank you for shopping with us. Please read this policy carefully before making a purchase.',
    ],
  },
  {
    id: 'no-returns',
    title: 'No Returns or Refunds',
    content: [
      'At this time, we do not offer returns, exchanges, or refunds for products once an order has been placed and successfully delivered.',
      'All sales are considered final.',
      'We encourage customers to carefully review product descriptions, dimensions, materials, and color specifications prior to completing an order.',
    ],
  },
  {
    id: 'damages',
    title: 'Damaged or Incorrect Items',
    content: [
      'In the rare event that an item arrives damaged, defective, or incorrect due to a fulfillment error, please contact our customer support team within 48 hours of delivery.',
      'Please provide your order number, a clear photograph of the product defect, and the shipping parcel. We will review your claim promptly and provide a suitable resolution.',
    ],
  },
  {
    id: 'cancellations',
    title: 'Order Cancellations',
    content: [
      'Because orders are prepared and processed swiftly for dispatch, cancellation requests cannot be guaranteed once payment is completed. If you wish to cancel an order, contact us immediately with your order reference number.',
    ],
  },
  {
    id: 'contact',
    title: 'Questions & Inquiries',
    content: [
      'For any questions or clarification regarding this policy, please reach out to customer support prior to placing your order.',
    ],
  },
];

export default function ReturnRefundPolicyPage() {
  return (
    <LegalLayout
      title="Return & Refund Policy"
      lastUpdated="January 2026"
      sections={SECTIONS}
    />
  );
}
