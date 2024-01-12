import Card from "@/components/Ad/Card";
import { GoBack } from "@/components/Other/Back";
import { Empty } from "@/components/Other/Misc";
import SEO from "@/components/Seo/Seo";
import TagList from "@/components/Tag/TagList";
import useStore from "@/store";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    authStore: { user },
    productStore: { getVendorProducts, myProducts, loading },
    miscStore: { setSpinner },
  } = useStore();

  useEffect(() => {
    getVendorProducts(user._id);
  }, []);

  useEffect(() => {
    setSpinner(loading);
  }, [loading]);

  return (
    <>
      <SEO
        title={`${user?.last_name} ${user?.first_name}`}
        description=""
        name={`${user?.last_name} ${user?.first_name}`}
        type="article"
        image={user?.image}
        keywords={user?.tags?.join(", ")}
      />
      <div className="flex w-full justify-center min-h-[800px]">
        <div className="w-full xl:max-w-[calc(100%-190px)] 2xl:max-w-[calc(100%-290px)] flex-1 p-6 flex flex-col gap-y-8">
          <div className="place-self-start">
            <GoBack />
          </div>
          <div className="p-0 sm:p-8 md:p-16 w-full xl:max-w-full 2xl:max-w-[calc(100%)] mx-auto sm:bg-white">
            <div className="border-b mb-2 pb-6 flex flex-col justify-center items-center lg:flex-row  gap-6">
              <img
                className="w-28 h-28 rounded-full border bg-white"
                src={user?.image || "https://picsum.photos/200/200?random=313"}
                alt="Rounded avatar"
              />
              <div className="flex flex-col items-center lg:items-start gap-y-2">
                <h2 className="text-2xl font-medium capitalize flex items-center gap-2">
                  {user?.last_name} {user?.first_name}
                </h2>
                <TagList tags={user?.tags} />
                <span className="text-xs font-light text-gray-400">
                  Joined since {new Date(user?.createdAt).getFullYear()}
                </span>
              </div>
              <div className="w-full lg:max-w-sm lg:ml-auto text-center">
                <button
                  className="btn btn-secondary-2 mt-auto mb-4 w-full ml-auto"
                  onClick={() => navigate("/profile/edit")}
                >
                  Edit Profile
                </button>
                <Link
                  to={`/vendor/${user?._id}`}
                  className="text-[#67A961] m-0 hover:text-[#7ab875] text-xs font-semibold flex items-center gap-2 justify-center"
                >
                  View my public profile
                </Link>
              </div>
            </div>

            <div>
              <div className="my-6">
                <p className="text-lg font-medium">My Adverts</p>
              </div>
              {myProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {myProducts.map((product) => (
                    <Card
                      key={product._id}
                      product={product}
                      showAuthor={false}
                      isOwner={true}
                    />
                  ))}
                </div>
              ) : (
                <Empty
                  message="You don't have any listings"
                  showButton
                  buttonText="Create Add"
                  buttonAction={() => navigate("/ad/new")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
