"use client";

import { useState, useContext, useEffect } from 'react';
import { Web3Context } from '@/contexts/Web3Context';
import { ethers } from 'ethers';

const Donate = ({ projectId }) => {
  const { contract } = useContext(Web3Context);
  const [amountUSD, setAmountUSD] = useState('');
  const [amountCrypto, setAmountCrypto] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [conversionRate, setConversionRate] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState("ethereum");

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
    if (!projectId || !amountCrypto) {
      alert('Please enter both Project ID and amount.');
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
      await tx.wait();
      setTxStatus('Donation successful!');
    } catch (error) {
      console.error('Donation error:', error);
      setTxStatus('Donation failed.');
    }
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
            placeholder={`Amount in ${selectedCrypto === "ethereum" ? "ETH" : "MATIC"}`}
            value={amountCrypto}
            onChange={(e) => handleCryptoChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-20 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-gray-500"
          >
            <option value="ethereum">ETH</option>
            <option value="matic-network">MATIC</option>
          </select>
        </div>
      </div>
      {conversionRate && (
        <p className="text-sm text-gray-500">
          1 USD = {(1 / conversionRate).toFixed(6)} {selectedCrypto === "ethereum" ? "ETH" : "MATIC"}
        </p>
      )}
      <button 
        onClick={handleDonate} 
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Donate
      </button>
      {txStatus && <p className="text-sm text-gray-600">{txStatus}</p>}
    </div>
  );
};

export default Donate;