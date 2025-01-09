// /components/WalletConnectButton.js
"use client"

import { useContext } from 'react';
import { Web3Context } from '../../contexts/Web3Context';

const WalletConnectButton = () => {
  const { account, connectWallet, disconnectWallet } = useContext(Web3Context);

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div>
      {account ? (
        <div>
          <span>{truncateAddress(account)}</span>
          <button onClick={disconnectWallet} style={{ marginLeft: '10px' }}>
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default WalletConnectButton;
