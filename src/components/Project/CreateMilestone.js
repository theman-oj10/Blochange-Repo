// /components/CreateMilestone.js
"use client"

import { useState, useContext } from 'react';
import { Web3Context } from '@/contexts/Web3Context';
import { ethers } from 'ethers';

const CreateMilestone = () => {
  const { contract, account } = useContext(Web3Context);
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');

  const handleCreateMilestone = async () => {
    if (!projectId || !description || !amount) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setTxStatus('Initiating transaction...');

      const amountInWei = ethers.parseEther(amount);

      console.log(contract);
      const tx = await contract.createMilestone(
        projectId,
        description,
        amountInWei
      );

      setTxStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      setTxStatus('Milestone created successfully!');
    } catch (error) {
      console.error(error);
      setTxStatus('Transaction failed.');
    }
  };

  return (
    <div>
      <h2>Create a New Milestone</h2>
      <input
        type="number"
        placeholder="Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        style={{ width: '300px', padding: '8px', marginBottom: '10px' }}
      />
      <br />
      <input
        type="text"
        placeholder="Milestone Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: '300px', padding: '8px', marginBottom: '10px' }}
      />
      <br />
      <input
        type="number"
        placeholder="Milestone Amount (in Ether)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: '300px', padding: '8px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={handleCreateMilestone} style={{ padding: '8px 16px' }}>
        Create Milestone
      </button>
      <p>{txStatus}</p>
    </div>
  );
};

export default CreateMilestone;
