import Card from "@/components/Ad/Card";
import { Review } from "@/components/Review/Review";
import { Empty } from "@/components/Other/Misc";
import useStore from "@/store";
import { Avatar } from "antd";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import SEO from "@/components/Seo/Seo";
import TagList from "@/components/Tag/TagList";
import { GoBack } from "@/components/Other/Back";

const VendorPage = () => {
  const params = useParams();
  const {
    productStore: { getVendor, vendorAndProducts, loading },
    miscStore: { setSpinner },
    authStore: { user },
  } = useStore();

  useEffect(() => {
    const id = params["id"];

    if (id) {
      getVendor(id);
    }
  }, [params]);

  useEffect(() => {
    setSpinner(loading);
  }, [loading]);

  return (
    <>
      <SEO
        title={`${vendorAndProducts?.vendor?.last_name} ${vendorAndProducts?.vendor?.first_name}`}
        description=""
        name={`${vendorAndProducts?.vendor?.last_name} ${vendorAndProducts?.vendor?.first_name}`}
        type="article"
        image={vendorAndProducts?.vendor?.image}
        keywords={vendorAndProducts?.vendor?.tags?.join(", ")}
      />
      <div className="flex w-full justify-center min-h-[800px]">
        {vendorAndProducts?.vendor && (
          <div className="w-full xl:max-w-[calc(100%-190px)] 2xl:max-w-[calc(100%-290px)] flex-1 p-6 flex flex-col gap-y-8">
            <div className="place-self-start">
              <GoBack />
            </div>
            <div className="p-0 sm:p-8 md:p-16 w-full xl:max-w-full 2xl:max-w-[calc(100%)] mx-auto sm:bg-white ">
              <div className="border-b mb-2 pb-6 flex flex-col justify-center items-center lg:flex-row  gap-6">
                {vendorAndProducts?.vendor.image ? (
                  <img
                    className="w-28 h-28 rounded-full border bg-white"
                    src={vendorAndProducts?.vendor.image}
                    alt={`${vendorAndProducts?.vendor.first_name}-${vendorAndProducts?.vendor.last_name}-${name}`}
                  />
                ) : (
                  <Avatar className="w-28 h-28 rounded-full border flex justify-center items-center">{`${vendorAndProducts?.vendor.first_name.substring(
                    0,
                    1
                  )}${vendorAndProducts?.vendor.last_name.substring(
                    0,
                    1
                  )}`}</Avatar>
                )}
                <div className="flex flex-col items-center lg:items-start gap-y-2">
                  <h2 className="text-2xl font-medium capitalize flex md:flex-row flex-col items-center gap-2">
                    {`${vendorAndProducts?.vendor.last_name} ${vendorAndProducts?.vendor.first_name}`}
                    <span className="text-xs font-light text-gray-400">
                      Joined since{" "}
                      {new Date(
                        vendorAndProducts?.vendor.createdAt
                      ).getFullYear()}
                    </span>
                  </h2>
                  <TagList
                    tags={vendorAndProducts?.vendor.tags}
                    maximize={true}
                  />

                  <Review
                    rate={vendorAndProducts.rate}
                    vendor={vendorAndProducts.vendor}
                    user={user}
                  />
                </div>
                <div className="w-full lg:max-w-sm lg:ml-auto">
                  {/* <Contact product={product} /> */}
                </div>
              </div>

              <>
                <div className="my-6">
                  <p className="text-lg font-medium">Adverts</p>
                </div>
                {vendorAndProducts?.products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {vendorAndProducts?.products.map((product) => (
                      <Card
                        key={product._id}
                        product={product}
                        showAuthor={false}
                      />
                    ))}
                  </div>
                ) : (
                  <Empty message="Vendor does not have any listings" />
                )}
              </>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VendorPage;
