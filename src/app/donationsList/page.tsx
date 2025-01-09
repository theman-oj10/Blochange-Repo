"use client"
import React, { useState, useEffect, useContext } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DonationCard from "@/components/DonationCard";
import { Web3Context } from "@/contexts/Web3Context"; // Assuming you have a Web3 context

const DonationHistory: React.FC = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const { account, connectWallet, disconnectWallet } = useContext(Web3Context);

  useEffect(() => {
    const fetchDonationHistory = async () => {

      try {
        const response = await fetch(`/api/getDonationHistory?address=${account}`);
        const data = await response.json();
        setDonationHistory(data.donations);
      } catch (error) {
        console.error("Error fetching donation history:", error);
      }
    };

    fetchDonationHistory();
  }, [account]);

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Donation History</h1>
        
        {donationHistory.length === 0 ? (
          <p>You have not made any donations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {donationHistory.map((donation) => (
              <DonationCard
                key={donation.projectId}
                id={donation.projectId}
                name={donation.name}
                description={donation.description}
                imageUrl={donation.imageUrl || '/images/default-charity-image.jpg'} // Add imageUrl if needed
                raisedAmount={donation.raisedAmount}
                goalAmount={donation.goalAmount}
                daysLeft={donation.daysLeft}
                donorCount={donation.donorCount}
                amountDonated={donation.amountDonated}
              />
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default DonationHistory;
