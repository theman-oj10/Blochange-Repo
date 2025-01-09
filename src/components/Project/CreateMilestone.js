"use client"

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Web3Context } from '@/contexts/Web3Context';
import { ethers } from 'ethers';
import CurrencyInput from '@/components/CurrencyInput';

const CreateMilestone = () => {
  const router = useRouter();
  const { contract, account } = useContext(Web3Context);
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [amountUSD, setAmountUSD] = useState('');
  const [amountCrypto, setAmountCrypto] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('matic');
  const [txStatus, setTxStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAmountChange = (usdAmount, cryptoAmount) => {
    setAmountUSD(usdAmount);
    setAmountCrypto(cryptoAmount);
  };

  const handleCryptoChange = (crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleCreateMilestone = async () => {
    if (!projectId || !description || !amountCrypto) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setTxStatus('Initiating transaction...');
      setIsSuccess(false);

      const amountInWei = ethers.parseEther(amountCrypto);

      console.log(contract);
      const tx = await contract.createMilestone(
        projectId,
        description,
        amountInWei
      );

      setTxStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      setTxStatus('Milestone created successfully!');
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setTxStatus('Transaction failed.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Create a New Milestone</h2>
      <input
        type="number"
        placeholder="Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Milestone Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
      />
      <CurrencyInput
        onAmountChange={handleAmountChange}
        onCryptoChange={handleCryptoChange}
      />
      <button 
        onClick={handleCreateMilestone}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Create Milestone
      </button>
      <p className="text-sm text-gray-600">{txStatus}</p>
      {isSuccess && (
        <Link
          href={`/charity/${projectId}`}
          className="block w-full text-center bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          View Charity Page
        </Link>
      )}
    </div>
  );
};

export default CreateMilestone;