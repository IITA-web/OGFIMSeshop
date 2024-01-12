import * as BsIcon from "react-icons/bs";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { IProduct } from "@/typings";
import { useForm } from "react-hook-form";
import useStore from "@/store";
import { BiLoaderAlt } from "react-icons/bi";

const Contact: React.FC<{ product: IProduct }> = ({ product }) => {
  const [callback, setCallback] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2 lg:gap-y-4 lg:max-w-full w-full">
      <ul className="flex gap-2">
        {product.show_whatsapp && (
          <li className="grow">
            <a
              target="_blank"
              href={`https://wa.me/234${
                product.vendor.phone_number
              }?text=${encodeURIComponent(
                `Hello ${product.vendor.last_name} ${product.vendor.first_name},\n\nI have an enquiry on your advert ${window.location.href} on OGFIMS eShop`
              )}`}
              className="btn btn-secondary-4 px-2"
            >
              <BsIcon.BsWhatsapp /> WhatsApp
            </a>
          </li>
        )}

        {product.show_email && (
          <li className="grow">
            <a
              className="btn btn-secondary-4"
              href={`mailto:${product.vendor.email}?
            subject=${`Enquiry on ${product.name}`}&body=${`Hello ${product.vendor.last_name} ${product.vendor.first_name},\n\nI have an enquiry on your advert ${window.location.href} on OGFIMS eShop`}`}
            >
              <BsIcon.BsEnvelope /> Email
            </a>
          </li>
        )}
        {product.show_phone_number && (
          <li className="grow">
            <a
              href={`tel:+234${product.vendor.phone_number}`}
              className="btn btn-secondary-4"
            >
              <BsIcon.BsTelephone /> Phone
            </a>
          </li>
        )}
      </ul>
      {/* <button
        className="btn btn-secondary-2 w-full"
        onClick={() => setCallback(true)}
      >
        Request call back
      </button> */}

      <CallbackModal
        show={callback}
        vendor={product.vendor._id}
        onClose={() => {
          setCallback(false);
        }}
      />
    </div>
  );
};

export default Contact;

export const CallbackModal = ({ show, onClose, vendor }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<{
    name: string;
    phone: string;
  }>();
  const {
    miscStore: { processing, requestCallback, message, clear },
  } = useStore();

  const onSubmit = async (data: { name: string; phone: string }) => {
    await requestCallback({ ...data, vendor, product: window.location.href });
  };

  useEffect(() => {
    if (message) {
      reset();
      clear("message", null);
      onClose();
    }
  }, [message]);

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
            Request Callback
          </h1>
          <form
            className="p-4 min-h-[300px] flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label htmlFor="name" className="block mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="off"
                placeholder="Enter your name here"
                className="form-input w-full rounded-md h-14"
                {...register("name", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1 ">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                autoComplete="off"
                name="phone"
                inputMode="tel"
                placeholder="Enter your phone number here"
                className="form-input w-full rounded-md h-14"
                {...register("phone", { required: true })}
              />
            </div>

            <button
              disabled={processing || !isValid}
              className="btn btn-secondary-2 mt-auto mx-auto"
            >
              {processing ? (
                <BiLoaderAlt className="animate-spin text-white text-xl" />
              ) : (
                "Request Call back"
              )}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};
