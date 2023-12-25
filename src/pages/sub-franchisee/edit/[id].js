import React from "react";
import MultiStepForm from "../../../components/Forms/MultiStepForm";
import { useRouter } from "next/router";

function EditSubFranchisee() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="bg-white p-8 rounded-xl">
      <MultiStepForm
        action="edit"
        type="sub"
        id={id}
        title="Edit Sub Franchisee"
      />
    </div>
  );
}

export default EditSubFranchisee;
