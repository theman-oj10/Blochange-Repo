import Discover from "@/app/discover/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Web3Provider } from "../contexts/Web3Context"
import React from "react";
import WalletConnectButton from '@/components/Wallet/WalletConnect';


export const metadata: Metadata = {
  title:
    "BlocChange",
  description: "Change the World one block at a time",
};

export default function Home() {
  return (
    <>
      <Web3Provider>
      <Discover />
      </Web3Provider>
    </>
  );
}
