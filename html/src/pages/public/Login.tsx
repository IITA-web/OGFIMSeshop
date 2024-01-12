import PasswordInput from "@/components/CustomInput/PasswordInput";
import SEO from "@/components/Seo/Seo";
import useStore from "@/store";
import utils from "@/utils";
import { message } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import { PiInfo } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<{
    emailOrPhone: string;
    password: string;
  }>();
  const {
    authStore: { login, processing, isAuthenticated, isSuccess, clear },
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

    await login(form);
  };

  useEffect(() => {
    if (isAuthenticated && isSuccess) {
      navigate("/");
    }

    return () => clear("isSuccess", false);
  }, [isAuthenticated, isSuccess]);

  return (
    <>
      <SEO
        title={`${import.meta.env.VITE_APP_NAME} - Login`}
        description={`${
          import.meta.env.VITE_APP_NAME
        } is the best place to buy and sell high-quality agricultural products. Find a wide range of fresh produce, seeds, livestock, and farming equipment. Join now and connect with farmers and buyers in Ogun state.`}
        name={`${import.meta.env.VITE_APP_NAME} - Login`}
        type="article"
        image="people.svg"
      />
      <div className="flex flex-col h-full items-center p-4 md:px-8 py-16">
        <div className="text-center mb-11">
          <h1 className="text-4xl font-semibold my-6 text-black">Welcome</h1>
          <p className="my-8 md:w-[400px]">
            Are you registered on OGFIMS and accessing the agro shop platform
            for the first time?
            <Link
              to="/auth/activate"
              className="text-[#67a961] hover:text-[#546453] ml-1"
            >
              Activate
            </Link>
          </p>
          <p className="text-lg font-medium  text-[#546453]">
            Login to your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 xl:w-1/3 flex flex-col mt-12 gap-6"
          autoComplete="off"
        >
          <div>
            <input
              type="text"
              id="emailOrPhoneNumber"
              name="emailOrPhoneNumber"
              placeholder="Email/Phone Number"
              className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
              {...register("emailOrPhone", { required: true })}
            />
            {errors.emailOrPhone?.message && (
              <p className="flex text-red-600  text-xs items-center gap-1 mt-3 ">
                <PiInfo className="text-2xl" />
                {errors.emailOrPhone?.message}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center flex-row-reverse justify-between mb-1">
              <Link to="/auth/forgot-password" className="text-[#67a961]">
                Forgot?
              </Link>
            </div>
            <Controller
              name={"password"}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <PasswordInput
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
                    showMeter={false}
                    value={field.value}
                    onChange={(value, name) => field.onChange(value, name)}
                  />
                );
              }}
            />
            {errors.password?.message && (
              <p className="flex text-red-600  text-xs items-center gap-1 mt-3 ">
                <PiInfo className="text-2xl" />
                {errors.password?.message}
              </p>
            )}
          </div>
          <button
            disabled={!isValid || processing}
            type="submit"
            className="btn btn-secondary-2 w-full mx-auto mt-12"
          >
            {processing ? (
              <BiLoaderAlt className="animate-spin text-white text-xl" />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
