import SEO from "@/components/Seo/Seo";
import useStore from "@/store";
import { useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Information: React.FC<{
  info: "terms" | "privacy";
}> = ({ info }) => {
  const {
    miscStore: {
      privacy_policy,
      last_updated_date_privacy_policy,
      last_updated_date_terms_and_conditions,
      terms_and_conditions,
    },
  } = useStore();
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title={`${import.meta.env.VITE_APP_NAME} - ${
          info === "terms" ? "Terms and Condition" : "Privacy Policy"
        }`}
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
            {info === "terms" ? "Terms and Condition" : "Privacy Policy"}
          </h1>
          <p>
            Last Updated:{" "}
            {new Date(
              info === "terms"
                ? last_updated_date_terms_and_conditions
                : last_updated_date_privacy_policy
            ).toDateString()}
          </p>
        </div>

        <div
          className="flex flex-col gap-6 p-6 min-h-[500px] information"
          dangerouslySetInnerHTML={{
            __html: info === "terms" ? terms_and_conditions : privacy_policy,
          }}
        ></div>

        <button
          className="btn btn-secondary-2 !min-h-[48px] !w-[200px]"
          onClick={() => navigate("/")}
        >
          <AiOutlineArrowLeft />
          Back Home
        </button>
      </div>
    </>
  );
};

export default Information;
