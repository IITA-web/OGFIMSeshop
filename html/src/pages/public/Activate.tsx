import { CategorySelection } from "@/components/Category/Category";
import PasswordInput from "@/components/CustomInput/PasswordInput";
import SEO from "@/components/Seo/Seo";
import ApiService from "@/services/api";
import useStore from "@/store";
import { ISignup } from "@/typings";
import utils from "@/utils";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import { PiInfo } from "react-icons/pi";
import { RxExternalLink } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const apiService = new ApiService();
const Activate = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { isValid, errors },
  } = useForm<Partial<ISignup>>();
  const {
    authStore: {
      processing,
      activateAccount,
      resendCode,
      isAuthenticated,
      isSuccess,
    },
    miscStore: { setSpinner },
  } = useStore();
  const watchPassword = watch("password");

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [action, setAction] = useState<"other" | "resend">("other");

  const onSubmit = async (form: Partial<ISignup>) => {
    setLoading(true);

    try {
      switch (step) {
        case 0:
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

          const { data } = await apiService.PreSignup({
            emailOrPhone: form.emailOrPhone,
          });

          if (data) {
            if (data.registered) {
              setEmailOrPhone(form.emailOrPhone);
              setStep(2);
              toast.success(data.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
            }

            if (data._uuid) {
              setValue("email", data.email, { shouldValidate: true });
              setValue("first_name", data.firstName, { shouldValidate: true });
              setValue("last_name", data.lastName, { shouldValidate: true });
              setValue("phone_number", data.mobileNumber, {
                shouldValidate: true,
              });
              setValue("main_app_vendor_id", data._uuid, {
                shouldValidate: true,
              });
              setValue("image", data.profileImage, { shouldValidate: true });

              setStep(1);
            }
          }
          break;

        case 1:
          if (form.password !== form.cpassword) {
            toast.error("Passwords do not match", {
              position: toast.POSITION.TOP_RIGHT,
            });
            return;
          }

          if (form.tags?.length < 1) {
            toast.error("Select at least one tag", {
              position: toast.POSITION.TOP_RIGHT,
            });
            return;
          }

          const payload = {
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            phone_number: form.phone_number,
            main_app_vendor_id: form.main_app_vendor_id,
            password: form.password,
            image: form.image,
            tags: form.tags,
          };

          const { data: signUpData } = await apiService.Signup(payload);

          if (signUpData.registered) {
            setEmailOrPhone(form.emailOrPhone);
            setStep(2);
            toast.success(signUpData.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          } else {
            toast.error(
              signUpData.message || "Error occurred while signing up",
              {
                position: toast.POSITION.TOP_RIGHT,
              }
            );
          }
          break;

        case 2:
          const activatePayload = {
            emailOrPhone: form.emailOrPhone,
            code: form.code,
          };

          await activateAccount(activatePayload);
          break;

        default:
          break;
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message;
      let errorMessageText = "";

      if (Array.isArray(errorMessage)) {
        errorMessageText = errorMessage?.join(", ");
      }

      toast.error(
        errorMessageText ||
          err?.response?.data?.message ||
          "Error processing form, please try again",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setAction("resend");
    await resendCode(emailOrPhone);
  };

  useEffect(() => {
    if (isAuthenticated && isSuccess) {
      navigate("/");
    }
  }, [isAuthenticated, isSuccess]);

  useEffect(() => {
    if (action === "resend") {
      setSpinner(processing);
    }
  }, [processing, action]);

  return (
    <>
      <SEO
        title={`${
          import.meta.env.VITE_APP_NAME
        } - Buy and Sell Agricultural Products`}
        description={`${
          import.meta.env.VITE_APP_NAME
        } is the best place to buy and sell high-quality agricultural products. Find a wide range of fresh produce, seeds, livestock, and farming equipment. Join now and connect with farmers and buyers in Ogun state.`}
        name={`${
          import.meta.env.VITE_APP_NAME
        } - Buy and Sell Agricultural Products`}
        type="article"
        image="people.svg"
      />
      <div className="flex flex-col h-full items-center p-4 md:px-8 py-16">
        <div className="text-center mb-11">
          <h1 className="text-4xl font-semibold my-6 text-black">
            Activate your account
          </h1>
          {step === 0 && (
            <p className="my-8 md:w-[400px]">
              Not registered on OGFIMS?
              <a
                href="https://ogunfarminfo.org/register"
                target="_blank"
                className="text-[#67a961] hover:text-[#546453] ml-1 inline-flex items-center gap-1"
              >
                Register <RxExternalLink className="text-lg" />
              </a>
            </p>
          )}
          <p className="text-lg font-medium  text-[#546453]">
            {step === 0 ? null : step === 1 ? (
              "Fill all required fields"
            ) : (
              <>
                <span>A code has been sent to your phone number </span>
                <span className="text-[#457A40]">
                  {utils.phoneFormat(emailOrPhone)}
                </span>
              </>
            )}
          </p>
        </div>

        {step === 0 && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mt-12"
            autoComplete="off"
          >
            <div className="w-full lg:w-1/2 xl:w-1/3 flex flex-col gap-6 mx-auto">
              <div>
                <label
                  htmlFor="emailOrPhoneNumber"
                  className="text-sm mb-2 text-gray-600 block"
                >
                  Email Address or Phone Number
                </label>
                <input
                  type="text"
                  id="emailOrPhoneNumber"
                  name="emailOrPhoneNumber"
                  placeholder="Enter your Email Address or Phone Number"
                  className="form-input"
                  {...register("emailOrPhone", { required: true })}
                />
                {errors.emailOrPhone?.message && (
                  <p className="flex text-red-600  text-xs items-center gap-1 mt-3 ">
                    <PiInfo className="text-2xl" />
                    {errors.emailOrPhone?.message}
                  </p>
                )}
              </div>

              <button
                disabled={!isValid}
                className="btn btn-secondary-2 w-full mt-12"
              >
                {loading ? (
                  <BiLoaderAlt className="animate-spin text-white text-xl" />
                ) : (
                  "Find Account"
                )}
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-12 w-full lg:w-2/3 xl:w-2/3"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="first_name"
                  className="text-sm mb-2 text-gray-600 block"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="Enter your first name "
                  className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
                  {...register("first_name", { required: true })}
                />
                {errors.first_name?.message && (
                  <p className="flex text-red-600  text-xs items-center gap-1 mt-3 ">
                    <PiInfo className="text-2xl" />
                    {errors.first_name?.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="text-sm mb-2 text-gray-600 block"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder="Enter your last name"
                  className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
                  {...register("last_name", { required: true })}
                />
                {errors.last_name?.message && (
                  <p className="flex text-red-600  text-xs items-center gap-1 mt-3 ">
                    <PiInfo className="text-2xl" />
                    {errors.last_name?.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm mb-2 text-gray-600 block"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  inputMode="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
                  {...register("email")}
                />
              </div>
              <div>
                <label
                  htmlFor="phone_number"
                  className="text-sm mb-2 text-gray-600 block"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  inputMode="tel"
                  readOnly
                  placeholder="Enter your phone number here"
                  className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
                  {...register("phone_number", { required: true })}
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="tags"
                  className="text-sm mb-2 text-gray-600 block"
                >
                  Tags
                </label>

                <Controller
                  name={"tags"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <CategorySelection
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                      />
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-sm mb-2 text-gray-600 block"
                >
                  Password
                </label>
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
                        className="form-input"
                        showMeter
                        value={field.value}
                        onChange={(value, name) => field.onChange(value, name)}
                      />
                    );
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="cpassword"
                  className="text-sm mb-2 text-gray-600 block"
                >
                  Confirm Password
                </label>
                <Controller
                  name={"cpassword"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <PasswordInput
                        id="cpassword"
                        name="cpassword"
                        placeholder="Password"
                        className="form-input"
                        showMeter={false}
                        showPasswordMatch
                        passwordMatch={watchPassword}
                        value={field.value}
                        onChange={(value, name) => field.onChange(value, name)}
                      />
                    );
                  }}
                />
              </div>
            </div>

            <button
              disabled={!isValid}
              className="btn btn-secondary-2 w-full mt-12 md:max-w-sm mx-auto"
            >
              {loading ? (
                <BiLoaderAlt className="animate-spin text-white text-xl" />
              ) : (
                "Continue"
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mt-12"
            autoComplete="off"
          >
            <div className="w-full lg:w-1/2 xl:w-1/3 flex flex-col gap-6 mx-auto">
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  id="code"
                  name="code"
                  placeholder="00000"
                  className="form-input px-6 w-full border-gray-300 rounded-md h-14 text-xs outline-none !focus:ring-[#457A40]"
                  {...register("code", { required: true })}
                />
                {errors.code?.message && (
                  <p className="flex text-red-600  text-xs items-center gap-1 mt-3 ">
                    <PiInfo className="text-2xl" />
                    {errors.code?.message}
                  </p>
                )}
              </div>

              <button
                disabled={!isValid}
                className="btn btn-secondary-2 w-full mt-12"
              >
                {processing && action !== "resend" ? (
                  <BiLoaderAlt className="animate-spin text-white text-xl" />
                ) : (
                  "Activate Account"
                )}
              </button>
            </div>
          </form>
        )}

        {step < 2 ? (
          <p
            className={`flex items-center gap-1 w-fit mx-auto mt-24 ${
              step !== 1 ? "lg:mt-auto" : "md:mt-12"
            }`}
          >
            Already on the platform?
            <Link to="/auth" className="text-[#67a961] hover:text-[#546453]">
              Login
            </Link>
          </p>
        ) : (
          <p className="flex items-center gap-1 w-fit mx-auto mt-24 lg:mt-auto">
            Did not receive a code?
            <a
              className="text-[#67a961] hover:text-[#546453] cursor-pointer"
              onClick={handleResendCode}
            >
              Resend Code
            </a>
          </p>
        )}
      </div>
    </>
  );
};

export default Activate;
