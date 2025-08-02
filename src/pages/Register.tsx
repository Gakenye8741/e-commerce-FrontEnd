import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useRegisterUserMutation } from "../Features/Apis/userApi";
import hero1 from "../assets/image-aVMcBoKPxWSQV3iw3xPRFYGVBDZwzN.png";
import Navbar from "../components/Navbar";
import { Mail, Lock, User, Phone, MapPin} from "lucide-react";

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactPhone: string;
  address: string;
  acceptTerms: boolean;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const firstNameRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>();

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (data: RegisterFormData) => {
    const toastId = toast.loading("Creating user...");

    try {
      await registerUser(data).unwrap();
      toast.success("Registration successful! 🎉", { id: toastId });
      reset();
      navigate("/verify-email", { state: { email: data.email } });
    } catch (err: any) {
      const message =
        err?.data?.error || err?.data?.message || "Something went wrong.";
      toast.error(message, { id: toastId });
      console.error("Register error:", err);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Navbar />

      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-[#1F2937] via-[#3B82F6] to-[#1F2937] px-4">
        <div className="hidden md:block w-1/2 h-full">
          <img
            src={hero1}
            alt="Visual"
            className="h-full w-full object-cover rounded-l-2xl"
          />
        </div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl p-10 w-full max-w-lg space-y-5 text-white"
        >
          <div className="text-center mb-6">
            <a
              href="/"
              className="inline-block text-lg md:text-xl font-semibold text-white hover:underline"
            >
              ✅ 🛒 NovaCart e-commerce platform
            </a>
            <p className="text-sm md:text-base text-brandLight mt-1 italic">
              Your trusted e-commerce partner
            </p>
            <h2 className="text-3xl font-bold mt-4">Create Your Account</h2>
          </div>

          {/* First Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-white" />
            <input
              {...register("firstName", { required: "First name is required" })}
              placeholder="e.g. John"
              ref={(e) => {
                register("firstName").ref(e);
                firstNameRef.current = e;
              }}
              autoFocus
              className="pl-10 w-full bg-transparent border border-gray-300 rounded-md px-4 py-3 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-brandMid"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-white" />
            <input
              {...register("lastName", { required: "Last name is required" })}
              placeholder="e.g. Doe"
              className="pl-10 w-full bg-transparent border border-gray-300 rounded-md px-4 py-3 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-brandMid"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-white" />
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: "Invalid email format",
                },
              })}
              placeholder="e.g. john@example.com"
              className="pl-10 w-full bg-transparent border border-gray-300 rounded-md px-4 py-3 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-brandMid"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-white" />
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="e.g. ********"
              className="pl-10 w-full bg-transparent border border-gray-300 rounded-md px-4 py-3 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-brandMid"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-white" />
            <input
              {...register("contactPhone")}
              placeholder="e.g. +254700123456"
              className="pl-10 w-full bg-transparent border border-gray-300 rounded-md px-4 py-3 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-brandMid"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-white" />
            <input
              {...register("address")}
              placeholder="e.g. Nairobi, Kenya"
              className="pl-10 w-full bg-transparent border border-gray-300 rounded-md px-4 py-3 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-brandMid"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("acceptTerms", { required: "You must accept the terms." })}
              className="form-checkbox h-4 w-4 text-brandMid"
            />
            <label className="text-sm text-white">
              I agree to the{" "}
              <a href="/terms" className="underline text-blue-300 hover:text-blue-400">
                terms and conditions
              </a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-400 text-sm mt-1">{errors.acceptTerms.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full flex justify-center items-center gap-2 bg-brandDark hover:bg-brandMid text-white font-semibold py-3 rounded-md transition-all shadow-md"
          >
            {(isSubmitting || isLoading) ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Registering 🚀</span>
              </>
            ) : (
              "Register"
            )}
          </button>
        </motion.form>
      </div>
    </>
  );
};

export default Register;
