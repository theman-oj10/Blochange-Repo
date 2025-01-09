"use client";

import React, { useState, useContext, useEffect } from "react";
import { Web3Context } from "@/contexts/Web3Context";
import { ethers } from "ethers";

const CreateProject = () => {
  const { contract, account } = useContext(Web3Context);
  const [beneficiary, setBeneficiary] = useState("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmountUSD, setGoalAmountUSD] = useState("");
  const [goalAmountCrypto, setGoalAmountCrypto] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [conversionRate, setConversionRate] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState("ethereum");

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=usd`);
        const data = await response.json();
        setConversionRate(data[selectedCrypto].usd);
      } catch (error) {
        console.error("Error fetching conversion rate:", error);
      }
    };

    fetchConversionRate();
    const interval = setInterval(fetchConversionRate, 60000);

    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const handleUSDChange = (value) => {
    // Allow only numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      parts.pop();
    }
    const sanitizedValue = parts.join('.');

    setGoalAmountUSD(sanitizedValue);
    if (conversionRate && sanitizedValue !== "") {
      setGoalAmountCrypto((parseFloat(sanitizedValue) / conversionRate).toFixed(6));
    } else {
      setGoalAmountCrypto("");
    }
  };

  const handleCryptoChange = (value) => {
    // Allow only numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      parts.pop();
    }
    const sanitizedValue = parts.join('.');

    setGoalAmountCrypto(sanitizedValue);
    if (conversionRate && sanitizedValue !== "") {
      setGoalAmountUSD((parseFloat(sanitizedValue) * conversionRate).toFixed(2));
    } else {
      setGoalAmountUSD("");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!beneficiary || !projectName || !description || !goalAmountCrypto) {
      alert("Please fill in all fields.");
      return;
    }

    if (!contract) {
      alert("Contract is not initialized.");
      return;
    }

    try {
      setTxStatus("Initiating transaction...");
      const tx = await contract.createProject(
        beneficiary,
        ethers.parseEther(goalAmountCrypto)
      );
      setTxStatus("Transaction sent. Waiting for confirmation...");
      const receipt = await tx.wait();
      setTxStatus("Project created successfully!");

      const event = receipt.logs.find(
        (log) =>
          log.address.toLowerCase() ===
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.toLowerCase()
      );
      const parsedEvent = contract.interface.parseLog(event);
      const projectId = parsedEvent.args.projectId.toString();

      const response = await fetch("/api/saveProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          beneficiary,
          projectName,
          description,
          goalAmount: ethers.parseEther(goalAmountCrypto).toString(),
          goalAmountUSD,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save project to database");
      }

      const data = await response.json();
      console.log("Project saved:", data.project);
    } catch (error) {
      console.error("Error creating project:", error);
      setTxStatus("Transaction failed.");
    }
  };


  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="rounded-lg border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h3 className="text-lg font-medium text-dark dark:text-white">
            Create a New Project
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreateProject}>
            <div className="mb-5">
              <label
                htmlFor="beneficiary"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                Beneficiary Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="beneficiary"
                  name="beneficiary"
                  placeholder="0x..."
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  className="w-full rounded-md border border-stroke bg-white py-2.5 pl-3 pr-4 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="projectName"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                Project Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-md border border-stroke bg-white py-2.5 pl-3 pr-4 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  placeholder="Project description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-stroke bg-white py-2.5 pl-3 pr-4 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Goal Amount
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    id="goalAmountUSD"
                    name="goalAmountUSD"
                    placeholder="USD"
                    value={goalAmountUSD}
                    onChange={(e) => handleUSDChange(e.target.value)}
                    className="w-full rounded-md border border-stroke bg-white py-2.5 pl-3 pr-4 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    USD
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="goalAmountCrypto"
                    name="goalAmountCrypto"
                    placeholder={selectedCrypto === "ethereum" ? "ETH" : "MATIC"}
                    value={goalAmountCrypto}
                    onChange={(e) => handleCryptoChange(e.target.value)}
                    className="w-full rounded-md border border-stroke bg-white py-2.5 pl-3 pr-4 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                  <select
                    value={selectedCrypto}
                    onChange={(e) => setSelectedCrypto(e.target.value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-gray-500"
                  >
                    <option value="ethereum">ETH</option>
                    <option value="matic-network">MATIC</option>
                  </select>
                </div>
              </div>
              {conversionRate && (
                <p className="mt-2 text-sm text-gray-500">
                  1 USD = {(1 / conversionRate).toFixed(6)} {selectedCrypto === "ethereum" ? "ETH" : "MATIC"}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setBeneficiary("");
                  setProjectName("");
                  setDescription("");
                  setGoalAmount("");
                  setTxStatus("");
                }}
                className="rounded-md border border-stroke px-6 py-2 text-sm font-medium text-dark hover:bg-gray-100 dark:border-dark-3 dark:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Create Project
              </button>
            </div>
          </form>
          {txStatus && (
            <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
              {txStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
