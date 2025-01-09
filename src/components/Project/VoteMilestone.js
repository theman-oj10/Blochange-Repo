i// /components/VoteMilestone.js

import { useState, useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

const VoteMilestone = () => {
  const { contract } = useContext(Web3Context);
  const [projectId, setProjectId] = useState('');
  const [milestoneId, setMilestoneId] = useState('');
  const [txStatus, setTxStatus] = useState('');

  const handleVote = async () => {
    if (!projectId || !milestoneId) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setTxStatus('Casting vote...');
      const tx = await contract.vote(projectId, milestoneId);
      setTxStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      setTxStatus('Vote cast successfully!');
    } catch (error) {
      console.error(error);
      setTxStatus('Transaction failed.');
    }
  };

  return (
    <div>
      <h2>Vote on Milestone</h2>
      <input
        type="number"
        placeholder="Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        style={{ width: '100px', padding: '8px' }}
      />
      <input
        type="number"
        placeholder="Milestone ID"
        value={milestoneId}
        onChange={(e) => setMilestoneId(e.target.value)}
        style={{ width: '100px', padding: '8px', marginLeft: '10px' }}
      />
      <button onClick={handleVote} style={{ marginLeft: '10px', padding: '8px 16px' }}>
        Vote
      </button>
      <p>{txStatus}</p>
    </div>
  );
};

export default VoteMilestone;
