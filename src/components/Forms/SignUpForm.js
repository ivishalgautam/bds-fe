import React from "react";
import Logo from "../../assets/logo.svg";
import Login from "../../assets/login.png";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import http from "../../utils/http";
import { endpoints } from "../../utils/endpoints";
import { useMutation } from "@tanstack/react-query";
import Spinner from "../Spinner";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRef, useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const options = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export default function SignUpForm() {
  const router = useRouter();
  const menuPortalTargetRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm();

  const signupUser = async (userData) => {
    try {
      const response = await http().post(`${endpoints.auth.signup}`, userData);
      router.push("/login");
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const { mutate, isError, isLoading, error } = useMutation(signupUser);

  const onSubmit = async (data) => {
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role.value,
      mobile_number: data.mobile_number,
    };
    mutate(payload);
  };

  const handleMobileNumberKeyDown = (event) => {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight"];
    if (!allowedKeys.includes(event.key) && isNaN(Number(event.key))) {
      event.preventDefault();
    }
  };

  return (
    <div className="flex items-center justify-center login-gradient h-screen">
      <div className="max-w-6xl grid grid-cols-2 rounded-[59px] overflow-hidden shadow-2xl">
        <div className="bg-white flex flex-col items-center justify-center space-y-4">
          <Image src={Logo} alt="" />
          <h3 className="font-primary font-bold text-[#110B56] text-2xl">
            Welcome Back
          </h3>
          <form
            className="flex flex-col space-y-4 w-full max-w-[400px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                type="text"
                id="username"
                {...register("username", { required: "Username is required" })}
                placeholder="Username"
                className="border border-gray-300 w-full px-4 py-2 rounded-md outline-none"
              />
              {errors.username && (
                <span className="text-sm text-red-600">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div>
              <input
                type="text"
                id="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Email Address"
                className="border border-gray-300 w-full px-4 py-2 rounded-md outline-none"
              />
              {errors.email && (
                <span className="text-sm text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
                      message: (
                        <div>
                          Password must meet the following criteria:
                          <br />
                          - Password length should be greater than 8 and less
                          than 30 characters.
                          <br />
                          - Contains at least one uppercase letter (A-Z).
                          <br />
                          - Contains at least one lowercase letter (a-z).
                          <br />
                          - Contains at least one digit (0-9).
                          <br />- Contains at least one special character from
                          the set #?!@$%^&*-.
                        </div>
                      ),
                    },
                  })}
                  placeholder="Password"
                  className="border border-gray-300 w-full px-4 py-2 pr-10 rounded-md outline-none"
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
                <span className="text-sm text-red-600">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div>
              <input
                type="tel"
                {...register("mobile_number", {
                  required: "Mobile Number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Mobile Number must be a 10-digit number.",
                  },
                })}
                onKeyDown={handleMobileNumberKeyDown}
                placeholder="Mobile Number"
                className="border border-gray-300 w-full px-4 py-2 rounded-md outline-none"
              />
              {errors.mobile_number && (
                <span className="text-sm text-red-600">
                  {errors.mobile_number.message}
                </span>
              )}
            </div>

            <div>
              <Controller
                control={control}
                name="role"
                rules={{ required: "Please select your role" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={options}
                    isClearable
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={menuPortalTargetRef.current}
                    menuPosition="absolute"
                    placeholder="Select Role"
                  />
                )}
              />
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role.message}</p>
              )}
            </div>

            <button
              className="bg-primary text-white px-8 py-2 rounded-full"
              type="submit"
            >
              {isLoading ? <Spinner color="white" /> : "Sign Up"}
            </button>
          </form>
          <p>
            Already have an Account ?{" "}
            <Link href="/login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
        <div className="bg-[#f7f7fc]">
          <Image src={Login} alt="" />
        </div>
      </div>
    </div>
  );
}
