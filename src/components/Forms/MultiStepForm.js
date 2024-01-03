import { useContext, useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Title from "../Title";
import axios from "axios";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { AiOutlineFileDone, AiFillCloseCircle } from "react-icons/ai";
import { useRouter } from "next/router";
import useLocalStorage from "@/utils/useLocalStorage";
import { MainContext } from "@/store/context";
import Modal from "@/components/Modal";
import DocViewerApp from "@/components/DocViewerApp";
import toast from "react-hot-toast";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { isObject } from "@/utils/object";

function MultiStepForm({ type, id, action, title }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();
  const [token] = useLocalStorage("token");
  const [docs, setDocs] = useState([{}]);
  const [openDocViewer, setOpenDocViewer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
      office_address: "",
      district: [],
      state: "",
      country: "",
      pin_code: "",
      masterFranchiseeName: "",
      contactNumber: "",
    },
  });
  const [isFirstFormSubmitted, setIsFirstFormSubmitted] = useState(
    action === "edit" || action === "view" ? true : false
  );
  const [userError, setUserError] = useState("");
  const [documents, setDocuments] = useState([]);
  const [franchiseeId, setFranchiseeId] = useState(null);
  const [franchisees, setFranchisees] = useState(null);

  const districtOptions = [
    { value: "district1", label: "District 1" },
    { value: "district2", label: "District 2" },
    { value: "district3", label: "District 3" },
  ];

  const { user } = useContext(MainContext);

  //Prefilled Data
  useEffect(() => {
    const fetchDetails = async () => {
      const data = await http().get(`${endpoints.franchisee.getAll}/${id}`);
      const addressData = await http().get(
        `${endpoints.address.getAll}/${data.user_id}`
      );

      const selectedMasterFranchisee = franchisees?.find(
        (item) => item?.value === data?.franchisee_id
      );

      setValue(
        "masterFranchisee",
        selectedMasterFranchisee ? selectedMasterFranchisee : ""
      );
      setValue("masterFranchiseeName", data.franchisee_name);
      setValue("gst", data.gst_number);
      setValue("documents", data.document_url);
      setValue("officeAddress", addressData.office_address);
      setValue("pin_code", addressData.pin_code);
      setValue("state", addressData.state);
      setValue("country", addressData.country);

      const getDistrictOptions = (preselectedDistricts) => {
        return districtOptions.filter((district) =>
          preselectedDistricts.includes(district.value)
        );
      };
      setValue("districts", getDistrictOptions(addressData.district));
      setDocuments(data.document_url);
      setFranchiseeId(data.id);
    };
    // Fetch details only if id and action are present
    if ((action === "edit" && id) || (action === "view" && id)) {
      fetchDetails();
    }
  }, [franchiseeId, id]);

  useEffect(() => {
    const fetchFranchisees = async () => {
      if (user?.role === "admin") {
        const data = await http().get(endpoints.franchisee.getAll);
        const formatedData = data?.map((item) => {
          return { value: item.id, label: item.franchisee_name };
        });
        setFranchisees(formatedData);
      } else if (user?.id) {
        const data = await http().get(endpoints.franchisee.getAll);
        const currentFranchisee = data?.filter(
          (item) => item?.user_id === user?.id
        );
        const currentMF = currentFranchisee?.map((item) => {
          return { value: item.id, label: item.franchisee_name };
        });
        // setValue("masterFranchisee", currentMF[0]);
        setFranchisees(currentMF);
      }
    };

    fetchFranchisees();
  }, [user]);

  const handleUsername = async (event) => {
    const username = event.target.value;
    if (username.trim().length) {
      try {
        const response = await http().post(endpoints.auth.username, {
          username: username,
        });
        setUserError("");
      } catch (error) {
        setUserError(error.message);
      }
    }
  };

  const onSubmitFirstForm = async (data) => {
    setIsFirstFormSubmitted(true);
  };

  const onSubmitSecondForm = async (data) => {
    const userPayload = {
      username: data.username,
      email: data.email,
      password: data.password,
      role: type === "master" ? "master_franchisee" : "sub_franchisee",
      mobile_number: data.mobile_number,
    };

    const selectedDistricts = data.districts.map((district) => district.value);

    const addressPayload = {
      office_address: data.officeAddress,
      district: selectedDistricts,
      state: data.state,
      country: data.country,
      pin_code: data.pin_code,
    };

    const franchiseePayload = {
      franchisee_name: data.masterFranchiseeName,
      gst_number: data.gst,
      password: data.password,
      document_url: documents,
      ...(data.masterFranchisee?.value && {
        franchisee_id: data.masterFranchisee.value,
      }),
    };

    const formData = new FormData();
    formData.append("franchisee_name", data.masterFranchiseeName);
    formData.append("gst_number", data.gst);
    formData.append("franchisee_id", data.masterFranchisee?.value);

    try {
      // First API request
      if (action === "edit") {
        // Second API request
        const response2 = await http().put(
          `${endpoints.franchisee.getAll}/${franchiseeId}`,
          {
            ...franchiseePayload,
            // user_id: id,
          }
        );

        const userId = response2[1]?.user_id;

        // Third API request
        const response3 = await http().put(
          `${endpoints.address.create}/${userId}`,
          {
            ...addressPayload,
            // user_id: id,
          }
        );
        if (response2.error) {
          toast.error(response2.message);
        } else toast.success("Updated successfully.");

        if (type === "master") {
          router.push("/master-franchisee");
        } else {
          router.push("/sub-franchisee");
        }
      } else {
        const response1 = await http().post(endpoints.createUser, userPayload);
        const userId = response1.id;
        formData.append("user_id", userId);

        // Second API request
        const response2 = await http().post(endpoints.franchisee.getAll, {
          ...franchiseePayload,
          user_id: userId,
        });

        // Third API request
        const response3 = await http().post(endpoints.address.create, {
          ...addressPayload,
          user_id: userId,
        });

        if (type === "master") {
          router.push("/master-franchisee");
        } else {
          router.push("/sub-franchisee");
        }
      }

      // Process the responses or perform additional operations
    } catch (error) {
      // Handle any errors that occur during the API requests
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(JSON.stringify(error));
      }
    }
  };

  const handleDocuments = async (event) => {
    try {
      const selectedFiles = Array.from(event.target.files);
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("file", file);
      });
      if (selectedFiles) {
        const response = await axios.post(
          `${baseUrl}${endpoints.files.upload}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDocuments((prevDocuments) => [
          ...prevDocuments,
          ...response.data.path,
        ]);
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
    }
  };

  const handleDeleteFile = (index) => {
    // Create a copy of the current files array and remove the file at the specified index
    if (action === "view") {
      return false;
    }

    const updatedFiles = [...documents];
    updatedFiles.splice(index, 1);
    setDocuments(updatedFiles);
  };

  const renderIcons = (number) => {
    const icons = [];

    for (let i = 0; i < number; i++) {
      icons.push(
        <div key={i} className="relative">
          <AiOutlineFileDone
            size={40}
            className="mr-2"
            onClick={() => {
              const fileName = documents[i].split("/").slice(-1)[0];
              console.log(fileName);
              const docs = [
                {
                  uri: `${baseUrl}${endpoints.files.getFiles}?file_path=${fileName}`,
                  fileName: fileName,
                },
              ];
              setDocs(docs);
              setOpenDocViewer(true);
            }}
          />
          <AiFillCloseCircle
            className="absolute -top-1 right-2 cursor-pointer text-red-600 w-5 h-5"
            // size={40}
            onClick={() => handleDeleteFile(i)}
          />
        </div>
      );
    }

    return icons;
  };

  return (
    <div>
      {!isFirstFormSubmitted ? (
        <form
          onSubmit={handleSubmit(onSubmitFirstForm)}
          id="form1"
          className="space-y-6"
        >
          <Title text="Create User" />
          <div className="grid grid-cols-2 gap-6">
            <div>
              {/* <label htmlFor="username">Username:</label> */}
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                {...register("username", { required: "Username is required" })}
                onBlur={handleUsername} // Add onBlur event handler
              />
              {errors.username && (
                <span className="text-red-600">{errors.username.message}</span>
              )}
              {userError && <span className="text-red-600">{userError}</span>}
            </div>

            <div>
              {/* <label htmlFor="email">Email:</label> */}
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
              />
              {errors.email && (
                <span className="text-red-600">{errors.email.message}</span>
              )}
            </div>

            <div>
              {/* <label htmlFor="password">Password:</label> */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 pr-10 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
                      message: (
                        <div>
                          Password length should be greater than 8 and less than
                          30 characters.
                          <br />
                          Contains at least one uppercase letter (A-Z).
                          <br />
                          Contains at least one lowercase letter (a-z).
                          <br />
                          Contains at least one digit (0-9).
                          <br />
                          Contains at least one special character from the set
                          #?!@$%^&*-.
                        </div>
                      ),
                    },
                  })}
                />
                <span
                  className="block absolute right-3 top-[50%] -translate-y-[50%] cursor-pointer z-50"
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                </span>
              </div>
              {errors.password && (
                <span className="text-red-600">{errors.password.message}</span>
              )}
            </div>

            <div>
              {/* <label htmlFor="mobile_number">Mobile Number:</label> */}
              <input
                type="text"
                id="mobile_number"
                name="mobile_number"
                placeholder="Mobile Number"
                className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                {...register("mobile_number", {
                  required: "Mobile Number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid mobile number",
                  },
                })}
              />
              {errors.mobile_number && (
                <span className="text-red-600">
                  {errors.mobile_number.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary px-6 py-2 text-white rounded-full font-mulish"
          >
            Next
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmitSecondForm)}
          id="form2"
          className="space-y-8"
        >
          <Title text={title} />
          {type !== "master" && user?.role !== "master_franchisee" && (
            <div>
              <Controller
                control={control}
                name="masterFranchisee"
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isDisabled={user?.role !== "admin"}
                    options={franchisees}
                    placeholder="Select Master Franchisee"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={
                      typeof window !== "undefined" && document.body
                    }
                    menuPosition="absolute"
                    className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  />
                )}
              />
              {errors.masterFranchisee && (
                <p className="text-red-600">
                  {errors.masterFranchisee.message}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <input
                type="text"
                id="masterFranchiseeName"
                disabled={action === "view"}
                placeholder={
                  type === "master"
                    ? "Master Franchisee Name"
                    : "Franchisee Name"
                }
                className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
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

            {/* <div>
              <input
                type="text"
                id="contactNumber"
                placeholder="Contact Number"
                className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                {...register("contactNumber", {
                  required: "This field is required",
                })}
              />
              {errors.contactNumber && (
                <p className="text-red-600">{errors.contactNumber.message}</p>
              )}
            </div> */}

            <div>
              {/* <label htmlFor="country">Country</label> */}
              <input
                id="country"
                type="text"
                disabled={action === "view"}
                placeholder="Country"
                className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                {...register("country", { required: true })}
              />
              {errors.country && (
                <span className="text-red-600">This field is required</span>
              )}
            </div>

            <div>
              {/* <label htmlFor="pin_code">Pin Code</label> */}
              <input
                id="pin_code"
                type="text"
                placeholder="Pin Code"
                disabled={action === "view"}
                className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                {...register("pin_code", { required: true })}
              />
              {errors.pin_code && (
                <span className="text-red-600">This field is required</span>
              )}
            </div>

            <div>
              <input
                type="text"
                id="state"
                placeholder="State"
                disabled={action === "view"}
                className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
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
                disabled={action === "view"}
                className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
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
                disabled={action === "view"}
                className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                {...register("gst", { required: "This field is required" })}
              />
              {errors.gst && (
                <p className="text-red-600">{errors.gst.message}</p>
              )}
            </div>
            <div>
              <Controller
                control={control}
                name="districts"
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={districtOptions}
                    placeholder="Districts"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={
                      typeof window !== "undefined" && document.body
                    }
                    menuPosition="absolute"
                    isDisabled={action === "view"}
                    className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  />
                )}
              />
              {errors.districts && (
                <p className="text-red-600">{errors.districts.message}</p>
              )}
            </div>
          </div>

          <div className="mb-4 border p-4 rounded-md overflow-hidden">
            <div className="flex gap-2">{renderIcons(documents.length)}</div>
            <div className="relative">
              <input
                type="file"
                id="documents"
                disabled={action === "view"}
                // {...register("documents", {
                //   required: "This field is required",
                // })}
                multiple
                onChange={handleDocuments}
                accept=".pdf"
                className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-4 text-center">
                <span className="text-gray-500">
                  {action !== "view" ? " Upload Your Documents Here" : ""}
                </span>
              </div>
            </div>
            {/* {errors.documents && (
              <p className="text-red-500">{errors.documents.message}</p>
            )} */}
          </div>

          <div className="flex justify-center">
            {action !== "view" && (
              <button
                type="submit"
                className="bg-primary text-white w-24 py-2 rounded-full"
              >
                {action === "edit" ? "Update" : "Submit"}
              </button>
            )}
          </div>
        </form>
      )}
      <Modal isOpen={openDocViewer} onClose={() => setOpenDocViewer(false)}>
        <DocViewerApp docs={docs} />
      </Modal>
    </div>
  );
}

export default MultiStepForm;
