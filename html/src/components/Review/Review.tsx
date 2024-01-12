import useStore from "@/store";
import { Avatar, Modal, Rate, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import * as BsIcon from "react-icons/bs";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Empty, Spinner } from "../Other/Misc";
import { IVendor } from "@/typings";
import moment from "moment";

const reportReason: string[] = [
  "Vendor is abusive",
  "Vendor is not delivering",
  "Vendor is not responding",
  "Other",
];

export const ReviewModal = ({ show, onClose, vendor }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<{
    name: string;
    comment: string;
    rating: number;
  }>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    comment: string;
    rating: number;
  }>();
  const {
    miscStore: { processing, reviewVendor, message, clear },
  } = useStore();

  const onSubmit = async (data: {
    name: string;
    comment: string;
    rating: number;
  }) => {
    setLoading(true);
    setFormData(data);
    login();
  };

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${codeResponse?.access_token}` },
        })
        .then((res) => res.data);

      console.log({
        ...formData,
        vendor: vendor._id,
        google_auth_id: userInfo.sub,
      });
      reviewVendor({
        ...formData,
        vendor: vendor._id,
        google_auth_id: userInfo.sub,
      });
    },
    flow: "implicit",
  });

  useEffect(() => {
    if (message) {
      reset();
      clear("message", null);
      onClose();
    }
  }, [message]);

  useEffect(() => {
    if (!processing) {
      setLoading(false);
    }
  }, [processing]);

  return (
    <>
      <Modal
        open={show}
        onCancel={onClose}
        title={null}
        footer={null}
        className="modal"
      >
        <div>
          <h1 className="text-2xl font-medium text-center mx-auto my-6">
            Rate{" "}
            <span className="text-[#67a961]">{`${vendor.last_name} ${vendor.first_name}`}</span>
          </h1>
          <form
            className="p-4 min-h-[300px] flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2 justify-center items-center">
              {vendor.image ? (
                <img
                  className="w-28 h-28 rounded-full border bg-white"
                  src={vendor.image}
                  alt={`${vendor.first_name}-${vendor.last_name}`}
                />
              ) : (
                <Avatar className="w-28 h-28 rounded-full border flex justify-center items-center">{`${vendor.first_name.substring(
                  0,
                  1
                )}${vendor.last_name.substring(0, 1)}`}</Avatar>
              )}
              <Controller
                name={"rating"}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Rate
                    defaultValue={0}
                    allowHalf
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="name" className="block mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name here"
                className="form-input w-full rounded-md h-14"
                {...register("name", { required: true })}
              />
            </div>

            <div>
              <label htmlFor="comment" className="block mb-1 ">
                Add comment
              </label>
              <textarea
                id="comment"
                autoComplete="off"
                name="comment"
                rows={3}
                placeholder="Enter your comment"
                className="form-input w-full rounded-md min-h-[100px] py-4 max-h-fit resize-none"
                {...register("comment", { required: true })}
              ></textarea>
            </div>

            <button
              disabled={loading || !isValid}
              className="btn btn-secondary-2 mt-auto mx-auto"
            >
              {loading ? (
                <BiLoaderAlt className="animate-spin text-white text-xl" />
              ) : (
                "Rate Vendor"
              )}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export const ReviewsModal = ({ show, onClose, vendor }) => {
  const {
    miscStore: { processing, getVendorReview, reviews },
  } = useStore();
  const [rate, setRate] = useState<boolean>(false);

  useEffect(() => {
    getVendorReview(vendor._id);
  }, []);

  return (
    <>
      <Modal
        open={show}
        onCancel={onClose}
        title={null}
        footer={null}
        className="modal"
      >
        <Spin spinning={processing} indicator={<Spinner />}>
          <div className="min-h-[400px]">
            <div className="flex items-center my-6 justify-between">
              {reviews.length > 0 ? (
                <>
                  <h1 className="text-2xl font-medium text-start ">
                    Reviews ({reviews.length})
                  </h1>
                  <a
                    className="text-base text-[#67a961] hover:text-[#67a961] ml-2 cursor-pointer"
                    onClick={() => {
                      onClose();
                      setRate(true);
                    }}
                  >
                    Rate Vendor
                  </a>
                </>
              ) : (
                <h1 className="text-2xl font-medium text-start ">Reviews </h1>
              )}
            </div>

            {reviews.length > 0 ? (
              <div className="flex flex-col gap-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-4 border-b last:border-none flex flex-col gap-2"
                  >
                    <div className="flex flex-row items-center gap-2">
                      {/* <img
                    className="w-10 h-10 rounded-full border"
                    src={`https://picsum.photos/200/200?random=3${i}`}
                    alt="Rounded avatar"
                  /> */}
                      <h2 className="text-base font-normal text-gray-500">
                        {review.name}
                      </h2>
                      <Rate
                        allowHalf
                        defaultValue={review.rating}
                        disabled
                        className="text-xs"
                      />
                      <p className="text-sm font-normal text-gray-500 ml-auto">
                        {moment(review.createdAt).fromNow()}
                      </p>
                    </div>
                    <p className="font-normal text-xl">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                message="Be the first to rate this vendor"
                showButton
                buttonText="Rate Vendor"
                buttonAction={() => {
                  onClose();
                  setRate(true);
                }}
              />
            )}
          </div>
        </Spin>
      </Modal>
      <ReviewModal show={rate} onClose={() => setRate(false)} vendor={vendor} />
    </>
  );
};

export const Review: React.FC<{
  rate: number;
  vendor?: IVendor;
  user: any;
}> = ({ rate, vendor, user }) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <div className="flex gap-2 items-center">
        <p className="text-base font-normal text-gray-400">Ratings: </p>
        <Rate disabled defaultValue={rate} allowHalf className="text-base" />
        {vendor._id !== user?._id && (
          <a
            className="text-xs text-[#67a961] hover:text-[#67a961] ml-2 cursor-pointer "
            onClick={() => setShow(true)}
          >
            See reviews
          </a>
        )}
      </div>
      <ReviewsModal
        show={show}
        onClose={() => setShow(false)}
        vendor={vendor}
      />
    </>
  );
};

export const ReportModal = ({ show, onClose, vendor }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<{
    name: string;
    description: string;
    reason: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    reason: string;
  }>();
  const {
    miscStore: { processing, reportVendor, message, clear },
  } = useStore();

  const onSubmit = async (data: {
    name: string;
    description: string;
    reason: string;
  }) => {
    setLoading(true);
    setFormData(data);
    login();
  };

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${codeResponse?.access_token}` },
        })
        .then((res) => res.data);

      reportVendor({ ...formData, vendor, google_auth_id: userInfo.sub });
    },
    flow: "implicit",
  });

  useEffect(() => {
    if (message) {
      reset();
      clear("message", null);
      onClose();
    }
  }, [message]);

  useEffect(() => {
    if (!processing) {
      setLoading(false);
    }
  }, [processing]);

  return (
    <Modal
      open={show}
      onCancel={onClose}
      title={null}
      footer={null}
      className="modal"
    >
      <div>
        <h1 className="text-2xl font-medium text-center mx-auto my-6">
          Why are you Reporting?
        </h1>
        <form
          className="p-4 min-h-[300px] flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor="reason" className="block mb-1">
              Reason
            </label>
            <Controller
              name={"reason"}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <Select
                    id="reason"
                    placeholder="Select"
                    className={`antd-select w-full antd-select-fullwidth`}
                    options={reportReason.map((reason) => ({
                      label: reason,
                      value: reason,
                    }))}
                    {...field}
                  />
                );
              }}
            />
          </div>

          <div>
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name here"
              className="form-input w-full rounded-md h-14"
              {...register("name", { required: true })}
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 ">
              Add comment
            </label>
            <textarea
              id="description"
              autoComplete="off"
              name="description"
              rows={3}
              placeholder="Enter your comment"
              className="form-input w-full rounded-md min-h-[100px] py-4 max-h-fit resize-none"
              {...register("description", { required: true })}
            ></textarea>
          </div>

          <button
            disabled={loading || !isValid}
            className="btn btn-secondary-2 mt-auto mx-auto"
          >
            {loading ? (
              <BiLoaderAlt className="animate-spin text-white text-xl" />
            ) : (
              "Send Report"
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export const ReportButton: React.FC<{
  vendor: string;
}> = ({ vendor }) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <button
        className="btn btn-outline w-full hover:!border-red-600 hover:!bg-red-600 hover:!text-white !text-red-600"
        onClick={() => setShow(true)}
      >
        <BsIcon.BsFlagFill className="text-lg" />
        Report
      </button>
      <ReportModal show={show} onClose={() => setShow(false)} vendor={vendor} />
    </>
  );
};
