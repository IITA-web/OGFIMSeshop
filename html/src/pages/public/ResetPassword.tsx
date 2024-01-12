import { message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { PiInfo } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import useStore from "@/store";
import { useEffect, useState } from "react";
import PasswordInput from "@/components/CustomInput/PasswordInput";
import utils from "@/utils";
import { toast } from "react-toastify";
import SEO from "@/components/Seo/Seo";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [emailOrPhone] = useState(localStorage.getItem("reset"));
  const [action, setAction] = useState<"reset" | "resend">("reset");
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isValid },
  } = useForm<{
    emailOrPhone: string;
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
  }>();
  const {
    authStore: { resetPassword, processing, isSuccess, clear, resendCode },
    miscStore: { setSpinner },
  } = useStore();

  const watchPassword = watch("newPassword");

  useEffect(() => {
    if (!emailOrPhone) {
      navigate(`/auth/forgot-password`);
    }
  }, []);

  useEffect(() => {
    if (action === "resend") {
      setSpinner(processing);
    }
  }, [processing, action]);

  useEffect(() => {
    if (isSuccess) {
      localStorage.removeItem("reset");
      navigate(`/auth`);
    }

    return () => clear("isSuccess", false);
  }, [isSuccess]);

  const onSubmit = async (form: {
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    setAction("reset");

    const payload = {
      emailOrPhone,
      newPassword: form.newPassword,
      resetToken: form.resetToken,
    };

    await resetPassword(payload);
  };

  const handleResendCode = async () => {
    setAction("resend");
    await resendCode(emailOrPhone);
  };

  return (
    <>
      <SEO
        title={`${import.meta.env.VITE_APP_NAME} - Reset Password`}
        description={`${
          import.meta.env.VITE_APP_NAME
        } is the best place to buy and sell high-quality agricultural products. Find a wide range of fresh produce, seeds, livestock, and farming equipment. Join now and connect with farmers and buyers in Ogun state.`}
        name={`${import.meta.env.VITE_APP_NAME} - Reset Password`}
        type="article"
        image="people.svg"
      />
      <Link
        to="/auth"
        className="lg:hidden flex items-center gap-1 mt-8 w-fit pl-4 text-gray-800 hover:text-[#546453]"
      >
        <BsArrowLeft /> BACK TO LOGIN
      </Link>
      <div className="flex flex-col h-full items-center p-4 md:px-8 py-16">
        <div className="text-center mb-11">
          <PiInfo className="mx-auto text-8xl text-[#457A40]" />
          <h1 className="text-4xl font-semibold my-6 text-black">
            Reset Password
          </h1>
          <p className="text-lg font-medium  text-[#546453]">
            A password reset code has been sent to{" "}
            <span className="text-[#457A40]">
              {utils.phoneFormat(emailOrPhone)}
            </span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 xl:w-1/3 flex flex-col mt-12 gap-6"
          autoComplete="off"
        >
          <div className="relative">
            <input
              type="text"
              id="code"
              name="code"
              placeholder="Code"
              className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
              {...register("resetToken", { required: true })}
            />

            <a
              className="text-[#457A40] hover:text-opacity-95 flex top-2.5 right-3 flex-row gap-2 text-sm cursor-pointer items-center mt-2 pl-1 absolute"
              onClick={handleResendCode}
            >
              Resend Code
            </a>
          </div>

          <div>
            <Controller
              name={"newPassword"}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <PasswordInput
                    id="newPassword"
                    name="newPassword"
                    placeholder="Password"
                    className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
                    value={field.value}
                    onChange={(e, name) => field.onChange(e, name)}
                    showMeter
                  />
                );
              }}
            />
          </div>

          <div>
            <Controller
              name={"confirmPassword"}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
                    value={field.value}
                    showMeter={false}
                    showPasswordMatch
                    passwordMatch={watchPassword}
                    onChange={(e, name) => field.onChange(e, name)}
                  />
                );
              }}
            />
          </div>

          <div>
            <button
              disabled={!isValid || (processing && action === "reset")}
              type="submit"
              className="btn btn-secondary-2 w-full mx-auto mt-12"
            >
              {processing && action === "reset" ? (
                <BiLoaderAlt className="animate-spin text-white text-xl" />
              ) : (
                "Reset Password"
              )}
            </button>
          </div>

          <Link
            to="/auth"
            className="hidden lg:flex items-center gap-1 mt-8 w-fit mx-auto text-gray-800 hover:text-[#546453]"
          >
            <BsArrowLeft /> BACK TO LOGIN
          </Link>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
