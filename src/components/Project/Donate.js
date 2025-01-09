"use client";

import { useState, useContext } from 'react';
import { Web3Context } from '@/contexts/Web3Context';
import { ethers } from 'ethers';

const Donate = ({ projectId }) => {
  const { contract } = useContext(Web3Context);
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');

  const handleDonate = async () => {
    if (!projectId || !amount) {
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
        value: ethers.parseEther(amount),
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
    <div>
      <h2>Donate to this project</h2>
      <input
        type="text"
        placeholder="Amount in ETH/MATIC"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: '150px', padding: '8px' }}
      />
      <button onClick={handleDonate} style={{ marginLeft: '10px', padding: '8px 16px' }}>
        Donate
      </button>
      <p>{txStatus}</p>
    </div>
  );
};

export default Donate;
