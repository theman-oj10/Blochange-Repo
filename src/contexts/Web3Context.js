"use client";

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

  // Set up a default provider using Infura for read-only access
  const defaultProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

  // Separate function for initializing the contract
  const initializeContract = async (ethersProvider, isSigner = false) => {
    let contractInstance;
    if (isSigner) {
      const signerInstance = await ethersProvider.getSigner();
      contractInstance = new ethers.Contract(contractAddress, contractABI, signerInstance);
      console.log('Contract initialized with signer');
    } else {
      contractInstance = new ethers.Contract(contractAddress, contractABI, ethersProvider);
      console.log('Contract initialized with default provider');
    }
    setContract(contractInstance);
  };

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        network: 'amoy',
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: 'YOUR_INFURA_ID', // Replace with your Infura ID
            },
          },
          coinbasewallet: {
            package: CoinbaseWalletSDK,
            options: {
              appName: 'Blockchain Charity',
              infuraId: 'YOUR_INFURA_ID', // Replace with your Infura ID
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

      // Initialize contract with signer (for connected wallet)
      initializeContract(ethersProvider, true);

      // Store account in localStorage for persistence across page reloads
      localStorage.setItem('account', userAddress);

      // Listen for accounts change
      instance.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        localStorage.setItem('account', accounts[0]); // Update stored account on change
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

      // Clear localStorage
      localStorage.removeItem('account');

      // Re-initialize contract with default provider (read-only mode)
      initializeContract(defaultProvider);
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  };

  useEffect(() => {
    // Check if there's an account connected from previous sessions
    const savedAccount = localStorage.getItem('account');

    if (savedAccount) {
      // Reconnect wallet and reinitialize contract with saved account
      window.ethereum.request({ method: 'eth_accounts' }).then(async (accounts) => {
        if (accounts.length > 0 && !account) {
          const ethersProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(ethersProvider);

          // Get the signer asynchronously
          const signerAccount = await ethersProvider.getSigner();
          setSigner(signerAccount);

          const address = await signerAccount.getAddress();
          setAccount(address);

          // Initialize contract with signer
          initializeContract(ethersProvider, true);
        }
      });
    } else {
      // Initialize contract with default provider (read-only mode) for users not connected
      initializeContract(defaultProvider);
    }
  }, []);


  useEffect(() => {
    if (contract) {
      console.log('Post init: ', contract);
    }
  }, [contract]); // Watching contract for changes

  return (
    <Web3Context.Provider value={{ account, provider, contract, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};
