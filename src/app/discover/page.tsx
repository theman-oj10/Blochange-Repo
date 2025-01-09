"use client";

import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CharityCard from "@/components/CharityCard";
import FilterMenu from "@/components/FilterMenu";
import { getRandomImage } from "../unsplashApi";

const charityCategories = [
  "All",
  "Animals",
  "Arts",
  "Community",
  "Education",
  "Environment",
  "Healthcare",
  "Overseas",
  "Social",
  "Sports",
];

const Discover = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9; // Number of charities per page

  useEffect(() => {
    const fetchCharitiesWithImages = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construct query parameters
        const params = new URLSearchParams({
          category: selectedCategory,
          page: currentPage.toString(),
          limit: limit.toString(),
        });

        const response = await fetch(`/api/getProjects?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch charities");
        }

        const data = await response.json();
        const { projects, total, pages } = data;

        const updatedCharities = await Promise.all(
          projects.map(async (charity: any) => {
            try {
              const imageUrl = await getRandomImage(`${charity.category} charity`);
              return { ...charity, imageUrl };
            } catch (imgError) {
              console.error(`Error fetching image for ${charity.name}:`, imgError);
              return { ...charity, imageUrl: "/images/default-charity-image.jpg" }; // Fallback image
            }
          })
        );

        setCharities(updatedCharities);
        setTotalPages(pages);
      } catch (err) {
        console.error("Error fetching charities:", err);
        setError(err.message || "Failed to load charities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharitiesWithImages();
  }, [selectedCategory, currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Charities</h1>

        <FilterMenu
          categories={charityCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {loading ? (
          <p className="text-center text-gray-500">Loading charities...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : charities.length === 0 ? (
          <p className="text-center text-gray-500">No charities found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {charities.map((charity) => (
                <CharityCard
                  key={charity.id}
                  id={charity.id}
                  name={charity.name}
                  description={charity.description}
                  imageUrl={charity.imageUrl || "/images/default-charity-image.jpg"}
                  raisedAmount={charity.raisedAmount}
                  goalAmount={charity.goalAmount}
                  daysLeft={charity.daysLeft}
                  donorCount={charity.donorCount}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Discover;
