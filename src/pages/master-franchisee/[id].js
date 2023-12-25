import React from "react";
import MultiStepForm from "../../components/Forms/MultiStepForm";
import { useRouter } from "next/router";

function MasterFranchiseeDetails() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="bg-white p-8 rounded-xl">
      <MultiStepForm
        action="view"
        type="master"
        id={id}
        title="Master Franchisee Details"
      />
    </div>
  );
}

export default MasterFranchiseeDetails;
