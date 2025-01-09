import React from 'react';
import { ExternalLink, Clock, ArrowRightCircle, DollarSign } from 'lucide-react';

const MilestoneTransactions = () => {
  const transactions = [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      from: '0xD69c056085aB9615006DE618A20FC5616B4D0499',
      to: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      timeStamp: '1696486800',
      value: '1000000000000000000',
      input: 'vote',
      type: 'Vote Cast'
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      from: '0x8c851d1a123ff703bd1f9dabe631b69902df5f97',
      to: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      timeStamp: '1696400400',
      value: '5000000000000000000',
      input: 'fund',
      type: 'Funding'
    },
    {
      hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
      from: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      to: '0xD69c056085aB9615006DE618A20FC5616B4D0499',
      timeStamp: '1696314000',
      value: '3000000000000000000',
      input: 'release',
      type: 'Fund Release'
    }
  ];

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTransactionType = (type) => {
    return type;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[400px] overflow-hidden">
      <div className="h-full overflow-y-auto p-4">
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div 
              key={tx.hash} 
              className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-colors duration-200"
            >
              <div className="p-3">
                {/* Transaction Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1 text-sm font-medium text-blue-600">
                    <ArrowRightCircle className="w-3 h-3" />
                    {getTransactionType(tx.type)}
                  </span>
                  <a 
                    href={`https://polygonscan.com/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">From</div>
                    <div className="font-medium">{formatAddress(tx.from)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">To</div>
                    <div className="font-medium">{formatAddress(tx.to)}</div>
                  </div>
                </div>

                {/* Transaction Footer */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(tx.timeStamp)}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <DollarSign className="w-3 h-3" />
                    {parseFloat(tx.value / 1e18).toFixed(6)} MATIC
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestoneTransactions;