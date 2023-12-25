import React from "react";
import MultiStepForm from "../../../components/Forms/MultiStepForm";
import { useRouter } from "next/router";

function CreateMasterFranchisee() {
  const router = useRouter();
  return (
    <div className="bg-white p-8 rounded-xl">
      <MultiStepForm
        type={router.pathname.includes("master") ? "master" : "sub"}
        title={
          router.pathname.includes("master")
            ? "Create Master Franchisee"
            : "Create Franchisee"
        }
      />
    </div>
  );
}

export default CreateMasterFranchisee;
