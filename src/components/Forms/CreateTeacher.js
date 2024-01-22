import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Spinner from "../Spinner";
import UploadImg from "../../assets/upload.svg";
import useLocalStorage from "@/utils/useLocalStorage";
import Image from "next/image";
import axios from "axios";
import { AiFillCloseCircle, AiOutlineFileDone } from "react-icons/ai";
import moment from "moment";
import Modal from "@/components/Modal";
import DocViewerApp from "@/components/DocViewerApp";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Select from "react-select";

function CreateTeacher({ type, id, handleUpdate, userRole, handleCreate }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const [userError, setUserError] = useState("");
  const [featured, setFeatured] = useState(null);
  const [featuredErr, setFeaturedErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [token] = useLocalStorage("token");
  const [docs, setDocs] = useState([{}]);
  const [openDocViewer, setOpenDocViewer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      console.error("Error uploading documents: ", error);
    }
  };

  const handleDeleteFile = (index) => {
    // Create a copy of the current files array and remove the file at the specified index
    if (type === "view") {
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
            className="absolute -top-1 right-2 cursor-pointer text-red-600 w-3 h-3"
            onClick={() => handleDeleteFile(i)}
          />
        </div>
      );
    }

    return icons;
  };

  const handleFileChange = async (event) => {
    setLoading(true);
    try {
      const selectedFile = event.target.files[0];
      console.log(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);
      console.log("formData=>", formData);
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
      setFeatured(response.data.path[0]);
      setFeaturedErr("");

      console.log("Upload successful:", response.data.path[0]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUsername = async (event) => {
    const username = event.target.value;
    if (username.trim().length) {
      try {
        const response = await http().post(endpoints.auth.username, {
          username: username,
        });
        setUserError("");
        console.log(response.data);
      } catch (error) {
        setUserError(error.message);
      }
    }
  };
  const maxDate = moment().format("YYYY-MM-DD");
  const studentTypeData = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values

    const fetchData = async () => {
      try {
        const data = await http().get(`${endpoints.createUser}/${id}`);
        console.log({ data });
        const dob = moment(data.birth_date).format("YYYY-MM-DD");
        setValue("username", data.username);
        setValue("first_name", data.first_name);
        setValue("last_name", data.last_name);
        setValue("email", data.email);
        setValue("dob", dob);
        setValue("mobile_number", data.mobile_number);
        setValue("profession", data.profession);
        setValue("address", data.address);
        setValue(
          "is_online",
          studentTypeData.find((so) => so.value === data.is_online)
        );
        setFeatured(data.image_url);
        setDocuments(data.document_url);
      } catch (error) {
        console.error(error);
      }
    };
    if ((type === "edit" && id) || (type === "view" && id)) {
      fetchData();
    }
  }, [setValue, type, id]);

  const onSubmit = async (data) => {
    const dob = moment(data.dob).format("MM/DD/YYYY");
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      mobile_number: data.mobile_number,
      profession: data.profession,
      document_url: documents,
      image_url: featured,
      birth_date: dob,
      address: data.address,
      first_name: data.first_name,
      last_name: data.last_name,
      is_online: data.is_online.value,
    };

    if (userError) return;
    if (type !== "view") {
      if (featuredErr) return;

      if (!featured) {
        setFeaturedErr("This field is required.");
        return;
      }
    }
    if (type === "add") {
      handleCreate({ ...payload, role: userRole });
    } else {
      handleUpdate({
        ...payload,
        image_url: featured,
      });
    }

    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} id="form1" className="space-y-6">
        <Title
          text={
            type === "edit"
              ? `Edit ${userRole === "teacher" ? "Teacher" : "Student"} `
              : type === "view"
              ? `${userRole === "teacher" ? "Teacher" : "Student"} Details`
              : `Create ${userRole === "teacher" ? "Teacher" : "Student"}`
          }
        />
        <div className="grid grid-cols-2 gap-6">
          <div>
            {/* <label htmlFor="name">Name</label> */}
            <input
              type="text"
              placeholder="First Name"
              disabled={type === "view"}
              className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              {...register("first_name", {
                required: "Full Name is required",
              })}
            />
            {errors.first_name && (
              <p className="text-red-600">{errors.first_name.message}</p>
            )}
          </div>
          <div>
            {/* <label htmlFor="name">Name</label> */}
            <input
              type="text"
              placeholder="Last Name"
              disabled={type === "view"}
              className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              {...register("last_name", {
                required: "Last Name is required",
              })}
            />
            {errors.last_name && (
              <p className="text-red-600">{errors.last_name.message}</p>
            )}
          </div>
          <div>
            {/* <label htmlFor="username">Username:</label> */}
            <input
              type="text"
              id="username"
              name="username"
              disabled={type === "view"}
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
              disabled={type === "view"}
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
            <input
              type="date"
              name="dob"
              max={maxDate}
              className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              {...register("dob", {
                required: "Date of Birth is required",
              })}
            />
            {errors.dob && <p className="text-red-600">{errors.dob.message}</p>}
          </div>

          <div>
            {/* <label htmlFor="email">Email:</label> */}
            <input
              type="text"
              id="profession"
              name="profession"
              disabled={type === "view"}
              placeholder={userRole === "student" ? "Class" : "Profession"}
              className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
              {...register("profession", {
                required: "Profession is required",
              })}
            />
            {errors.profession && (
              <span className="text-red-600">{errors.profession.message}</span>
            )}
          </div>
          {type == "add" && (
            <div>
              {/* <label htmlFor="password">Password:</label> */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  disabled={type === "view"}
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 h-[42px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
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
          )}

          <div>
            {/* <label htmlFor="mobile_number">Mobile Number:</label> */}
            <input
              type="text"
              id="mobile_number"
              name="mobile_number"
              disabled={type === "view"}
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

          {/* is online or offline */}
          <div>
            <Controller
              control={control}
              name="is_online"
              maxMenuHeight={230}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={studentTypeData}
                  placeholder="Will attend online"
                  isDisabled={type === "view"}
                  className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={
                    typeof document !== "undefined" && document.body
                  }
                  menuPosition="absolute"
                />
              )}
            />
            {errors.status && (
              <p className="text-red-600">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div>
          {/* <label htmlFor="address">Full Address</label> */}
          <textarea
            name="address"
            placeholder="Full Address"
            disabled={type === "view"}
            className="w-full p-4  border resize-none outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            {...register("address", {
              required: "Full Address is required",
              minLength: {
                value: 10,
                message: "Full Address must be at least 10 characters",
              },
            })}
            rows="2"
          />
          {errors.address && <p className="error">{errors.address.message}</p>}
        </div>
        {userRole !== "student" && (
          <div className="mb-4 border p-4 rounded-md overflow-hidden">
            <div className="flex gap-2">{renderIcons(documents.length)}</div>
            <div className="relative">
              <input
                type="file"
                id="documents"
                disabled={type === "view"}
                // {...register("documents", {
                //   required: "This field is required",
                // })}
                multiple
                accept=".pdf"
                onChange={handleDocuments}
                className="absolute inset-0 z-50 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-4 text-center">
                <span className="text-gray-500">
                  {type !== "view" ? " Upload Your Documents Here" : ""}
                </span>
              </div>
            </div>
            {/* {errors.documents && (
              <p className="text-red-500">{errors.documents.message}</p>
            )} */}
          </div>
        )}

        <div className="flex flex-col items-center">
          <label htmlFor="file-upload" className="relative cursor-pointer">
            {loading ? (
              <Spinner />
            ) : featured ? (
              <>
                <div className="w-full rounded-md flex items-center justify-center">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${featured}`}
                    alt="upload icon"
                    className="w-48 mb-4  object-contain rounded-md"
                  />
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  disabled={type === "view"}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            ) : (
              <>
                <div className="w-full rounded-md flex items-center justify-center">
                  <Image
                    src={UploadImg}
                    alt="upload icon"
                    className="w-full object-cover rounded-md"
                  />
                </div>
                <input
                  id="file-upload"
                  type="file"
                  disabled={type === "view"}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".jpg, .jpeg, .png"
                />
              </>
            )}
          </label>
          {type !== "view" && <p>Upload Profile Image</p>}
          {featuredErr && <span className="text-red-600">{featuredErr}</span>}
        </div>

        {type !== "view" && (
          <button
            type="submit"
            className="bg-primary px-6 py-2 text-white rounded-full font-mulish"
          >
            {type === "edit" ? "Update" : "Submit"}
          </button>
        )}
      </form>
      <Modal isOpen={openDocViewer} onClose={() => setOpenDocViewer(false)}>
        <DocViewerApp docs={docs} />
      </Modal>
    </div>
  );
}

export default CreateTeacher;
