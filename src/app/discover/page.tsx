"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchCharitiesWithImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/getProjects?category=${selectedCategory}&limit=10`);
        if (!response.ok) {
          throw new Error("Failed to fetch charities");
        }
        const data = await response.json();
        const { projects } = data;

        const updatedCharities = await Promise.all(
          projects.map(async (charity) => {
            const imageUrl = await getRandomImage(`${charity.category} charity`);
            return { ...charity, imageUrl };
          })
        );
        setCharities(updatedCharities);

        // Fetch user's donations (this is a mock, replace with actual API call)
        const mockDonations = [
          { id: 1, name: "Save the Oceans", amount: 50 },
          { id: 2, name: "Education for All", amount: 100 },
          { id: 3, name: "Local Food Bank", amount: 75 },
        ];
        setDonations(mockDonations);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load charities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharitiesWithImages();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCarouselIndex(0);
  };

  const nextSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % charities.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + charities.length) % charities.length);
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
            {/* Carousel */}
            <div className="relative mb-12">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {charities.map((charity) => (
                    <div key={charity.id} className="w-full flex-shrink-0">
                      <CharityCard
                        id={charity.id}
                        name={charity.name}
                        description={charity.description}
                        imageUrl={charity.imageUrl || "/images/default-charity-image.jpg"}
                        raisedAmount={charity.raisedAmount}
                        goalAmount={charity.goalAmount}
                        daysLeft={charity.daysLeft}
                        donorCount={charity.donorCount}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Your Donations */}
            <h2 className="text-2xl font-bold mb-4">Your Donations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((donation) => (
                <div key={donation.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold">{donation.name}</h3>
                  <p className="text-green-600 font-bold">${donation.amount} donated</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Discover;