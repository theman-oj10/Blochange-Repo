"use client";

import React from 'react';

const PaymentDialog = ({ 
  isOpen, 
  onClose, 
  transaction, 
  onDonate, 
  txStatus, 
  donationSuccessful, 
  onGenerateReceipt 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Choose Payment Method</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Select your preferred method to donate {transaction?.amountUSD ? `$${transaction.amountUSD}` : ''}
        </p>

        <div className="space-y-4">
          {/* MATIC Payment Option */}
          <div className="border rounded-lg p-4">
            <div className="mb-2">
              <h4 className="font-medium">Pay with MATIC</h4>
              <p className="text-sm text-gray-600">Donate using MATIC cryptocurrency</p>
            </div>
            <button 
              onClick={onDonate}
              disabled={txStatus.includes('Initiating') || txStatus.includes('Waiting')}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {txStatus.includes('Initiating') || txStatus.includes('Waiting') ? 'Processing...' : 'Pay Now'}
            </button>
          </div>

          {/* Credit Card Option (Disabled) */}
          <div className="border rounded-lg p-4 opacity-50 cursor-not-allowed">
            <div className="mb-2">
              <h4 className="font-medium">Credit Card</h4>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
            <button 
              disabled
              className="w-full bg-gray-300 text-white py-2 px-4 rounded-md cursor-not-allowed"
            >
              Pay with Card
            </button>
          </div>
        </div>
        
        {txStatus && (
          <p className="text-sm text-gray-600 mt-4">{txStatus}</p>
        )}
        
        {donationSuccessful && (
          <button 
            onClick={onGenerateReceipt}
            className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
          >
            Download Tax-Deductible Receipt
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentDialog;