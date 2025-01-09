"use client";

import { useState, useContext, useEffect } from 'react';
import { Web3Context } from '@/contexts/Web3Context';
import { ethers } from 'ethers';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Image from 'next/image';

const Donate = ({ projectId, projectName, organizationName, organizationAddress, taxId }) => {
  const { contract, provider, account } = useContext(Web3Context);
  const [amountUSD, setAmountUSD] = useState('');
  const [amountCrypto, setAmountCrypto] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [conversionRate, setConversionRate] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState("ethereum");
  const [donationSuccessful, setDonationSuccessful] = useState(false);
  const [transactionHash, setTransactionHash] = useState('x83838');
  const [blockNumber, setBlockNumber] = useState('x828282');
  const [gasUsed, setGasUsed] = useState('9090');
  const [donorName, setDonorName] = useState('Manoj');
  const [donorAddress, setDonorAddress] = useState('NUS');
  organizationName = "Blochange Shell Company"
  organizationAddress = "Singapore"

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=usd`);
        const data = await response.json();
        setConversionRate(data[selectedCrypto].usd);
      } catch (error) {
        console.error("Error fetching conversion rate:", error);
      }
    };

    fetchConversionRate();
    const interval = setInterval(fetchConversionRate, 60000);

    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const handleUSDChange = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      parts.pop();
    }
    const sanitizedValue = parts.join('.');

    setAmountUSD(sanitizedValue);
    if (conversionRate && sanitizedValue !== "") {
      setAmountCrypto((parseFloat(sanitizedValue) / conversionRate).toFixed(6));
    } else {
      setAmountCrypto("");
    }
  };

  const handleCryptoChange = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      parts.pop();
    }
    const sanitizedValue = parts.join('.');

    setAmountCrypto(sanitizedValue);
    if (conversionRate && sanitizedValue !== "") {
      setAmountUSD((parseFloat(sanitizedValue) * conversionRate).toFixed(2));
    } else {
      setAmountUSD("");
    }
  };

  const handleDonate = async () => {
    if (!projectId || !amountCrypto || !donorName || !donorAddress) {
      alert('Please enter all required information.');
      return;
    }

    if (!contract) {
      alert('Contract is not initialized.');
      return;
    }

    try {
      setTxStatus('Initiating donation...');
      const tx = await contract.donate(projectId, {
        value: ethers.parseEther(amountCrypto),
      });
      setTxStatus('Donation sent. Waiting for confirmation...');
      const receipt = await tx.wait();
      setTransactionHash(receipt.transactionHash);
      setBlockNumber(receipt.blockNumber.toString());
      setGasUsed(receipt.gasUsed.toString());
      setTxStatus('Donation successful!');
      setDonationSuccessful(true);
    } catch (error) {
      console.error('Donation error:', error);
      setTxStatus('Donation failed.');
    }
  };

  const generateReceipt = async () => {
    const doc = new jsPDF();
    
    // Add logo
    const logoUrl = '/images/logo/bloc-logo.png';
    doc.addImage(logoUrl, 'PNG', 10, 10, 30, 30);
    
    // Add title
    doc.setFontSize(28);
    doc.setTextColor(62, 84, 129);
    doc.text('RECEIPT', 200, 20, null, null, 'right');
    
    // Add organization name and receipt details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(organizationName, 10, 50);
    doc.text(`Receipt Number: ${transactionHash.slice(0, 8)}`, 200, 50, null, null, 'right');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 200, 57, null, null, 'right');
    
    // Add donor and organization info
    doc.setFontSize(10);
    doc.text('Bill from:', 10, 70);
    doc.text(organizationName, 10, 77);
    doc.text(organizationAddress, 10, 84);
    doc.text(`Tax ID: ${taxId}`, 10, 91);
    
    doc.text('Bill to:', 110, 70);
    doc.text(donorName, 110, 77);
    doc.text(donorAddress, 110, 84);
    doc.text(`Wallet: ${account.slice(0, 20)}...`, 110, 91);
    
    // Add table
    doc.autoTable({
      startY: 100,
      head: [['Item', 'Quantity', 'Rate', 'Tax', 'Amount']],
      body: [
        [projectName, '01', `$${amountUSD}`, '0.00', `$${amountUSD}`],
      ],
      foot: [
        ['', '', '', 'Subtotal:', `$${amountUSD}`],
        ['', '', '', 'Discount:', '$0.00'],
        ['', '', '', 'Tax:', '$0.00'],
        ['', '', '', 'Paid:', '$0.00'],
        ['', '', '', 'Total:', `$${amountUSD}`],
      ],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [62, 84, 129] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    });
    
    // Add Polygon transaction details
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(8);
    doc.text(`Transaction Hash: ${transactionHash}`, 10, finalY + 10);
    doc.text(`Block Number: ${blockNumber}`, 10, finalY + 15);
    doc.text(`Gas Used: ${gasUsed}`, 10, finalY + 20);
    
    const explorerLink = `https://mumbai.polygonscan.com/tx/${transactionHash}`;
    doc.setTextColor(0, 0, 255);
    doc.textWithLink('View on Mumbai Polygonscan', 10, finalY + 25, { url: explorerLink });
    
    // Add terms and conditions
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('This is a testnet transaction and has no real monetary value.', 10, finalY + 35);
    doc.text('In a real-world scenario, consult with a tax professional regarding the deductibility of your donation.', 10, finalY + 40);
    
    doc.save('styled_testnet_donation_receipt.pdf');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Donate to this project</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Amount in USD"
            value={amountUSD}
            onChange={(e) => handleUSDChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            USD
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Amount in MATIC"
            value={amountCrypto}
            onChange={(e) => handleCryptoChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-20 focus:border-blue-500 focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            MATIC
          </span>
        </div>
      </div>
      {conversionRate && (
        <p className="text-sm text-gray-500">
          1 USD = {(1 / conversionRate).toFixed(6)} MATIC
        </p>
      )}
      <button 
        onClick={handleDonate} 
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Donate
      </button>
      {txStatus && <p className="text-sm text-gray-600">{txStatus}</p>}
      {donationSuccessful && (
        <button 
          onClick={generateReceipt}
          className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
        >
          Download Tax-Deductible Receipt
        </button>
      )}
    </div>
  );
};

export default Donate;