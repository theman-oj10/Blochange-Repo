import React, { useState, useEffect } from 'react';

const CurrencyInput = ({ onAmountChange, onCryptoChange }) => {
  const [conversionRates, setConversionRates] = useState({ ethereum: null, matic: null });
  const [selectedCrypto, setSelectedCrypto] = useState('matic');
  const [amountUSD, setAmountUSD] = useState('');
  const [amountCrypto, setAmountCrypto] = useState('');

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network&vs_currencies=usd');
        const data = await response.json();
        setConversionRates({
          ethereum: data.ethereum.usd,
          matic: data['matic-network'].usd
        });
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    };

    fetchConversionRates();
    const interval = setInterval(fetchConversionRates, 60000);

    return () => clearInterval(interval);
  }, []);

  const sanitizeInput = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      parts.pop();
    }
    return parts.join('.');
  };

  const handleUSDChange = (value) => {
    const sanitizedValue = sanitizeInput(value);
    setAmountUSD(sanitizedValue);
    if (conversionRates[selectedCrypto] && sanitizedValue !== "") {
      const cryptoAmount = (parseFloat(sanitizedValue) / conversionRates[selectedCrypto]).toFixed(6);
      setAmountCrypto(cryptoAmount);
      onAmountChange(sanitizedValue, cryptoAmount);
    } else {
      setAmountCrypto("");
      onAmountChange(sanitizedValue, "");
    }
  };

  const handleCryptoChange = (value) => {
    const sanitizedValue = sanitizeInput(value);
    setAmountCrypto(sanitizedValue);
    if (conversionRates[selectedCrypto] && sanitizedValue !== "") {
      const usdAmount = (parseFloat(sanitizedValue) * conversionRates[selectedCrypto]).toFixed(2);
      setAmountUSD(usdAmount);
      onAmountChange(usdAmount, sanitizedValue);
    } else {
      setAmountUSD("");
      onAmountChange("", sanitizedValue);
    }
  };

  const handleCryptoSelection = (crypto) => {
    setSelectedCrypto(crypto);
    onCryptoChange(crypto);
    // Recalculate amounts based on new crypto selection
    if (amountUSD !== "") {
      handleUSDChange(amountUSD);
    } else if (amountCrypto !== "") {
      handleCryptoChange(amountCrypto);
    }
  };

  return (
    <div className="space-y-4">
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
            placeholder={`Amount in ${selectedCrypto.toUpperCase()}`}
            value={amountCrypto}
            onChange={(e) => handleCryptoChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-24 focus:border-blue-500 focus:outline-none"
          />
          <select
            value={selectedCrypto}
            onChange={(e) => handleCryptoSelection(e.target.value)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none focus:outline-none text-gray-500"
          >
            <option value="matic">MATIC</option>
            <option value="ethereum">ETH</option>
          </select>
        </div>
      </div>
      {conversionRates[selectedCrypto] && (
        <p className="text-sm text-gray-500">
          1 USD = {(1 / conversionRates[selectedCrypto]).toFixed(6)} {selectedCrypto.toUpperCase()}
        </p>
      )}
    </div>
  );
};

export default CurrencyInput;