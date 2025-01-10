import React, { useState, useContext, useEffect } from 'react';
import { Web3Context } from '@/contexts/Web3Context';
import Posts from '@/components/Posts';
import MilestoneVoting from '@/components/MilestoneVoting';
import { FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import WorkDoneDetails from './WorkDoneDetails';
import TransactionList from './TransactionList';

interface Milestone {
  id: number;
  amount: number;
  description: string;
  workDone: string;
  proofImages: string[];
  votesFor: number;
  votesAgainst: number;
  posts: any;
  totalDonors?: number;
}

interface Transaction {
  id: string;
  amount: number;
  timestamp: number;
  workDone: string;
  status: 'completed' | 'pending';
  type: 'withdrawal' | 'deposit' | 'payment';
  txHash: string;
  receipts: {
    id: string;
    title: string;
    amount: number;
    date: string;
    url: string;
  }[];
  workImages: {
    id: string;
    title: string;
    url: string;
    description: string;
  }[];
}

interface MilestonesProps {
  milestones: Milestone[];
  currentAmount: number;
  projectId: number;
  goalAmount: number;
  onVoteSuccess?: (milestoneId: number) => void;
  conversionRate?: number;
  showUSD?: boolean;
}

const Milestones: React.FC<MilestonesProps> = ({ 
  milestones, 
  currentAmount, 
  projectId, 
  goalAmount,
  onVoteSuccess,
  conversionRate = 1,
  showUSD = false
}) => {
  const { contract, account } = useContext(Web3Context);
  const [hoverTooltip, setHoverTooltip] = useState({ show: false, position: 0 });
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(milestones[0]?.id);
  const [votingStatus, setVotingStatus] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  // Example transaction data - replace with your actual data source
  const transactions: Transaction[] = [
    {
      id: '1',
      amount: 1000,
      timestamp: Date.now() - 86400000,
      workDone: "Completed initial research and planning phase. Created detailed project timeline and resource allocation plan.",
      status: 'completed',
      type: 'withdrawal',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      receipts: [
        {
          id: 'r1',
          title: 'Research Materials',
          amount: 500,
          date: '2024-01-15',
          url: '/receipts/r1.pdf'
        },
        {
          id: 'r2',
          title: 'Development Tools',
          amount: 500,
          date: '2024-01-16',
          url: '/receipts/r2.pdf'
        }
      ],
      workImages: [
        {
          id: 'i1',
          title: 'Project Timeline',
          url: '/images/timeline.jpg',
          description: 'Detailed project timeline showing key milestones and deliverables'
        },
        {
          id: 'i2',
          title: 'Resource Allocation',
          url: '/images/resources.jpg',
          description: 'Resource allocation chart showing team assignments and responsibilities'
        }
      ]
    },
    {
      id: '2',
      amount: 2000,
      timestamp: Date.now() - 172800000,
      workDone: "Finalised development contract and initial downpayment.",
      status: 'completed',
      type: 'withdrawal',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      receipts: [
        {
          id: 'r3',
          title: 'Development Contract',
          amount: 2000,
          date: '2024-01-17',
          url: '/receipts/r3.pdf'
        }
      ],
      workImages: [
        {
          id: 'i3',
          title: 'Contract Screenshot',
          url: '/images/contract-screenshot.png',
          description: 'User authentication flow diagram and implementation'
        }
      ]
    }
  ];

  const progress = Math.min((currentAmount / goalAmount) * 100, 100);

  const getMilestoneStatus = (milestone: Milestone) => {
    const progressPercent = (currentAmount / goalAmount) * 100;

    if (milestone.id === 1 && progressPercent >= 33) {
      return {
        label: 'Completed',
        icon: CheckCircle2,
        textColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (milestone.id === 2 && progressPercent >= 33) {
      return {
        label: 'In Progress',
        icon: Clock,
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    } else {
      return {
        label: 'Funding Required',
        icon: AlertCircle,
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  };

  const getMilestoneStyle = (milestone: Milestone) => {
    const progressPercent = (currentAmount / goalAmount) * 100;
    
    if (milestone.id === 1 && progressPercent >= 33) {
      return {
        bgColor: 'bg-green-500',
        borderColor: 'border-green-600',
        ringColor: 'ring-green-200'
      };
    } else if (milestone.id === 2 && progressPercent >= 33) {
      return {
        bgColor: 'bg-yellow-400',
        borderColor: 'border-yellow-500',
        ringColor: 'ring-yellow-200'
      };
    } else {
      return {
        bgColor: 'bg-white',
        borderColor: 'border-gray-300',
        ringColor: 'ring-gray-200'
      };
    }
  };

  const selectedMilestone = milestones.find(m => m.id === selectedMilestoneId);
  
  const formatAmount = (amount: number) => {
    if (showUSD) {
      const usdAmount = amount * conversionRate;
      return `$${usdAmount.toLocaleString()}`;
    }
    return `${amount.toLocaleString()} MATIC`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    setHoverTooltip({ show: true, position });
  };

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestoneId(milestone.id);
  };

  const isMilestoneReached = (milestoneAmount: number) => {
    return currentAmount >= milestoneAmount;
  };

  const castVote = async (milestoneId: number, vote: boolean) => {
    if (isVoting) return;
    
    try {
      setIsVoting(true);
      if (!contract) {
        throw new Error('Contract or signer not found.');
      }

      setVotingStatus(`Submitting vote for milestone ${milestoneId}...`);
      console.log(projectId, milestoneId);
      const tx = await contract.vote(projectId, milestoneId.toString());
      await tx.wait();
      
      setVotingStatus(`Vote submitted successfully for milestone ${milestoneId}`);
      
      if (onVoteSuccess) {
        onVoteSuccess(milestoneId);
      }

      setTimeout(() => {
        setVotingStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error casting vote:', error);
      setVotingStatus(`Failed to cast vote for milestone ${milestoneId}`);
    } finally {
      setIsVoting(false);
    }
  };
  
  useEffect(() => {
    if (selectedMilestoneId && !milestones.find(m => m.id === selectedMilestoneId)) {
      setSelectedMilestoneId(milestones[0]?.id);
    }
  }, [milestones, selectedMilestoneId]);

  return (
    <div className="mt-8 mb-8 w-full space-y-8">
      {/* Milestones Progress Bar */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Milestones</h2>
        <div className="relative pt-2 pb-12">
          <div 
            className="h-3 bg-gray-300 rounded-full w-full cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverTooltip({ show: false, position: 0 })}
          >
            <div
              className="absolute left-0 h-3 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
            {hoverTooltip.show && (
              <div 
                className="absolute bottom-full mb-2 bg-white shadow-lg border border-gray-200 rounded px-3 py-1 text-sm font-semibold text-blue-500 transform -translate-x-1/2"
                style={{ left: `${hoverTooltip.position}%` }}
              >
                {formatAmount(currentAmount)} raised
              </div>
            )}
          </div>

          {/* Milestone Markers */}
          {milestones.map((milestone) => {
            const position = (milestone.amount / goalAmount) * 100;
            const isActive = selectedMilestoneId === milestone.id;
            const style = getMilestoneStyle(milestone);

            return (
              <div 
                key={milestone.id} 
                className="absolute flex flex-col items-center"
                style={{ 
                  left: `${position}%`, 
                  transform: 'translateX(-50%)',
                  top: '3px'
                }}
              >
                <button 
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all duration-300 
                    ${isActive ? `ring-4 ${style.ringColor}` : ''}
                    ${style.bgColor} border-2 ${style.borderColor}
                    hover:scale-110`}
                  onClick={() => handleMilestoneClick(milestone)}
                  aria-label={`Milestone ${milestone.id}`}
                />
                <span className="text-xs font-semibold mt-2 whitespace-nowrap">
                  {showUSD 
                    ? `$${(milestone.amount * conversionRate).toLocaleString()} USD`
                    : `${milestone.amount.toLocaleString()} MATIC`
                  }
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline whitespace-nowrap">
                  Milestone {milestone.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone Details Section */}
      {selectedMilestone && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-8">
            {/* Header with Title, Status, Description, and Voting */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Milestone {selectedMilestone.id}
                      <p className="text-gray-600 mt-1">
                        {formatAmount(selectedMilestone.amount)}
                      </p>
                    </h3>
                    
                    {/* Status Badge */}
                    {(() => {
                      const status = getMilestoneStatus(selectedMilestone);
                      const StatusIcon = status.icon;
                      
                      return (
                        <div className={`inline-flex items-center px-4 py-2 rounded-lg ${status.bgColor} ${status.borderColor} border`}>
                          <StatusIcon className={`w-5 h-5 mr-2 ${status.textColor}`} />
                          <span className={`text-sm font-medium ${status.textColor}`}>
                            {status.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                    <p className="text-gray-600">In this milestone, we have negotiated and settled the development contracts for a school to be built in Ngao. We have also completed our initial research and planning, and have developed a timeline and resource allocation plans.</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Voting */}
              <div>
                <MilestoneVoting
                  votesFor={selectedMilestone.votesFor}
                  votesAgainst={selectedMilestone.votesAgainst}
                  totalDonors={selectedMilestone.totalDonors || 0}
                  isVoting={isVoting}
                  isMilestoneReached={isMilestoneReached(selectedMilestone.amount)}
                  onVoteFor={() => castVote(selectedMilestone.id, true)}
                  onVoteAgainst={() => castVote(selectedMilestone.id, false)}
                  onRequestRevision={() => {
                    console.log('Request revision for milestone:', selectedMilestone.id);
                  }}
                />
              </div>
            </div>

            {/* Work Done and Transactions Section */}
{/* Work Done and Transactions Section */}
<div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left Column - Transactions */}
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Transactions</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <TransactionList
          transactions={transactions}
          selectedTransaction={selectedTransaction}
          onTransactionSelect={setSelectedTransaction}
          formatAmount={formatAmount}
        />
      </div>
    </div>

    {/* Right Column - Work Done Details */}
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Work Done</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <WorkDoneDetails 
          transaction={transactions.find(t => t.id === selectedTransaction)}
          formatAmount={formatAmount}
        />
      </div>
    </div>
  </div>
</div>

          <hr className="border-gray-200" />

          {/* Discussion Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Discussion Forum</h2>
            <Posts 
              key={selectedMilestone.id} 
              milestoneId={selectedMilestone.id} 
              userId={account} 
              initialPosts={selectedMilestone.posts}
            />
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default Milestones;