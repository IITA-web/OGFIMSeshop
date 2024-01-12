import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import "@/styles/Lofi.scss";
import Avatar from "@/components/Avatar/Avatar";
import { CategorySelection } from "@/components/Category/Category";
import useStore from "@/store";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { GoBack } from "@/components/Other/Back";

interface ISignup {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  image: string;
  tags: string[];
}

const EditProfile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isValid },
  } = useForm<Partial<ISignup>>();
  const {
    authStore: { user, processing, clear, updateProfile },
  } = useStore();

  useEffect(() => {
    if (user) {
      setValue("first_name", user.first_name, { shouldValidate: true });
      setValue("email", user.email, { shouldValidate: true });
      setValue("last_name", user.last_name, { shouldValidate: true });
      setValue("phone_number", user.phone_number, {
        shouldValidate: true,
      });
      setValue("image", user.image, { shouldValidate: true });
      setValue("tags", user.tags, { shouldValidate: true });
    }
  }, [user]);

  const onSubmit = async (form: Partial<ISignup>) => {
    await updateProfile(form);
  };

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full xl:max-w-[calc(100%-290px)] flex-1 p-6 flex flex-col gap-y-8">
          <div className="place-self-start">
            <GoBack text="Back" />
          </div>
          <div className="p-0 sm:p-8 md:p-16 w-full xl:max-w-[calc(100%)] mx-auto sm:bg-white">
            <div className="text-start w-full mb-12 flex gap-4 items-center">
              <h1 className="text-[36px] font-semibold text-gray-900">
                Edit Profile
              </h1>
            </div>
            <form
              className="grid grid-cols-2 mt-6 gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="col-span-2">
                <Controller
                  name={"image"}
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <Avatar
                        onChange={(value) => field.onChange(value)}
                        image={field.value}
                      />
                    );
                  }}
                />
              </div>

              <div className="col-span-1">
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
                  placeholder="Enter first name here"
                  className="form-input px-6 border-gray-300 w-full rounded-md h-14"
                  {...register("first_name", { required: true })}
                />
              </div>
              <div className="col-span-1">
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
                  placeholder="Enter last name here"
                  className="form-input px-6 border-gray-300 w-full rounded-md h-14"
                  {...register("last_name", { required: true })}
                />
              </div>
              <div className="col-span-1">
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
                  placeholder="Enter phone number here"
                  className="form-input px-6 border-gray-300 w-full rounded-md h-14"
                  {...register("phone_number")}
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="email"
                  className="text-sm mb-2 text-gray-600 block"
                >
                  Email Address
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  readOnly
                  inputMode="email"
                  placeholder="Enter email address here"
                  className="form-input px-6 border-gray-300 w-full rounded-md h-14"
                  {...register("email")}
                />
              </div>

              <div className="col-start-1 col-span-2 mt-6">
                <label
                  htmlFor="tags"
                  className="text-sm mb-2 text-gray-600 block"
                >
                  Type of Agribusiness
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

              <div className="col-start-1 col-span-2">
                <button
                  disabled={!isValid || processing}
                  type="submit"
                  className="btn btn-secondary-2 w-fit lg:w-[300px] mx-auto mt-12"
                >
                  {processing ? "Saving" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
