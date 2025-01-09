// /contexts/Web3Context.js
"use client"

import { createContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null); // ethers provider
  const [signer, setSigner] = useState(null); // ethers signer
  const [account, setAccount] = useState(null); // User's account
  const [contract, setContract] = useState(null); // Smart contract instance

  const contractABI = require('../../contracts/CharityPlatform.json').abi;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        network: 'amoy',
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: '3471187b9e04498e97702e0e5ed81dad', // Replace with your Infura ID
            },
          },
          coinbasewallet: {
            package: CoinbaseWalletSDK,
            options: {
              appName: 'Blockchain Charity',
              infuraId: '3471187b9e04498e97702e0e5ed81dad', // Replace with your Infura ID
              rpc: process.env.NEXT_PUBLIC_RPC_URL,
              chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID),
              darkMode: false,
            },
          },
        },
      });

      const instance = await web3Modal.connect();

      const ethersProvider = new ethers.BrowserProvider(instance);
      setProvider(ethersProvider);

      const ethersSigner = await ethersProvider.getSigner();
      setSigner(ethersSigner);

      const userAddress = await ethersSigner.getAddress();
      setAccount(userAddress);

      // Create contract instance
      const charityContract = new ethers.Contract(contractAddress, contractABI, ethersSigner);
      setContract(charityContract);

      // Listen for accounts change
      instance.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });

      // Listen for chain change
      instance.on('chainChanged', (chainId) => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      await web3Modal.clearCachedProvider();
      setProvider(null);
      setSigner(null);
      setAccount(null);
      setContract(null);
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  };

  useEffect(() => {
    if (provider?.provider?.selectedAddress) {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Web3Context.Provider value={{ provider, signer, account, contract, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
