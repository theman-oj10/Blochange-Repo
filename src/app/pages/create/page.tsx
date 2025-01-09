import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CreateProject from '@/components/Project/CreateProject'

export const metadata: Metadata = {
  title: "Blochange Settings Page",
  description: "This is Blochange Settings page",
};

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Create A Project" />

        <CreateProject />
      </div>
    </DefaultLayout>
  );
};

export default Settings;
