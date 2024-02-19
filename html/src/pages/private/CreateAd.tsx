import NaijaStates from "naija-state-local-government";
import useStore from "@/store";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { PiInfo } from "react-icons/pi";
import { useEffect } from "react";
import { Select, InputNumber } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import WYSIWYGEditor from "@/components/Editor/Editor";
import "@/styles/Select.scss";
import { BiLoaderAlt } from "react-icons/bi";
import useProductStore from "@/store/slices/product.slice";
import { toast } from "react-toastify";
import { IProductFormData } from "@/typings";
import SEO from "@/components/Seo/Seo";
import { GoBack } from "@/components/Other/Back";
import { BsTrash } from "react-icons/bs";
import ImageUploader from "@/components/Upload/ImageUploader";

const CreateAd = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { isValid, errors },
  } = useForm<IProductFormData>({
    defaultValues: {
      is_negotiable: false,
      show_email: false,
      show_phone_number: false,
      show_whatsapp: false,
      price: 0,
      images: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const {
    catStore: { categories, subCategories, getSubCategories },
    productStore: {
      createProduct,
      updateProduct,
      getProductBySlug,
      id,
      processing,
      error,
      message: msg,
      product,
    },
  } = useStore();

  const typeWatch = watch("type");
  const categoryWatch = watch("category");

  useEffect(() => {
    if (categoryWatch) {
      getSubCategories(categoryWatch);
    }
  }, [categoryWatch]);

  useEffect(() => {
    if (productId) {
      getProductBySlug(productId);
    } else {
      reset();
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
      setValue("name", product.name, { shouldValidate: true });
      setValue("type", product.is_service ? "services" : "goods", {
        shouldValidate: true,
      });
      setValue("billing_type", product.billing_type, {
        shouldValidate: true,
      });
      setValue("local_goverment", product.local_goverment, {
        shouldValidate: true,
      });
      setValue("category", product.category, { shouldValidate: true });
      setValue("sub_category", product.sub_category, { shouldValidate: true });
      setValue("price", product.price, { shouldValidate: true });
      setValue("is_negotiable", product.is_negotiable, {
        shouldValidate: true,
      });
      setValue("description", product.description, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue("show_email", product.show_email, { shouldValidate: true });
      setValue("show_phone_number", product.show_phone_number, {
        shouldValidate: true,
      });
      setValue("show_whatsapp", product.show_whatsapp, {
        shouldValidate: true,
      });
      setValue("images", product.images || [], {
        shouldValidate: true,
      });
    }
  }, [product]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    if (msg) {
      navigate(
        `${!product.slug ? "/ad/success/" + id : "/detail/" + product.slug}`
      );
    }

    return () => {
      useProductStore.setState({
        product: null,
        message: null,
        error: null,
      });
    };
  }, [error, msg]);

  const onUploadFinish = (info) => {
    append({ url: info.url });
  };

  const onRemoveImage = (index) => {
    remove(index);
  };

  const onSubmit = async (form: any) => {
    const payload = {
      ...form,
      price: +form.price,
      is_service: !!(form.type !== "goods"),
    };

    if (product && product._id) {
      await updateProduct(payload, product._id);
    } else {
      await createProduct(payload);
    }
  };

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
      <div className="flex w-full justify-center">
        <div className="w-full xl:max-w-[calc(100%-290px)] flex-1 p-6 flex flex-col gap-y-8">
          {product?._id && (
            <div className="place-self-start">
              <GoBack text="Cancel" />
            </div>
          )}
          <div className="p-0 sm:p-8 md:p-16 w-full xl:max-w-[calc(100%)] mx-auto sm:bg-white">
            <div className="text-center w-full mb-12">
              <h1 className="text-[32px] font-semibold mb-4 text-gray-900">
                {product && product._id ? "Update Ad" : "Create Ad"}
              </h1>
              <p className="text-sm font-normal text-gray-500">
                Fill the Required Fields
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm mb-2 text-gray-600 block"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter ad title here"
                    className="form-input "
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name?.message && (
                    <p className="flex text-red-600  text-xs items-center gap-1 mt-3 ">
                      <PiInfo className="text-2xl" />
                      {errors.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="text-sm mb-2 text-gray-600 block"
                  >
                    Ad Type
                  </label>
                  <Controller
                    name={"type"}
                    control={control}
                    rules={{
                      required:
                        subCategories.length > 0 ? "Name is required" : false,
                    }}
                    render={({ field }) => {
                      return (
                        <Select
                          id="type"
                          placeholder="Select a advert type"
                          className={`antd-select w-full antd-select-fullwidth`}
                          options={[
                            {
                              value: "goods",
                              label: "Goods",
                            },
                            { value: "services", label: "Services" },
                          ].map((service) => ({
                            label: service.label,
                            value: service.value,
                          }))}
                          {...field}
                        />
                      );
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="text-sm mb-2 text-gray-600 block"
                  >
                    Category
                  </label>
                  <Controller
                    name={"category"}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => {
                      return (
                        <Select
                          id="category"
                          placeholder="Select a category"
                          className={`antd-select w-full antd-select-fullwidth`}
                          options={categories.map((cat) => ({
                            label: cat.name,
                            value: cat._id,
                          }))}
                          {...field}
                        />
                      );
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="sub_category"
                    className="text-sm mb-2 text-gray-600 block"
                  >
                    Sub-Category
                  </label>
                  <Controller
                    name={"sub_category"}
                    control={control}
                    rules={{
                      required:
                        subCategories.length > 0 ? "Name is required" : false,
                    }}
                    render={({ field }) => {
                      return (
                        <Select
                          id="sub_category"
                          placeholder="Select a sub-category"
                          className={`antd-select w-full antd-select-fullwidth`}
                          options={subCategories.map((cat) => ({
                            label: cat.name,
                            value: cat._id,
                          }))}
                          {...field}
                        />
                      );
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="local_goverment"
                    className="text-sm mb-2 text-gray-600 block"
                  >
                    Local Goverment Area
                  </label>
                  <Controller
                    name={"local_goverment"}
                    control={control}
                    rules={{
                      required:
                        subCategories.length > 0 ? "Name is required" : false,
                    }}
                    render={({ field }) => {
                      return (
                        <Select
                          id="local_goverment"
                          placeholder="Select a local goverment area"
                          className={`antd-select w-full antd-select-fullwidth`}
                          showSearch
                          options={NaijaStates.lgas("Ogun")?.lgas.map(
                            (lga) => ({
                              label: lga,
                              value: lga,
                            })
                          )}
                          {...field}
                        />
                      );
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="text-sm mb-2 text-gray-600 block"
                  >
                    Price
                  </label>
                  <div className="relative">
                    <Controller
                      name={"price"}
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => {
                        return (
                          <InputNumber
                            id="price"
                            name="price"
                            className="custom-number"
                            prefix="₦"
                            min={1}
                            precision={2}
                            controls={false}
                            value={field.value}
                            onChange={(nextValue) => field.onChange(nextValue)}
                            {...field}
                          />
                        );
                      }}
                    />

                    <div className="flex top-3.5 right-3 flex-row gap-2 z-10 items-center mt-2 pl-1 absolute">
                      <input
                        type="checkbox"
                        name="Negotiable"
                        className="form-checkbox"
                        id="Negotiable"
                        {...register("is_negotiable")}
                      />
                      <label
                        htmlFor="Negotiable"
                        className="text-xs font-normal cursor-pointer"
                      >
                        Negotiable
                      </label>
                    </div>

                    {typeWatch === "services" && (
                      <fieldset className="flex mt-2 gap-4 items-center transition duration-300 ease-in-out">
                        <div className="flex items-center mb-4">
                          <input
                            id="billing-type-option-1"
                            type="radio"
                            name="billing_type"
                            value="Flat"
                            className="form-radio !focus:ring-2"
                            {...register("billing_type", { required: true })}
                          />
                          <label
                            htmlFor="billing-type-option-1"
                            className="block ml-2 text-sm font-medium text-gray-900"
                          >
                            Flat rate
                          </label>
                        </div>
                        <div className="flex items-center mb-4">
                          <input
                            id="billing-type-option-1"
                            type="radio"
                            name="billing_type"
                            value="Daily"
                            className="form-radio !focus:ring-2"
                            {...register("billing_type", { required: true })}
                          />
                          <label
                            htmlFor="billing-type-option-1"
                            className="block ml-2 text-sm font-medium text-gray-900"
                          >
                            Daily
                          </label>
                        </div>

                        <div className="flex items-center mb-4">
                          <input
                            id="billing-type-option-2"
                            type="radio"
                            name="billing_type"
                            value="Weekly"
                            className="form-radio !focus:ring-2"
                            {...register("billing_type", { required: true })}
                          />
                          <label
                            htmlFor="billing-type-option-2"
                            className="block ml-2 text-sm font-medium text-gray-900"
                          >
                            Weekly
                          </label>
                        </div>

                        <div className="flex items-center mb-4">
                          <input
                            id="billing-type-option-3"
                            type="radio"
                            name="billing_type"
                            value="Monthly"
                            className="form-radio !focus:ring-2"
                            {...register("billing_type", { required: true })}
                          />

                          <label
                            htmlFor="billing-type-option-3"
                            className="block ml-2 text-sm font-medium text-gray-900"
                          >
                            Monthly
                          </label>
                        </div>

                        <div className="flex items-center mb-4">
                          <input
                            id="billing-type-option-4"
                            type="radio"
                            name="billing_type"
                            value="Annually"
                            className="form-radio !focus:ring-2"
                            {...register("billing_type", { required: true })}
                          />
                          <label
                            htmlFor="billing-type-option-4"
                            className="block ml-2 text-sm font-medium text-gray-900"
                          >
                            Annually
                          </label>
                        </div>
                      </fieldset>
                    )}
                  </div>
                </div>

                <div className={`col-span-1 lg:col-span-2 mb-4`}>
                  <label
                    htmlFor="description"
                    className="text-sm mb-2 text-gray-600 block"
                  >
                    Description
                  </label>
                  <Controller
                    name={"description"}
                    control={control}
                    rules={{
                      required: true,
                      minLength: 107,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <WYSIWYGEditor
                        onChange={onChange}
                        value={value}
                        placeholder="Enter ad description (Minimum of 100 characters)"
                      />
                    )}
                  />
                </div>

                <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
                  <p className="text-base font-medium mb-2">
                    Contact Information to display
                  </p>

                  <div className="flex flex-row gap-2 items-center">
                    <input
                      type="checkbox"
                      name="email"
                      className="form-checkbox"
                      id="email"
                      {...register("show_email")}
                    />
                    <label
                      htmlFor="email"
                      className="text-xs font-normal cursor-pointer"
                    >
                      Display my email address
                    </label>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <input
                      type="checkbox"
                      name="phone"
                      className="form-checkbox"
                      id="phone"
                      {...register("show_phone_number")}
                    />
                    <label
                      htmlFor="phone"
                      className="text-xs font-normal cursor-pointer"
                    >
                      Display my phone number
                    </label>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <input
                      type="checkbox"
                      name="whatsApp"
                      className="form-checkbox"
                      id="whatsApp"
                      {...register("show_whatsapp")}
                    />
                    <label
                      htmlFor="whatsApp"
                      className="text-xs font-normal cursor-pointer"
                    >
                      Contact on WhatsApp
                    </label>
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
                  <label
                    htmlFor="images"
                    className="text-sm text-gray-600 block"
                  >
                    Add Photo
                  </label>

                  <ImageUploader
                    onUploadFinish={onUploadFinish}
                    initialImageCount={fields.length}
                  />
                  <div className="scroll-smooth flex flex-nowrap gap-2 overflow-x-auto no-scrollbar">
                    {fields.map((item: any, index: number) => (
                      <Thumbnail
                        key={item.id}
                        url={item.url}
                        index={index}
                        onRemoveImage={onRemoveImage}
                      />
                    ))}
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-2">
                  <button
                    disabled={!isValid || processing}
                    type="submit"
                    className="btn btn-secondary-2 w-full md:w-[300px] mx-auto mt-12"
                  >
                    {processing ? (
                      <BiLoaderAlt className="animate-spin text-white text-xl" />
                    ) : product && product?._id ? (
                      "Update Ad"
                    ) : (
                      "Create Ad"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAd;

const Thumbnail: React.FC<{
  url: string;
  id?: string;
  index: number;
  onRemoveImage: (index: number) => void;
}> = ({ url, onRemoveImage, index }) => {
  return (
    <div className="w-28 h-28 min-w-28 min-w-28 max-w-28 max-w-28 lg:min-w-40 lg:min-w-40 lg:max-w-40 lg:max-w-40 lg:h-40 lg:w-40 border rounded-lg relative group overflow-hidden shrink-0">
      <button
        type="button"
        className="absolute top-2 right-2 hidden group-hover:inline bg-red-600 p-2 rounded-full z-20"
        onClick={() => {
          onRemoveImage(index);
        }}
      >
        <BsTrash className="text-white" />
      </button>

      <img
        src={url}
        className="object-cover w-full h-full"
        alt={`Image ${index}`}
        onLoad={() => {
          URL.revokeObjectURL(url);
        }}
      />
    </div>
  );
};
