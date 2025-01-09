import React, { useState } from 'react';
import { 
  ExternalLink, 
  Receipt, 
  Image as ImageIcon, 
  Package,
  Calendar,
  Clock,
  DollarSign,
  X
} from 'lucide-react';

// Internal interfaces
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

interface ImageModalProps {
  image: WorkImage;
  onClose: () => void;
}

interface WorkDoneDetailsProps {
  transaction: Transaction | null;
  formatAmount: (amount: number) => string;
}

// ImageModal Component
const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div className="relative max-w-4xl w-full mx-4">
      <button
        onClick={onClose}
        className="absolute -top-12 right-0 text-white hover:text-gray-300"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="bg-white rounded-lg overflow-hidden">
        <img 
          src={image.url} 
          alt={image.title}
          className="w-full h-auto"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg">{image.title}</h3>
          <p className="text-gray-600 mt-2">{image.description}</p>
        </div>
      </div>
    </div>
  </div>
);

// Main WorkDoneDetails Component
const WorkDoneDetails: React.FC<WorkDoneDetailsProps> = ({ 
  transaction, 
  formatAmount 
}) => {
  const [selectedImage, setSelectedImage] = useState<WorkImage | null>(null);

  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 py-8">
        Select a transaction to view details
      </div>
    );
  }

  const getTransactionTypeDetails = (type: Transaction['type']) => {
    switch (type) {
      case 'withdrawal':
        return {
          label: 'Withdrawal',
          icon: DollarSign,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'deposit':
        return {
          label: 'Deposit',
          icon: Package,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'payment':
        return {
          label: 'Payment',
          icon: Receipt,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        };
    }
  };

  const typeDetails = getTransactionTypeDetails(transaction.type);
  const TypeIcon = typeDetails.icon;

  return (
    <div className="space-y-6">
      {/* Transaction Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${typeDetails.bgColor}`}>
            <TypeIcon className={`w-5 h-5 ${typeDetails.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Transaction #{transaction.id}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(transaction.timestamp).toLocaleDateString()}
              <Clock className="w-4 h-4 ml-2" />
              {new Date(transaction.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
        <a
          href={`https://polygonscan.com/tx/${transaction.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View on PolygonScan
        </a>
      </div>

      {/* Work Description */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Work Description</h4>
        <p className="text-gray-600 whitespace-pre-wrap">{transaction.workDone}</p>
      </div>

      {/* Work Images */}
      {transaction.workImages && transaction.workImages.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Work Images</h4>
          <div className="grid grid-cols-2 gap-4">
            {transaction.workImages.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50">
                  <p className="text-white text-sm truncate">{image.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Receipts */}
      {transaction.receipts && transaction.receipts.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Receipts</h4>
          <div className="space-y-2">
            {transaction.receipts.map((receipt) => (
              <a
                key={receipt.id}
                href={receipt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{receipt.title}</div>
                    <div className="text-sm text-gray-500">{receipt.date}</div>
                  </div>
                </div>
                <span className="font-medium text-gray-900">
                  {formatAmount(receipt.amount)}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default WorkDoneDetails;