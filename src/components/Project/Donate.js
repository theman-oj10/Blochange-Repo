// /components/Donate.js

import { useState, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import { ethers } from 'ethers';

const Donate = () => {
  const { contract } = useContext(Web3Context);
  const [projectId, setProjectId] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');

  const handleDonate = async () => {
    if (!projectId || !amount) {
      alert('Please enter both Project ID and amount.');
      return;
    }

    try {
      setTxStatus('Initiating donation...');
      const tx = await contract.donate(projectId, {
        value: ethers.utils.parseEther(amount),
      });
      setTxStatus('Donation sent. Waiting for confirmation...');
      await tx.wait();
      setTxStatus('Donation successful!');
    } catch (error) {
      console.error(error);
      setTxStatus('Donation failed.');
    }
  };

  return (
    <div>
      <h2>Donate to a Project</h2>
      <input
        type="number"
        placeholder="Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        style={{ width: '100px', padding: '8px' }}
      />
      <input
        type="text"
        placeholder="Amount in MATIC"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: '150px', padding: '8px', marginLeft: '10px' }}
      />
      <button onClick={handleDonate} style={{ marginLeft: '10px', padding: '8px 16px' }}>
        Donate
      </button>
      <p>{txStatus}</p>
    </div>
  );
};

export default Donate;
