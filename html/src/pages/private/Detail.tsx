import "react-image-gallery/styles/scss/image-gallery.scss";
import "react-confirm-alert/src/react-confirm-alert.css";

import { Link, useNavigate, useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import Contact from "@/components/Contact/Contact";
import { ReportButton } from "@/components/Review/Review";
import { useEffect, useState } from "react";
import useStore from "@/store";
import { Avatar, Rate, Select } from "antd";
import HTMLPreview from "@/components/Editor/HTMLPreview";
import { BiSolidTrashAlt } from "react-icons/bi";
import { AiFillCrown, AiOutlineEdit } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Sponsor } from "@/components/Sponsor/Sponsor";
import Trend from "@/components/Trend/Trend";
import SEO from "@/components/Seo/Seo";
import { confirm } from "@/components/Alert/Alert";
import { Tag } from "@/components/Tag/Tag";
import utils from "@/utils";
import { GoBack } from "@/components/Other/Back";

enum Frequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Annually = "Yearly",
  Flat = "",
}

const options = [
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 21, label: "21 days" },
];

const DetailPage = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const {
    productStore: {
      product,
      loading,
      deleteProduct,
      toggleProduct,
      postActivity,
      getProductBySlug,
      getActivity,
      getChart,
      chartData,
      productStat,
      processing,
    },
    authStore: { user },
    miscStore: { setSpinner },
  } = useStore();
  const [chartOpt, setChartOpt] = useState<number>();

  useEffect(() => {
    if (productId) {
      getProductBySlug(productId);
    }
  }, [productId]);

  useEffect(() => {
    setSpinner(processing);
  }, [processing]);

  useEffect(() => {
    if (product && product.active_promotion) {
      if (!user || user?._id !== product.vendor._id) {
        postActivity(product._id);
      } else {
        getActivity(product._id);
        getChart({
          range: chartOpt || 7,
          product: product._id,
        });
      }
    }
  }, [product]);

  const handleToggle = async () => {
    await toggleProduct(product._id);
  };

  const handleDelete = () => {
    confirm("You want to delete this ad", async () => {
      await deleteProduct(product._id).then((res) => {
        if (res) {
          navigate("/profile");
        }
      });
    });
  };

  return (
    <>
      <SEO
        title={`${product?.name || "AD"} | eShop`}
        description={product?.description}
        name={product?.vendor?.image}
        type="article"
        image={product?.images?.[0]?.url}
        keywords={product?.vendor?.tags?.join(", ")}
      />
      <div className="flex w-full justify-center">
        <div className="w-full xl:max-w-[calc(100%-190px)] 2xl:max-w-[calc(100%-290px)] flex-1 p-6 flex flex-col gap-y-8">
          <div className="place-self-start">
            <GoBack
              path={
                product?.vendor?._id
                  ? `/vendor/${product?.vendor?._id}`
                  : "/profile"
              }
            />
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 xl:max-w-full 2xl:max-w-[calc(100%)] mx-auto gap-6">
            {loading ? (
              <>
                <div className="sm:bg-white lg:col-span-2 p-0 sm:p-4 md:p-6 flex flex-col gap-4">
                  <Skeleton
                    height="500px"
                    enableAnimation
                    borderRadius="0.75rem"
                  />
                  <Skeleton
                    height="40px"
                    enableAnimation
                    borderRadius="0.75rem"
                  />
                  <Skeleton count={10} enableAnimation borderRadius="0.75rem" />
                </div>
                <div className="sm:bg-white p-0 sm:p-4 md:p-6 flex flex-col gap-y-4 lg:gap-y-10">
                  <div className="bg-white border px-6 py-6 rounded-lg">
                    <Skeleton
                      enableAnimation
                      width="50%"
                      borderRadius="0.75rem"
                    />
                    <Skeleton
                      enableAnimation
                      borderRadius="0.75rem"
                      width="90%"
                    />
                    <Skeleton enableAnimation borderRadius="0.75rem" />
                  </div>
                  <div className="bg-white border px-6 py-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Skeleton
                        enableAnimation
                        height="50px"
                        width="50px"
                        circle
                      />
                      <div>
                        <Skeleton enableAnimation borderRadius="0.75rem" />
                        <Skeleton enableAnimation borderRadius="0.75rem" />
                      </div>
                    </div>
                    <Skeleton
                      enableAnimation
                      borderRadius="0.75rem"
                      width="90%"
                    />
                    <Skeleton enableAnimation borderRadius="0.75rem" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="sm:bg-white lg:col-span-2 lg:p-6">
                  {product?.images && product?.images?.length ? (
                    <ImageGallery
                      showNav={false}
                      autoplay={true}
                      showPlayButton={false}
                      items={product.images.map((img) => ({
                        original: img.url,
                        originalAlt: product?.name,
                        thumbnail: img.url,
                        originalClass:
                          "min-h-[250px] h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden",
                      }))}
                    />
                  ) : (
                    <div className="min-h-[250px] lg:h-[500px] text-center flex justify-center items-center rounded-xl bg-gray-300">
                      <p>No Image</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-y-4 my-6 md:mb-12">
                    {user &&
                      product?.vendor &&
                      user._id === product.vendor._id && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <h5 className="text-2xl font-medium tracking-tight text-[#67A961] lg:text-gray-900">
                              {utils.formatMoney(product.price)}{" "}
                              {product.is_service &&
                                Frequency[product.billing_type]}
                            </h5>
                            {product.is_negotiable && (
                              <p className="text-base text-gray-900">
                                Negotiable
                              </p>
                            )}
                          </div>
                          <Link
                            to={`/ad/${product?.slug}`}
                            className="btn btn-none gap-2"
                          >
                            <AiOutlineEdit className="text-xl" />
                            Edit ad
                          </Link>
                        </div>
                      )}
                    <h1 className="text-lg font-semibold text-gray-800">
                      {product?.name}
                    </h1>
                    <p className="text-base font-normal text-gray-500">
                      More Info
                    </p>
                    <div className="text-sm font-normal text-gray-400">
                      <HTMLPreview htmlContent={product?.description} />
                    </div>
                  </div>
                </div>

                <div className="sm:bg-white flex flex-col lg:p-6 gap-y-4 lg:gap-y-10">
                  {user &&
                  product &&
                  product?.vendor &&
                  user._id === product.vendor._id ? (
                    <>
                      <div className="w-full px-6 py-6 lg:max-w-full bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={product.is_published}
                            onChange={() => {
                              handleToggle();
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#67a961]  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-[#457a40]"></div>
                          <span className="ml-1 text-sm font-medium text-gray-900 ">
                            {product.is_published ? "Unpublish" : "Publish"}
                          </span>
                        </label>
                        <button
                          className="btn btn-danger min-w-[100px] min-h-[40px]"
                          onClick={handleDelete}
                        >
                          <BiSolidTrashAlt />
                          Delete
                        </button>
                      </div>
                      {product.active_promotion ? (
                        <div className="w-full flex flex-col gap-y-6  py-8 lg:max-w-full bg-white lg:border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between lg:px-4 border-b pb-8">
                            <h3 className="text-xl font-medium">Stat</h3>

                            <span className="flex items-center gap-1 text-sm text-orange-500 cursor-pointer">
                              <AiFillCrown className="text-lg" /> Premium
                            </span>
                          </div>
                          <ul className="border-b pb-8 lg:px-4 flex items-center">
                            <li className="border-r grow text-center">
                              <h4 className="text-3xl font-medium text-gray-800">
                                {productStat.views}
                              </h4>
                              <p className="text-sm">Views</p>
                            </li>
                            <li className="grow text-center">
                              <h4 className="text-3xl font-medium text-gray-800">
                                {productStat.days}
                              </h4>
                              <p>Days Left</p>
                            </li>
                          </ul>
                          <div className="flex flex-col gap-6 pb-8">
                            <div className="flex justify-between items-center lg:px-4">
                              <h3 className="text-base font-medium text-gray-800">
                                Ad views
                              </h3>
                              <Select
                                defaultValue={7}
                                value={chartOpt}
                                style={{ width: 120 }}
                                className="antd-select-green w-full !lg:w-56 rounded-none"
                                placeholder="Select"
                                onChange={(value) => {
                                  getChart({
                                    range: value,
                                    product: product._id,
                                  });
                                  setChartOpt(value as number);
                                }}
                                options={options}
                              />
                            </div>

                            <div>
                              <Trend chartData={chartData} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Sponsor productId={product._id} where="detail" />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-full px-6 py-4 lg:max-w-full bg-white border border-gray-200 rounded-lg">
                        <h5 className="text-2xl font-medium tracking-tight text-[#67A961] lg:text-gray-900">
                          {utils.formatMoney(product?.price)}{" "}
                          {product?.is_service &&
                            Frequency[product.billing_type]}
                        </h5>
                        {product?.is_negotiable && (
                          <p className="text-base text-gray-900 lg:text-[#67A961] mt-1">
                            Negotiable
                          </p>
                        )}
                      </div>
                      {product?.vendor && (
                        <>
                          <div className="w-full flex flex-col gap-y-6 lg:px-4 py-8 lg:max-w-full bg-white lg:border border-gray-200 rounded-lg ">
                            <div className="flex-1 flex items-center gap-x-4 place-self-start">
                              <Link
                                to={`/vendor/${product.vendor._id}`}
                                className="hover:text-[#67A961] flex"
                              >
                                {product.vendor.image ? (
                                  <img
                                    className="w-12 h-12 lg:w-20 lg:h-20 rounded-full border"
                                    src={product.vendor.image}
                                    alt={`${product.vendor.first_name}-${product.vendor.last_name}-${product.name}`}
                                  />
                                ) : (
                                  <Avatar className="w-12 h-12 lg:w-20 lg:h-20 rounded-full border flex justify-center items-center">{`${product.vendor.last_name?.substring(
                                    0,
                                    1
                                  )}${product.vendor.first_name?.substring(
                                    0,
                                    1
                                  )}`}</Avatar>
                                )}
                              </Link>
                              <div className="flex flex-row items-center lg:flex-col gap-2 lg:items-start">
                                <div className="flex gap-1 flex-wrap">
                                  <Link
                                    to={`/vendor/${product.vendor._id}`}
                                    className="hover:text-[#67A961] flex"
                                  >
                                    <h2 className="text-lg lg:text-base font-medium capitalize">
                                      {`${product.vendor.last_name} ${product.vendor.first_name}`}
                                    </h2>
                                  </Link>
                                  <Tag
                                    tag={`Joined since ${new Date(
                                      product.vendor.createdAt
                                    ).getFullYear()}`}
                                  />
                                </div>
                                <Rate
                                  disabled
                                  defaultValue={product?.vendor?.rate || 0}
                                  allowHalf
                                  className="text-base"
                                />
                              </div>
                            </div>
                            {<Contact product={product} />}
                          </div>
                          <div className="w-full flex flex-col gap-y-6 lg:px-4 py-6 lg:py-8 sm:max-w-full">
                            <div className="flex flex-col gap-y-2 lg:gap-y-4 w-full">
                              <ReportButton vendor={product.vendor._id} />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPage;
