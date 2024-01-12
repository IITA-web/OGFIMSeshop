import { AdOption } from "@/components/AdOption/AdOption";
import SEO from "@/components/Seo/Seo";
import ApiService from "@/services/api";
import useStore from "@/store";
import { useEffect, useMemo, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

const publicKey = import.meta.env.VITE_PAYSTACK;
const api = new ApiService();
// const plan = { days: 7, price: 2000, type: "starter" };

const AdSuccess = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Record<string, any>>(null);
  const {
    authStore: { user },
    productStore: {
      sponsorProduct,
      processing,
      getProductBySlug,
      product,
      message,
    },
    miscStore: { setSpinner },
  } = useStore();

  useEffect(() => {
    getProductBySlug(param["id"]);

    api.Get("/misc/plans").then(({ data }) => {
      setPlan(data[0]);
    });
  }, [param]);

  useEffect(() => {
    if (message === "send") {
      navigate(`/detail/${param["id"]}`);
    }
  }, [message]);

  const config = useMemo<PaystackProps>(() => {
    return {
      reference: uuid(),
      email: user.email,
      amount: plan?.price * 100,
      publicKey: publicKey,
      metadata: {
        product: product?._id,
        custom_fields: [],
      },
    };
  }, [product, user.email]);

  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    const payload = {
      product: product._id,
      paystack_reference: config.reference,
      cost: plan?.price || 0,
      duration: plan?.days || 0,
      type: plan?.type || "starter",
    };

    sponsorProduct(payload, user._id, "detail");
  };

  const handlePromoteNow = () => {
    initializePayment(onSuccess);
  };

  useEffect(() => {
    setSpinner(processing);
  }, [processing]);

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
          <div className="p-0 sm:p-8 md:p-16 w-full xl:max-w-[calc(100%)] mx-auto sm:bg-white">
            <div className="text-center w-full mb-12">
              <h1 className="text-[32px] font-semibold mb-4 text-gray-900 capitalize">
                Ad created succesfully
              </h1>
              <p className="text-sm font-normal text-gray-500">
                You can view your ad by clicking the button below.
              </p>

              <img
                src="/success.svg"
                alt="success"
                className="mx-auto h-60 w-60 mt-12"
              />

              <Link
                to={`/detail/${param["id"]}`}
                className="btn btn-secondary-2 w-fit lg:w-[300px] mx-auto mt-12"
              >
                View ad
              </Link>
            </div>

            {plan && (
              <>
                <div className="w-full border-b mb-6"></div>

                <div className="mx-auto max-w-lg">
                  <h3 className="text-xl font-semibold mb-6 text-center">
                    Promote your Ad
                  </h3>
                  <AdOption
                    price={plan?.price}
                    days={plan?.days}
                    onClick={() => {
                      handlePromoteNow();
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdSuccess;
