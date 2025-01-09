import React, { useState, useContext } from 'react';
import { ethers } from 'ethers';
import { Web3Context } from '@/contexts/Web3Context';
import Posts from '@/components/Posts'; // Component for discussion

interface Milestone {
  id: number;
  amount: number;
  description: string;
  workDone: string;
  proofImages: string[];
  votesFor: number;
  votesAgainst: number;
  castVote: (milestoneId: number, vote: boolean) => void;
  releaseFunds: (milestoneId: number) => void;
  posts: any;
}

const MilestoneBox: React.FC<Milestone> = ({
  id,
  amount,
  description,
  workDone,
  proofImages,
  votesFor,
  votesAgainst,
  posts
}) => {

    const { contract, account } = useContext(Web3Context);
    const [votingStatus, setVotingStatus] = useState<string | null>(null);
    const [fundsStatus, setFundsStatus] = useState<string | null>(null);
    const castVote = async (milestoneId: number, vote: boolean) => {
        try {
        if (!contract) {
            setVotingStatus('Error: Contract or signer not found.');
            return;
        }

        setVotingStatus(`Submitting vote for milestone ${milestoneId}...`);
        const tx = await contract.vote(projectId, milestoneId);
        await tx.wait();
        setVotingStatus(`Vote submitted successfully for milestone ${milestoneId}`);
        } catch (error) {
        console.error('Error casting vote:', error);
        setVotingStatus(`Failed to cast vote for milestone ${milestoneId}`);
        }
    };

    // Function to release funds
    const releaseFunds = async (milestoneId: number) => {
        try {
        if (!contract) {
            setFundsStatus('Error: Contract or signer not found.');
            return;
        }

        setFundsStatus(`Releasing funds for milestone ${milestoneId}...`);
        const tx = await contract.releaseFunds(projectId, milestoneId);
        await tx.wait();
        setFundsStatus(`Funds released successfully for milestone ${milestoneId}`);
        } catch (error) {
        console.error('Error releasing funds:', error);
        setFundsStatus(`Failed to release funds for milestone ${milestoneId}`);
        }
    };
    
  return (
    <div key={id} className="col-span-12 rounded-[10px] bg-white p-6 shadow-lg">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-dark">Milestone {id}</h4>
        <p className="text-sm text-gray-500">Amount: ${amount}</p>
      </div>

      <div className="mb-4">
        <h5 className="font-semibold">Work Done:</h5>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded-md resize-none"
          defaultValue={workDone}
          readOnly
        />
      </div>

      {/* Proof Images */}
      <div className="mb-4">
        <h5 className="font-semibold">Proof:</h5>
        <div className="flex gap-2 overflow-x-scroll">
          {proofImages && proofImages.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Proof ${index + 1}`}
              className="w-32 h-32 object-cover rounded-md"
            />
          ))}
        </div>
      </div>

      {/* Voting and Actions */}
      <div className="mb-4 flex justify-between">
        <div>
          <p>Votes For: {votesFor}</p>
          <p>Donors not yet voted: {votesAgainst}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => castVote(id, true)}
            className="bg-green-500 text-white py-1 px-4 rounded"
          >
            Cast Approval Vote
          </button>
          {/* <button
            onClick={() => releaseFunds(id)}
            className="bg-yellow-500 text-white py-1 px-4 rounded"
          >
            Release Funds
          </button> */}
        </div>
      </div>

      {/* Milestone Discussion Section */}
      <div className="mt-4">
        <h5 className="font-semibold text-lg mb-2">Discussion</h5>
        <Posts milestoneId={id} userId={account} initialPosts={posts}/>
      </div>
    </div>
  );
};

export default MilestoneBox;
