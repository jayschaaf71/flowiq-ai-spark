
import React from 'react';
import { CreditCard, Zap, Building, Shield } from 'lucide-react';

const benefits = [
  {
    icon: CreditCard,
    title: "Secure Payment Processing",
    description: "Accept credit cards, debit cards, and bank transfers securely"
  },
  {
    icon: Zap,
    title: "Automated Billing",
    description: "Automatic invoice generation and payment reminders"
  },
  {
    icon: Building,
    title: "Payment Plans",
    description: "Offer flexible payment options to your patients"
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "All payment data is encrypted and HIPAA compliant"
  }
];

export const PaymentBenefitsGrid: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
