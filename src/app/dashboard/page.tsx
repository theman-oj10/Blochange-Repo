"use client";
import React from "react";
import ChartThree from "@/components//Charts/ChartThree";
import ChartTwo from "@/components//Charts/ChartTwo";
import ChatCard from "@/components//Chat/ChatCard";
import TableOne from "@/components//Tables/TableOne";
import MapOne from "@/components/Maps/MapOne";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const Dashboard: React.FC = () => {
  return (
    <>
    <DefaultLayout>
      <DataStatsOne />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </DefaultLayout>
    </>
  );
};

export default Dashboard;
