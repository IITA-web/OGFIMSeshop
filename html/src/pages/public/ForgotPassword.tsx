import SEO from "@/components/Seo/Seo";
import useStore from "@/store";
import utils from "@/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { PiInfo } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<{
    emailOrPhone: string;
  }>();

  const {
    authStore: { forgetPassword, processing, isSuccess, clear },
  } = useStore();

  const onSubmit = async (form: { emailOrPhone: string; password: string }) => {
    if (utils.isPhoneNumber(form.emailOrPhone)) {
      const validPhone = utils.getValidPhoneNumber(form.emailOrPhone);

      if (!validPhone) {
        toast.error("Invalid phone number", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      form.emailOrPhone = validPhone;
    }

    localStorage.setItem("reset", form.emailOrPhone);
    await forgetPassword(form);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(`/auth/reset-password`);
    }

    return () => clear("isSuccess", false);
  }, [isSuccess]);

  return (
    <>
      <SEO
        title={`${import.meta.env.VITE_APP_NAME} - Forgot Password`}
        description={`${
          import.meta.env.VITE_APP_NAME
        } is the best place to buy and sell high-quality agricultural products. Find a wide range of fresh produce, seeds, livestock, and farming equipment. Join now and connect with farmers and buyers in Ogun state.`}
        name={`${import.meta.env.VITE_APP_NAME} - Forgot Password`}
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
            Forgot Password
          </h1>
          <p className="text-lg font-medium  text-[#546453]">
            Enter your valid email or phone number to reset your password
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 xl:w-1/3 flex flex-col mt-12"
        >
          <div>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Email/Phone Number"
              className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
              {...register("emailOrPhone", { required: true })}
            />
          </div>

          <div>
            <button
              disabled={!isValid || processing}
              type="submit"
              className="btn btn-secondary-2 w-full mx-auto mt-12"
            >
              {processing ? (
                <BiLoaderAlt className="animate-spin text-white text-xl" />
              ) : (
                "Forget Password"
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

export default ForgotPassword;
