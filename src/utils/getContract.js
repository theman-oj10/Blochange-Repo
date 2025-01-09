import { ethers } from 'ethers';
import CharityPlatform from '../contracts/CharityPlatform.json';

export const getContract = (signer) => {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  return new ethers.Contract(contractAddress, CharityPlatform.abi, signer);
};
