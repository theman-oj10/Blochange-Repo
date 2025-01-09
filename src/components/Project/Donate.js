"use client";

import { useState, useContext } from 'react';
import { Web3Context } from '@/contexts/Web3Context';
import { ethers } from 'ethers';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import CurrencyInput from '@/components/CurrencyInput';

class Transaction {
  constructor(data) {
    this.projectId = data.projectId;
    this.projectName = data.projectName;
    this.amountUSD = data.amountUSD;
    this.amountCrypto = data.amountCrypto;
    this.cryptoType = "MATIC";
    this.donorName = "Alice";
    this.donorAddress = "123 Main St, Wonderland";
    this.donorWallet = data.donorWallet;
    this.transactionHash = data.transactionHash;
    this.blockNumber = data.blockNumber;
    this.gasPrice = data.gasPrice;
    this.gasUsed = data.gasUsed;
    this.date = new Date();
    
    // Additional fields that might be useful for the receipt
    this.organizationName = "Blochange Shell Company";
    this.organizationAddress = "Singapore";
    this.taxId = "123456";
    this.organizationWalletId = "0x1234567890";
    
    // Fields for detailed breakdown
    this.totalDonationsUSD = data.totalDonationsUSD || this.amountUSD;
    this.totalDonationsCrypto = data.totalDonationsCrypto || this.amountCrypto;
    this.gasFeeCrypto = this.gasPrice * this.gasUsed;
    this.gasFeeUSD = this.gasFeeCrypto * 0.01; // update this to live price
    this.platformFeeUSD = data.platformFeeUSD || "0.50";
    this.platformFeeCrypto = data.platformFeeCrypto || "0.001";
    this.netDonationUSD = (parseFloat(this.totalDonationsUSD) - parseFloat(this.gasFeeUSD) - parseFloat(this.platformFeeUSD)).toFixed(2);
    this.netDonationCrypto = (parseFloat(this.totalDonationsCrypto) - parseFloat(this.gasFeeCrypto) - parseFloat(this.platformFeeCrypto)).toFixed(6);
  }

  getReceiptNumber() {
    return this.transactionHash ? this.transactionHash.slice(0, 8) : 'N/A';
  }

  getFormattedDate() {
    return this.date.toLocaleDateString();
  }
}

const Donate = ({ projectId, projectName }) => {
  const { contract, account } = useContext(Web3Context);
  const [transaction, setTransaction] = useState(null);
  const [txStatus, setTxStatus] = useState('');
  const [donationSuccessful, setDonationSuccessful] = useState(false);
  const donorName = 'Alice';
  const donorAddress = '123 Main St, Wonderland';
  const handleAmountChange = (usdAmount, cryptoAmount) => {
    setTransaction(prevTransaction => ({
      ...prevTransaction,
      amountUSD: usdAmount,
      amountCrypto: cryptoAmount
    }));
  };

  const handleCryptoChange = (crypto) => {
    setTransaction(prevTransaction => ({
      ...prevTransaction,
      cryptoType: crypto
    }));
  };

  const handleDonate = async () => {
    if (!projectId || !transaction?.amountCrypto) {
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
        value: ethers.parseEther(transaction.amountCrypto),
      });
      setTxStatus('Donation sent. Waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('Donation receipt:', receipt);
      
      const updatedTransaction = new Transaction({
        ...transaction,
        projectId,
        projectName,
        donorWallet: account,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber.toString(),
        gasPrice: receipt.gasPrice.toString(),
        gasUsed: receipt.gasUsed.toString(),
      });
      
      setTransaction(updatedTransaction);
      setTxStatus('Donation successful!');
      setDonationSuccessful(true);
    } catch (error) {
      console.error('Donation error:', error);
      setTxStatus('Donation failed.');
    }
  };

  const generateReceipt = () => {
    const doc = new jsPDF();
    
    // Add logo
    const logoUrl = '/images/logo/bloc-logo-light.png';
    doc.addImage(logoUrl, 'PNG', 10, 10, 90, 30);
    
    // Add title
    doc.setFontSize(28);
    doc.setTextColor(62, 84, 129);
    doc.text('INVOICE', 200, 35, null, null, 'right');
    
    // Add organization name and receipt details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(transaction.organizationName, 10, 50);
    doc.text(`Receipt Number: ${transaction.getReceiptNumber()}`, 200, 50, null, null, 'right');
    doc.text(`Date: ${transaction.getFormattedDate()}`, 200, 57, null, null, 'right');
    
    // Add donor and organization info
    doc.setFontSize(10);
    doc.text('Bill from:', 10, 70);
    doc.text(transaction.organizationName, 10, 77);
    doc.text(transaction.organizationAddress, 10, 84);
    doc.text(`Tax ID: ${transaction.taxId}`, 10, 91);
    doc.text(`Org Wallet: ${transaction.organizationWalletId}`, 10, 98);
    
    doc.text('Bill to:', 110, 70);
    doc.text(transaction.donorName, 110, 77);
    doc.text(transaction.donorAddress, 110, 84);
    doc.text(`Wallet: ${transaction.donorWallet ? transaction.donorWallet.slice(0, 20) + '...' : 'N/A'}`, 110, 91);
    
    // Add table with transaction information
    doc.autoTable({
      startY: 105,
      head: [['Item', 'Amount (USD)', `Amount (${transaction.cryptoType.toUpperCase()})`]],
      body: [
        [transaction.projectName, `$${transaction.amountUSD}`, `${transaction.amountCrypto} ${transaction.cryptoType.toUpperCase()}`],
        ['Total Donations', `$${transaction.totalDonationsUSD}`, `${transaction.totalDonationsCrypto} ${transaction.cryptoType.toUpperCase()}`],
        ['Gas Fees', `$${transaction.gasFeeUSD}`, `${transaction.gasFeeCrypto} ${transaction.cryptoType.toUpperCase()}`],
        ['Platform Fees', `$${transaction.platformFeeUSD}`, `${transaction.platformFeeCrypto} ${transaction.cryptoType.toUpperCase()}`],
        ['Net Donations', `$${transaction.netDonationUSD}`, `${transaction.netDonationCrypto} ${transaction.cryptoType.toUpperCase()}`],
      ],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [62, 84, 129] },
    });
    
    // Add transaction details
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(8);
    doc.text(`Transaction Hash: ${transaction.transactionHash}`, 10, finalY + 10);
    doc.text(`Block Number: ${transaction.blockNumber}`, 10, finalY + 15);
    doc.text(`Gas Used: ${transaction.gasUsed}`, 10, finalY + 20);
    
    const explorerLink = `https://amoy.polygonscan.com/tx/${transaction.transactionHash}`;
    doc.setTextColor(0, 0, 255);
    doc.textWithLink('View on Polygonscan', 10, finalY + 25, { url: explorerLink });
    
    // Add terms and conditions
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('This is a testnet transaction and has no real monetary value.', 10, finalY + 35);
    doc.text('In a real-world scenario, consult with a tax professional regarding the deductibility of your donation.', 10, finalY + 40);
    
    doc.save('Blochange_Donation_Receipt.pdf');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Donate to this project</h2>
      <CurrencyInput
        onAmountChange={handleAmountChange}
        onCryptoChange={handleCryptoChange}
      />
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