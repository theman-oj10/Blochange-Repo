import React from 'react';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Package, 
  Receipt,
  ArrowRight,
  Clock,
  Image as ImageIcon
} from 'lucide-react';

interface TransactionReceipt {
  id: string;
  title: string;
  amount: number;
  date: string;
  url: string;
}

interface WorkImage {
  id: string;
  title: string;
  url: string;
  description: string;
}

interface Transaction {
  id: string;
  amount: number;
  timestamp: number;
  workDone: string;
  status: 'completed' | 'pending';
  type: 'withdrawal' | 'deposit' | 'payment';
  txHash: string;
  receipts: TransactionReceipt[];
  workImages: WorkImage[];
}

interface TransactionListProps {
  transactions: Transaction[];
  selectedTransaction: string | null;
  onTransactionSelect: (id: string) => void;
  formatAmount: (amount: number) => string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  selectedTransaction,
  onTransactionSelect,
  formatAmount
}) => {
  const getTransactionTypeDetails = (type: Transaction['type']) => {
    switch (type) {
      case 'withdrawal':
        return {
          label: 'Withdrawal',
          icon: DollarSign,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'deposit':
        return {
          label: 'Deposit',
          icon: Package,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'payment':
        return {
          label: 'Payment',
          icon: Receipt,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
    }
  };

  return (
    <div>
      <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
        {transactions.map((transaction) => {
          const typeDetails = getTransactionTypeDetails(transaction.type);
          const TypeIcon = typeDetails.icon;
          
          return (
            <button
              key={transaction.id}
              onClick={() => onTransactionSelect(transaction.id)}
              className={`w-full p-5 text-left hover:bg-gray-50 transition-all duration-200
                ${selectedTransaction === transaction.id ? 'bg-blue-50 hover:bg-blue-50' : ''}
                group relative`}
            >
              {/* Selection indicator */}
              {selectedTransaction === transaction.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
              )}
              
              <div className="flex flex-col gap-4">
                {/* Top section with amount, type, and status */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    {/* Amount as title */}
                    <div className="text-xl font-semibold text-gray-900">
                      {formatAmount(transaction.amount)}
                    </div>
                    
                    {/* Type as subtitle */}
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${typeDetails.bgColor} ${typeDetails.borderColor} border`}>
                        <TypeIcon className={`w-4 h-4 ${typeDetails.color}`} />
                      </div>
                      <span className={`text-base ${typeDetails.color}`}>
                        {typeDetails.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium
                      ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                    <ArrowRight className={`w-5 h-5 transition-transform duration-200
                      ${selectedTransaction === transaction.id ? 'transform rotate-90' : ''}
                      ${selectedTransaction === transaction.id ? 'text-blue-500' : 'text-gray-400'}`}
                    />
                  </div>
                </div>

                {/* Bottom row with date/time and attachments */}
                <div className="flex items-center justify-between text-sm">
                  {/* Date and Time */}
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {new Date(transaction.timestamp).toLocaleTimeString([], { timeStyle: 'short' })}
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="flex items-center gap-4 text-gray-500">
                    {transaction.receipts.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Receipt className="w-4 h-4" />
                        <span>{transaction.receipts.length}</span>
                      </div>
                    )}
                    {transaction.workImages.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4" />
                        <span>{transaction.workImages.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {transactions.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No transactions found
        </div>
      )}
    </div>
  );
};

export default TransactionList;