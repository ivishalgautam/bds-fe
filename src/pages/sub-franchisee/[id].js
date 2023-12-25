import React from "react";
import MultiStepForm from "../../components/Forms/MultiStepForm";
import { useRouter } from "next/router";

function SubFranchiseeDetails() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="bg-white p-8 rounded-xl">
      <MultiStepForm
        action="view"
        type="sub"
        id={id}
        title="Sub Franchisee Details"
      />
    </div>
  );
}

export default SubFranchiseeDetails;
