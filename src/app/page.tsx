import Discover from "@/app/discover/page";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "BlocChange",
  description: "Change the World one block at a time",
};

export default function Home() {
  return (
    <>
        <Discover />
    </>
  );
}
