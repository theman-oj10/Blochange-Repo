import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CreateMilestone from '@/components/Project/CreateMilestone'

export const metadata: Metadata = {
  title: "Blochange Settings Page",
  description: "This is Blochange Settings page",
};

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Create Milestones" />

        <CreateMilestone />
      </div>
    </DefaultLayout>
  );
};

export default Settings;
