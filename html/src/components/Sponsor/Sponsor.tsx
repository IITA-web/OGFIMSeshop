import { Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiFillCrown } from "react-icons/ai";
import "@/styles/Lofi.scss";
import { usePaystackPayment } from "react-paystack";
import { v4 as uuid } from "uuid";
import useStore from "@/store";
import { Location } from "@/store/slices/product.slice";
import { PaystackProps } from "react-paystack/dist/types";
import { AdSelectOption } from "../AdOption/AdOption";
import ApiService from "@/services/api";

const publicKey = import.meta.env.VITE_PAYSTACK;
const api = new ApiService();

export const Sponsor: React.FC<{
  productId: string;
  where?: Location;
}> = ({ productId, where }) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <span
        className="flex items-center gap-1 text-sm text-orange-500 cursor-pointer"
        onClick={() => {
          setShow(true);
        }}
      >
        <AiFillCrown className="text-lg" /> Promote Ad
      </span>
      <SponsorshipModal
        show={show}
        onClose={() => setShow(false)}
        productId={productId}
        where={where || "profile"}
      />
    </>
  );
};

export const SponsorshipModal: React.FC<{
  show: boolean;
  onClose: () => void;
  productId: string;
  where: Location;
}> = ({ show, onClose, productId, where }) => {
  const {
    authStore: { user },
    productStore: { sponsorProduct, processing },
    miscStore: { setSpinner },
  } = useStore();
  const [selectedPlan, setSelectedPlan] = useState(7);
  const [plans, setPlans] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    if (show)
      api.Get("/misc/plans").then(({ data }) => {
        setPlans(data);
      });
  }, [show]);

  const config = useMemo<PaystackProps>(
    () => ({
      reference: uuid(),
      email: user.email,
      amount: plans?.find((plan) => plan.days === selectedPlan)?.price * 100,
      publicKey: publicKey,
      metadata: {
        product: productId,
        custom_fields: [],
      },
    }),
    [selectedPlan, user.email]
  );
  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    const plan = plans?.find((_plan) => _plan.days === selectedPlan);

    const payload = {
      product: productId,
      paystack_reference: config.reference,
      cost: plan?.price,
      duration: plan?.days,
      type: plan?.type,
    };

    sponsorProduct(payload, user._id, where);
  };

  const handlePromoteNow = () => {
    if (selectedPlan) {
      onClose();
      initializePayment(onSuccess);
    }
  };

  useEffect(() => {
    setSpinner(processing);
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
          <h1 className="text-2xl font-medium text-center my-6">Promotion</h1>

          <div className="flex flex-col gap-y-4 pb-6">
            {plans &&
              plans?.length &&
              plans?.map((plan) => (
                <AdSelectOption
                  key={plan?.days}
                  days={plan?.days}
                  price={plan?.price}
                  selected={selectedPlan}
                  onSelect={(days) => setSelectedPlan(days)}
                />
              ))}

            <button
              disabled={!selectedPlan}
              className="btn btn-secondary-2 mt-6 mx-auto"
              onClick={handlePromoteNow}
            >
              Promote Now
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
