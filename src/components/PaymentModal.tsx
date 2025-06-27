import React from 'react';
import { usePurchase } from '../context/PurchaseContext';
import PaymentForm from './PaymentForm';

const PaymentModal: React.FC = () => {
  const { 
    showPaymentModal, 
    currentPurchase, 
    closePaymentModal, 
    handlePaymentSuccess 
  } = usePurchase();

  if (!showPaymentModal || !currentPurchase) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4">
          <PaymentForm
            type={currentPurchase.type}
            id={currentPurchase.id}
            onSuccess={handlePaymentSuccess}
            onCancel={closePaymentModal}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
