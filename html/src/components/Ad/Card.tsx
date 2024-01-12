import useStore from "@/store";
import { IProduct } from "@/typings";
import utils from "@/utils";
import { Avatar } from "antd";
import { Link } from "react-router-dom";
import { Sponsor } from "../Sponsor/Sponsor";
import moment from "moment";

const Card: React.FC<{
  product: IProduct;
  showAuthor?: boolean;
  isOwner?: boolean;
}> = ({ showAuthor = true, isOwner = false, product }) => {
  const {
    authStore: { user },
  } = useStore();

  return (
    <div className="w-full sm:max-w-sm bg-white border border-gray-200 rounded-lg">
      <Link to={`/detail/${product.slug}`} className="overflow-hidden">
        {product.images.length > 0 ? (
          <img
            className="p-2 lg:p-4 rounded-2xl object-cover overflow-hidden h-36 lg:h-64 w-full"
            src={product.images[0].url}
            alt={product.images[0].id}
          />
        ) : (
          <div className="h-36 lg:h-64 w-full bg-gray-100"></div>
        )}
      </Link>
      <div className="px-2 lg:px-5 pb-5 mt-1">
        <div className="flex justify-between gap-2 items-center text-sm font-medium tracking-tight text-gray-900 ">
          <h5 className="truncate">{product.name}</h5>
          <span className="text-[#67a961]">
            {utils.formatMoney(product.price)}
          </span>
        </div>

        <p className="text-xs text-[#889487] mt-1 flex justify-between">
          {product.local_goverment}{" "}
          {isOwner ? (
            product.is_published ? (
              !product.active_promotion ? (
                <Sponsor productId={product._id} where="profile" />
              ) : (
                <span>Promoted</span>
              )
            ) : (
              <span>Unpublished</span>
            )
          ) : (
            product.active_promotion && <span>Sponsored</span>
          )}
        </p>

        {showAuthor && product.vendor && (
          <div className="flex items-center gap-2 justify-between mt-6">
            <Link
              to={
                product?.vendor?._id === user?._id
                  ? `/profile`
                  : `/vendor/${product?.vendor?._id}`
              }
            >
              {product?.vendor?.image ? (
                <img
                  className="w-9 h-9 rounded-full"
                  src={product?.vendor.image}
                  alt={`${product?.vendor?.first_name}-${product?.vendor?.last_name}-${product.name}`}
                />
              ) : (
                <Avatar>{`${product?.vendor?.last_name?.substring(
                  0,
                  1
                )}${product?.vendor?.first_name?.substring(0, 1)}`}</Avatar>
              )}
            </Link>
            <span className="text-[#889487] text-[0.6875rem]">
              {moment(product.createdAt).fromNow()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
