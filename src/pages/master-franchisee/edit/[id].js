import React from "react";
import MultiStepForm from "../../../components/Forms/MultiStepForm";
import { useRouter } from "next/router";

function EditFranchisee() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="bg-white p-8 rounded-xl">
      <MultiStepForm
        type={router.pathname.includes("master") ? "master" : "sub"}
        id={id}
        action="edit"
        title="Edit Master Franchisee"
      />
    </div>
  );
}

export default EditFranchisee;
