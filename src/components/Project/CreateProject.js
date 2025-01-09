// /components/CreateProject.js

"use client";

import { useState, useContext } from 'react';
import { Web3Context } from '@contexts/Web3Context';

const CreateProject = () => {
  const { contract } = useContext(Web3Context);
  const [beneficiary, setBeneficiary] = useState('');
  const [txStatus, setTxStatus] = useState('');

  const handleCreateProject = async () => {
    if (!beneficiary) {
      alert('Please enter a beneficiary address.');
      return;
    }

    try {
      setTxStatus('Initiating transaction...');
      const tx = await contract.createProject(beneficiary);
      setTxStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      setTxStatus('Project created successfully!');
    } catch (error) {
      console.error(error);
      setTxStatus('Transaction failed.');
    }
  };

  return (
    <div>
      <h2>Create a New Project</h2>
      <input
        type="text"
        placeholder="Beneficiary Address"
        value={beneficiary}
        onChange={(e) => setBeneficiary(e.target.value)}
        style={{ width: '300px', padding: '8px' }}
      />
      <button onClick={handleCreateProject} style={{ marginLeft: '10px', padding: '8px 16px' }}>
        Create Project
      </button>
      <p>{txStatus}</p>
    </div>
  );
};

export default CreateProject;
