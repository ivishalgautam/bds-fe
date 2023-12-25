import React from "react";
import { useForm } from "react-hook-form";
// import Modal from "../Modal";

export default function CreateMasterFranchisee() {
  //   const [isOpen, setIsOpen] = useState(false);

  //   const openModal = () => {
  //     setIsOpen(true);
  //   };

  //   const closeModal = () => {
  //     setIsOpen(false);
  //   };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Prepare form data for file uploads
    const formData = new FormData();
    formData.append("masterFranchiseeName", data.masterFranchiseeName);
    formData.append("contactNumber", data.contactNumber);
    formData.append("state", data.state);
    formData.append("officeAddress", data.officeAddress);
    formData.append("gst", data.gst);
    formData.append("districts", data.districts);
    // formData.append("subjects", data.subjects);

    // Append files to the form data
    data.documents.forEach((file) => {
      formData.append("documents", file);
    });

    // Perform API call with the form data
    // Replace this with your actual API call to handle the form submission
    // You can send the formData object to your backend server

    // Example API call:
    // fetch('/api/submit-form', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // Handle the response from the server
    //   })
    //   .catch((error) => {
    //     // Handle any error that occurred during the API call
    //   });
  };

  return (
    <div>
      {/* <button onClick={openModal}>Open Modal</button> */}

      {/* <Modal isOpen={isOpen} onClose={closeModal}> */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <input
              type="text"
              id="masterFranchiseeName"
              placeholder="Master Franchisee Name"
              className="w-full px-4 py-3 rounded-md outline-none bg-gray-100"
              {...register("masterFranchiseeName", {
                required: "This field is required",
              })}
            />
            {errors.masterFranchiseeName && (
              <p className="text-red-600">
                {errors.masterFranchiseeName.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              id="contactNumber"
              placeholder="Contact Number"
              className="w-full px-4 py-3 rounded-md outline-none bg-gray-100"
              {...register("contactNumber", {
                required: "This field is required",
              })}
            />
            {errors.contactNumber && (
              <p className="text-red-600">{errors.contactNumber.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              id="state"
              placeholder="State"
              className="w-full px-4 py-3 rounded-md outline-none bg-gray-100"
              {...register("state", { required: "This field is required" })}
            />
            {errors.state && (
              <p className="text-red-600">{errors.state.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              id="officeAddress"
              placeholder="Office Address"
              className="w-full px-4 py-3 rounded-md outline-none bg-gray-100"
              {...register("officeAddress", {
                required: "This field is required",
              })}
            />
            {errors.officeAddress && (
              <p className="text-red-600">{errors.officeAddress.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              id="gst"
              placeholder="GST"
              className="w-full px-4 py-3 rounded-md outline-none bg-gray-100"
              {...register("gst", { required: "This field is required" })}
            />
            {errors.gst && <p className="text-red-600">{errors.gst.message}</p>}
          </div>

          <div>
            <input
              type="text"
              id="districts"
              placeholder="Districts"
              className="w-full px-4 py-3 rounded-md outline-none bg-gray-100"
              {...register("districts", {
                required: "This field is required",
              })}
            />
            {errors.districts && (
              <p className="text-red-600">{errors.districts.message}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="relative border rounded-md overflow-hidden">
            <input
              type="file"
              id="documents"
              {...register("documents", {
                required: "This field is required",
              })}
              multiple
              accept=".pdf"
              className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="p-4 text-center">
              <span className="text-gray-500">Upload Your Documents Here</span>
            </div>
          </div>
          {errors.documents && (
            <p className="text-red-500">{errors.documents.message}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-full"
          >
            Create
          </button>
        </div>
      </form>
      {/* </Modal> */}
    </div>
  );
}
