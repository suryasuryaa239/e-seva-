import React from 'react';
import ReceiptModal from './ReceiptModal';

export default function ReceiptPrint({ applicationData, serviceData, fieldValues, paymentData }) {
  if (!applicationData) return null;

  return (
    <ReceiptModal
      application={{
        ...applicationData,
        payment_transaction_id: paymentData?.payment_transaction_id || applicationData?.payment_transaction_id,
        payment_method: paymentData?.payment_method || applicationData?.payment_method,
        total_fee: paymentData?.amount || applicationData?.total_fee || applicationData?.amount
      }}
      service={serviceData}
      fieldValues={fieldValues}
      onClose={() => {}}
    />
  );
}
