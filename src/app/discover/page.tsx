"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import CharityCard from "./CharityCard";
import FilterMenu from "./FilterMenu";
import { getRandomImage } from "../unsplashApi";

const charityCategories = [
  "All", "Animals", "Arts", "Community", "Education", "Environment", "Healthcare", "Overseas", "Social", "Sports"
];

const mockCharities = [
  {
    id: 1,
    name: "Support Children & Youths",
    description: "Help disadvantaged children and youth achieve their potential.",
    raisedAmount: 450,
    goalAmount: 9988,
    daysLeft: 2,
    donorCount: 8,
    category: "Education"
  },
  {
    id: 2,
    name: "Boost seniors' safety and independence",
    description: "Eliminate fall hazards in homes of elderly citizens.",
    raisedAmount: 310,
    goalAmount: 20000,
    daysLeft: 2,
    donorCount: 10,
    category: "Healthcare"
  },
  // Add more mock charities here
];

const Discover: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [charities, setCharities] = useState(mockCharities);

  useEffect(() => {
    const fetchImages = async () => {
      const updatedCharities = await Promise.all(
        mockCharities.map(async (charity) => {
          const imageUrl = await getRandomImage(`${charity.category} charity`);
          return { ...charity, imageUrl };
        })
      );
      setCharities(updatedCharities);
    };

    fetchImages();
  }, []);

  const filteredCharities = selectedCategory === "All"
    ? charities
    : charities.filter(charity => charity.category === selectedCategory);

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Charities</h1>
        
        <FilterMenu
          categories={charityCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredCharities.map((charity) => (
            <CharityCard
              key={charity.id}
              id={charity.id}
              name={charity.name}
              description={charity.description}
              imageUrl={charity.imageUrl || '/images/default-charity-image.jpg'}
              raisedAmount={charity.raisedAmount}
              goalAmount={charity.goalAmount}
              daysLeft={charity.daysLeft}
              donorCount={charity.donorCount}
            />
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Discover;