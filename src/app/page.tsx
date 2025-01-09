import Discover from "@/app/discover/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Web3Provider } from "../contexts/Web3Context"
import React from "react";
import WalletConnectButton from '@/components/Wallet/WalletConnect';
import CreateProject from '@/components/Project/CreateProject'


export const metadata: Metadata = {
  title:
    "Blochange",
  description: "Change the World one block at a time",
};

export default function Home() {
  return (
    <>
      <Discover />
    </>
  );
}
