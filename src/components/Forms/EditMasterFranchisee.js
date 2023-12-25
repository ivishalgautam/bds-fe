import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export default function EditMasterFranchisee() {
  const { register, handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="masterFranchiseeName">Master Franchisee Name</label>
        <input
          type="text"
          id="masterFranchiseeName"
          {...register("masterFranchiseeName")}
        />
      </div>

      <div>
        <label htmlFor="contactNumber">Contact Number</label>
        <input type="text" id="contactNumber" {...register("contactNumber")} />
      </div>

      <div>
        <label htmlFor="state">State</label>
        <input type="text" id="state" {...register("state")} />
      </div>

      <div>
        <label htmlFor="officeAddress">Office Address</label>
        <textarea id="officeAddress" {...register("officeAddress")} />
      </div>

      <div>
        <label htmlFor="gst">GST</label>
        <input type="text" id="gst" {...register("gst")} />
      </div>

      <div>
        <label htmlFor="districts">Districts</label>
        <Controller
          control={control}
          name="districts"
          render={({ field }) => (
            <Select
              {...field}
              options={options}
              isMulti
              placeholder="Select Districts"
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
              menuPosition="absolute"
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="documents">Documents</label>
        <input type="file" accept=".pdf" id="documents" {...register("documents")} multiple />
      </div>

      <div>
        <label htmlFor="subjects">Subjects</label>
        <Controller
          control={control}
          name="subjects"
          render={({ field }) => (
            <Select
              {...field}
              options={options}
              isMulti
              placeholder="Select Subjects"
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              menuPortalTarget={document.body}
              menuPosition="absolute"
            />
          )}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
